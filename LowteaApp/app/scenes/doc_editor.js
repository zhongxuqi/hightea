import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Text,
    WebView,
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
                content: '',
            },
            cursorStart: 0,
            cursorEnd: 0,
        }
    }

    onBackClick() {
        this.props.navigator.pop()
    }

    togglePreview() {
        this.setState({
            previewActive: !this.state.previewActive,
        })
    }

    toggleHeading() {
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

    render() {
        let timeout = false
        return (
            <View style={{flex: 1,flexDirection: 'column'}}>
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
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
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
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({videoPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({videoPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={[{false:styles.tool_btn,true:styles.tool_btn_active}[this.state.videoPress], {paddingHorizontal: 8}]}>
                                <Icon name="file-video-o" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.videoPress]}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
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
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
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
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
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
                        <TouchableHighlight onPress={(()=>{}).bind(this)}
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
                            <TextInput style={styles.content}
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
                                }).bind(this)}/>
                        ),
                        true: (
                            <WebView source={{html:marked(this.state.document.content), baseUrl:NetConfig.Host}}/>
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
    content: {
        flex: 1,
        textAlign: 'left',
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
