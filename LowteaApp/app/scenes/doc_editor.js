import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Text,
    WebView,
    ToastAndroid,
    InteractionManager,
    Linking,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Language from '../language/index.js'
import BaseCSS from '../config/css.js'
import StringUtils from '../utils/string.js'
import marked from 'marked'
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});
import NetConfig from '../config/net.js'
import Dialog from '../components/dialog.js'
import ImagePicker from 'react-native-image-picker'
import Server from '../server/index.js'
import EventUtils from '../utils/events.js'
import NavigatorUtil from '../utils/navigator.js'

export default class DocEditorScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            backPress: false,

            previewActive: false,

            previewPress: false, 
            boldPress: false,
            headerPress: false,
            quotePress: false,
            chainPress: false,
            imagePress: false,
            videoPress: false,
            savePress: false,

            document: {
                title: '',
                content: '',
            },
            cursorStart: 0,
            cursorEnd: 0,

            chainDialogVisible: false,
            dialogTitle: '',
            dialogType: 'chain',
            dialogValue: '',

            dialogLinkTitle: '',
            dialogLinkValue: '',
        }
        NavigatorUtil.SetShowAlert(true)
    }

    componentDidMount() {
        if (this.props.data !== undefined) {
            InteractionManager.runAfterInteractions((() => {
                this.getDocument(this.props.data.documentId)
            }).bind(this))
        }
    }

    getDocument(documentId) {
        Server.GetDocument(documentId, ((resp)=>{
            this.setState({
                document: resp.document,
            })
        }).bind(this))
    }

    postDocument() {
        let action
        if (this.state.document.id == undefined) {
            action = "add"
        } else {
            action = "edit"
        }
        if (this.state.document.title.length == 0 || this.state.document.content.length == 0) return
        Server.PostDocument(action, {
            id: this.state.document.id,
            title: this.state.document.title,
            content: this.state.document.content,
            status: {
                true: "status_draft",
                false: this.state.document.status,
            }[action == "add"],
        }, ((resp)=>{
            this.getDocument(resp.id)
            EventUtils.Emit("refreshSelfDocs")
            ToastAndroid.showWithGravity(Language.textMap("Save Success"), ToastAndroid.SHORT, ToastAndroid.CENTER);
        }).bind(this), (resp)=>{
            Alert.alert(Language.textMap("Error"), "Save Failed")
        })
    }

    onBackClick() {
        this.props.navigator.pop()
    }

    togglePreview() {
        this.setState({
            previewActive: !this.state.previewActive,
        })
    }

    toggleBold() {
        if (this.state.previewActive) return
        this.state.document.content = _toggleBlock(this.state.document.content, this.state.cursorStart, this.state.cursorEnd, "bold")
        this.setState({})
    }

    toggleHeading() {
        if (this.state.previewActive) return
        let {before, line, after} = StringUtils.Parse2BeforeLineAfter(this.state.document.content, this.state.cursorStart)
        let headStr = line.match(/^#* /)

        if (headStr == null) {
            this.state.document.content = before + "# " + line + after
        } else {
            headStr = headStr[0]
            if (headStr.length < 7) {
                this.state.document.content = before + "#" + line + after
            } else {
                this.state.document.content = before + line.replace(headStr, "") + after
            }
        }
        this.setState({})
    }

    toggleQuote() {
        if (this.state.previewActive) return
        this.state.document.content = _toggleLineHeader(this.state.document.content, this.state.cursorStart, ">")
        this.setState({})
    }

    toggleChain() {
        if (this.state.previewActive) return
        this.setState({
            chainDialogVisible: true,
            dialogTitle: Language.textMap("Insert Link"),
            dialogLinkTitle: '',
            dialogLinkValue: '',
        })
    }

    toggleImage() {
        if (this.state.previewActive) return
        ImagePicker.showImagePicker({
            title: 'Select Image',
            cancelButtonTitle: Language.textMap('CANCEL'),
            takePhotoButtonTitle: Language.textMap('From Camera'),
            chooseFromLibraryButtonTitle: Language.textMap('From Photo'),
        }, ((resp)=>{
            if (resp.didCancel) {
            } else if (resp.error) {
            } else if ( resp.customButton) {
            } else {
                EventUtils.Emit("showLoadingModal")
                Server.PostImage(resp.uri, ((resp)=>{
                    let start = this.state.document.content.substring(0, this.state.cursorStart),
                        end = this.state.document.content.substring(this.state.cursorStart)
                    this.state.document.content = start + "\n<img src=\""+resp.imageUrl+"\" style=\"max-width:100%\"></img>\n" + end
                    this.setState({})
                    EventUtils.Emit("hideLoadingModal")
                }).bind(this), (resp)=>{
                    EventUtils.Emit("hideLoadingModal")
                    Alert.alert(Language.textMap("Error"), JSON.stringify(resp))
                })
            }
        }).bind(this))
    }

    onCancelClick() {
        this.setState({
            chainDialogVisible: false,
        })
    }

    onOkClick() {
        switch (this.state.dialogType) {
            case 'chain':
                let start = this.state.document.content.substring(0, this.state.cursorStart),
                    end = this.state.document.content.substring(this.state.cursorStart),
                    url = this.state.dialogLinkValue
                if (!/:\/\//.test(url)) url = "http://"+url
                this.state.document.content = start + "["+this.state.dialogLinkTitle+"]("+url+")" + end
                break
        }
        this.setState({
            chainDialogVisible: false,
        })
    }

    render() {
        let timeout = false
        return (
            <View style={{flex: 1,flexDirection: 'column'}}>
                <Dialog visible={this.state.chainDialogVisible} title={this.state.dialogTitle} buttons={[{
                        text: 'CANCEL',
                        func: this.onCancelClick.bind(this),
                    }, {
                        text: 'OK',
                        func: this.onOkClick.bind(this),
                    }]}>
                    {
                        {
                            chain: (
                                <View style={{flexDirection: 'column'}}>
                                    <TextInput value={this.state.dialogLinkTitle}
                                        onChangeText={((text)=>{
                                            this.setState({
                                                dialogLinkTitle: text,
                                            })
                                        }).bind(this)}
                                        placeholder={Language.textMap("please input title")}/>
                                    <TextInput value={this.state.dialogLinkValue}
                                        onChangeText={((text)=>{
                                            this.setState({
                                                dialogLinkValue: text,
                                            })
                                        }).bind(this)}
                                        placeholder={Language.textMap("please input url")}/>
                                </View>
                            ),
                        }[this.state.dialogType]
                    }
                </Dialog>
                <View style={styles.headbar}>
                    <TouchableHighlight onPress={this.onBackClick.bind(this)}
                        onHideUnderlay={(()=>{
                            this.setState({backPress: false})
                        }).bind(this)}
                        onShowUnderlay={(()=>{
                            this.setState({backPress: true})
                        }).bind(this)}
                        underlayColor={BaseCSS.colors.green}>
                        <View style={{height: 40, paddingHorizontal: 18, alignItems:'center', justifyContent: 'center'}}>
                            <Icon name="angle-left" size={30} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.backPress]}/>
                        </View>
                    </TouchableHighlight>
                    <View style={{flex: 1, flexDirection:'row-reverse'}}>
                        <TouchableHighlight onPress={this.postDocument.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({savePress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({savePress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.savePress], {paddingHorizontal: 8}]}>
                                <Icon name="save" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.savePress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.toggleImage.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({imagePress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({imagePress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.imagePress], {paddingHorizontal: 8}]}>
                                <Icon name="file-image-o" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.imagePress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.toggleChain.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({chainPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({chainPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.chainPress], {paddingHorizontal: 8}]}>
                                <Icon name="chain" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.chainPress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.toggleQuote.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({quotePress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({quotePress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.quotePress], {paddingHorizontal: 6}]}>
                                <Icon name="quote-left" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.quotePress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.toggleHeading.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({headerPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({headerPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.headerPress], {paddingHorizontal: 6}]}>
                                <Icon name="header" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.headerPress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.toggleBold.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({boldPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({boldPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.boldPress], {paddingHorizontal: 10}]}>
                                <Icon name="bold" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.boldPress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.togglePreview.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({previewPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({previewPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.previewPress||this.state.previewActive]}>
                                <Icon name="eye" size={25} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.previewPress||this.state.previewActive]}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                {
                    {
                        false: (
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <TextInput style={styles.title} value={this.state.document.title}
                                    onChangeText={((text)=>{
                                        this.state.document.title = text
                                        this.setState({})
                                    }).bind(this)}
                                    placeholder={Language.textMap("Input Title Here")}/>
                                <TextInput style={styles.content}
                                    underlineColorAndroid={BaseCSS.colors.transparent}
                                    multiline={true}
                                    blurOnSubmit={false}
                                    textAlignVertical='top'
                                    value={this.state.document.content}
                                    onChangeText={((text)=>{
                                        this.state.document.content = text
                                        this.setState({})
                                    }).bind(this)}
                                    onSubmitEditing={(()=>{
                                        if (timeout) clearTimeout(timeout)
                                        timeout = setTimeout((()=>{
                                            this.state.document.content += '\n'
                                            this.setState({})
                                            timeout = undefined
                                        }).bind(this), 100)
                                    }).bind(this)}
                                    onSelectionChange={((event)=>{
                                        this.setState({
                                            cursorStart: event.nativeEvent.selection.start,
                                            cursorEnd: event.nativeEvent.selection.end,
                                        })
                                    }).bind(this)}
                                    placeholder={Language.textMap("Input Content Here")}/>
                            </View>
                        ),
                        true: (
                            <WebView source={{html:marked(this.state.document.content), baseUrl:NetConfig.Host}} ref="webview"
                                onNavigationStateChange={((navState)=>{
                                    if (navState.url.indexOf(NetConfig.Host) < 0 && navState.url.indexOf("://") > 0) {
                                        this.refs.webview.stopLoading()
                                        Linking.openURL(navState.url);
                                    }
                                }).bind(this)}/>
                        ),
                    }[this.state.previewActive]
                }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    headbar: {
        flexDirection: 'row',
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    title: {
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
    },
    content: {
        flex: 1,
        textAlign: 'left',
        borderBottomWidth: 0,
    },
    tool_btn: {
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 6,
    },
    tool_btn_active: {
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 6,
        backgroundColor: BaseCSS.colors.green,
    },
})

function _toggleBlock(str, sectionStart, sectionEnd, type) {
    let tag_chars
    switch (type) {
        case 'bold':
            tag_chars = "\\*\\*"
            break
        default:
            tag_chars = "\\*\\*"
            break
    }

    let before = '', section = str.substring(sectionStart, sectionEnd), after = ''
    if (new RegExp(tag_chars + "$").test(str.substring(0, sectionStart))) {
        before = str.substring(0, sectionStart - tag_chars.length)
    } else {
        before = str.substring(0, sectionStart) + "**"
    }
    if (new RegExp("^" + tag_chars).test(str.substring(sectionEnd))) {
        after = str.substring(sectionEnd + tag_chars.length)
    } else {
        after = "**" + str.substring(sectionEnd)
    }
    return before + section + after
}

function _toggleLineHeader(str, cursor, header) {
	let re
    if (header == "*") re = new RegExp("^\\"+header+" ")
    else re = new RegExp("^"+header+" ")

    let {before, line, after} = StringUtils.Parse2BeforeLineAfter(str, cursor)
    if (re.test(line)) {
        return before + line.substring(2) + after
    } else {
        return before + header + " " + line + after
    }
}