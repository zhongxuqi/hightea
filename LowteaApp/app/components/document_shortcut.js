import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    InteractionManager,
    Modal,
    Picker,
    Button,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateUtils from '../utils/date.js'
import PreviewScene from '../scenes/preview.js'
import StatusView from '../components/status.js'
import DocConfig from '../config/document.js'
import Language from '../language/index.js'

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

    onDeleteDocument() {
        if (typeof this.props.onDeleteDocument === 'function') {
            this.props.onDeleteDocument(this.props.document)
        }
    }

    render() {
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
                    <Modal visible={this.state.modalVisible} 
                        transparent={true}
                        onRequestClose={()=>{}}>
                        <View style={{flex: 1, backgroundColor:BaseCSS.colors.transparent_black, alignItems:'center', justifyContent:'center'}}>
                            <View style={{flexDirection: 'column', backgroundColor: BaseCSS.colors.white, padding: 10, borderRadius: 3}}>
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
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <View style={{marginRight: 10}}>
                                        <Button title={Language.textMap("cancel")} onPress={this.onCancelClick.bind(this)}/>
                                    </View>
                                    <View>
                                        <Button title={Language.textMap("ok")} onPress={this.onOkClick.bind(this)}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{false:styles.title,true:styles.title_active}[this.state.press]}>{this.props.document.title}</Text>
                            {
                                {false: null, true:<StatusView status={this.props.document.status}/>}[this.props.enableStatus===true]
                            }
                        </View>
                        <View style={styles.infobar}>
                            <Icon name="star" size={BaseCSS.font.contentSize} style={{false:styles.info_icon,true:styles.info_icon_active}[this.state.press]}/>
                            <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{this.props.document.starNum}</Text>
                            <Icon name="pencil" size={BaseCSS.font.contentSize} style={{false:styles.info_icon,true:styles.info_icon_active}[this.state.press]}/>
                            <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{DateUtils.unixtime2String(this.props.document.modifyTime)}</Text>
                        </View>
                    </View>
                    {
                        {
                            false: null,
                            true: deleteBtn,
                        }[this.props.enableDelete===true]
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
        margin: 7,
    },
    title_active: {
        fontSize: BaseCSS.font.titleSize,
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
