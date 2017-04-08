import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    InteractionManager,
    Picker,
    Button,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import DateUtils from '../utils/date.js'
import PreviewScene from '../scenes/preview.js'
import StatusView from '../components/status.js'
import DocConfig from '../config/document.js'
import Language from '../language/index.js'
import Dialog from './dialog.js'
import Server from '../server/index.js'
import DocEditorScene from '../scenes/doc_editor.js'

export default class DocumentShortCut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            press: false,
            status: props.document.status,
        }
    }

    onPress() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: PreviewScene,
                data: {
                    document: this.props.document,
                },
            })
        })
    }

    onLongPress() {
        if (this.props.enableModal !== true) return
        this.setState({
            modalVisible: true,
            status: this.props.document.status,
        })
    }

    onOkClick() {
        this.props.onPostDocumentStatus(Object.assign(this.props.document, {
            status: this.state.status,
        }))
        this.setState({
            modalVisible: false,
        })
    }

    onCancelClick() {
        this.setState({
            modalVisible: false,
        })
    }

    onEditDocument(document) {
        this.props.navigator.push({
            component: DocEditorScene,
            data: {
                documentId: document.id,
            },
        })
    }

    onDeleteDocument() {
        Alert.alert(Language.textMap("Danger"), Language.textMap("delete the document") + " [ " + this.props.document.title + " ] ?", [{
            text: Language.textMap("cancel"),
            onPress: ()=>{},
        }, {
            text: Language.textMap("ok"),
            onPress: (()=>{
                Server.DeleteDocument(this.props.document.id, (resp)=>{
                    if (typeof this.props.onRefreshDocuments == "function") {
                        this.props.onRefreshDocuments()
                    }
                })
            }).bind(this),
        }])
    }

    render() {
        let editBtn = (
            <TouchableHighlight underlayColor={BaseCSS.colors.transparent}
                onPress={this.onEditDocument.bind(this, this.props.document)}>
                <View style={{paddingVertical: 3, paddingHorizontal: 6, backgroundColor: BaseCSS.colors.green, borderRadius: 3, marginRight: 10}}>
                    <Icon name="pencil" size={25} style={{color: BaseCSS.colors.white}}/>
                </View>
            </TouchableHighlight>
        )
        let deleteBtn = (
            <TouchableHighlight underlayColor={BaseCSS.colors.transparent}
                onPress={this.onDeleteDocument.bind(this, this.props.document)}>
                <View style={{paddingVertical: 3, paddingHorizontal: 6, backgroundColor: BaseCSS.colors.danger, borderRadius: 3}}>
                    <Icon name="trash-o" size={25} style={{color: BaseCSS.colors.white}}/>
                </View>
            </TouchableHighlight>
        )
        return (
            <TouchableHighlight style={BaseCSS.container} onPress={this.onPress.bind(this)} underlayColor={BaseCSS.colors.green}
                onHideUnderlay={(()=>{
                    this.setState({press: false})
                }).bind(this)}
                onShowUnderlay={(()=>{
                    this.setState({press: true})
                }).bind(this)}
                onLongPress={this.onLongPress.bind(this)}>
                <View style={styles.container}>
                    <Dialog visible={this.state.modalVisible} title={Language.textMap("Select document status")} buttons={[{
                        text: Language.textMap('CANCEL'),
                        func: this.onCancelClick.bind(this),
                    }, {
                        text: Language.textMap('OK'),
                        func: this.onOkClick.bind(this),
                    }]}>
                        <Picker style={{width: 300}} selectedValue={this.state.status}
                            onValueChange={(status) => this.setState({status: status})}>
                            {
                                DocConfig.status.map((item, i)=>{
                                    return (
                                        <Picker.Item key={i} label={Language.textMap(item.label)} value={item.value} />
                                    )
                                })
                            }
                        </Picker>
                    </Dialog>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{false:styles.title,true:styles.title_active}[this.state.press]}>{this.props.document.title}</Text>
                            {
                                {false: null, true:<StatusView status={this.props.document.status}/>}[this.props.enableStatus===true]
                            }
                        </View>
                        <View style={styles.infobar}>
                            <Icon name="star" size={BaseCSS.font.contentSize} style={[{color: BaseCSS.colors.green}, {false:styles.info_icon,true:styles.info_icon_active}[this.state.press]]}/>
                            <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{this.props.document.starNum}</Text>
                            <Icon name="pencil" size={BaseCSS.font.contentSize} style={[{color: BaseCSS.colors.green}, {false:styles.info_icon,true:styles.info_icon_active}[this.state.press]]}/>
                            <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{DateUtils.unixtime2String(this.props.document.modifyTime)}</Text>
                        </View>
                    </View>
                    {
                        {
                            false: null,
                            true: editBtn,
                        }[this.props.enableEdit===true]
                    }
                    {
                        {
                            false: null,
                            true: deleteBtn,
                        }[this.props.enableEdit===true]
                    }
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: BaseCSS.font.titleSize,
        fontWeight: 'bold',
        margin: 7,
        color: "black",
    },
    title_active: {
        fontSize: BaseCSS.font.titleSize,
        fontWeight: 'bold',
        margin: 7,
        color: BaseCSS.colors.white,
    },
    infobar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7,
    },
    info_icon: {
        marginRight: 5,
    },
    info_icon_active: {
        marginRight: 5,
        color: BaseCSS.colors.white,
    },
    info_text: {
        fontSize: BaseCSS.font.contentSize,
        marginRight: 10,
    },
    info_text_active: {
        fontSize: BaseCSS.font.contentSize,
        marginRight: 10,
        color: BaseCSS.colors.white,
    },
})
