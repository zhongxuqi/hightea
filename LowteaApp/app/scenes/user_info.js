import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Image,
    Picker,
    Button,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Language from '../language/index.js'
import NetConfig from '../config/net.js'
import HeadBar from '../components/headbar.js'
import Dialog from '../components/dialog.js'

export default class UserInfoScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headimgPress: false,
            nicknamePress: false,
            emailPress: false,
            userintroPress: false,
            genderPress: false,
            languagePress: false,

            selected_item: '',
            dialogVisible: false,
            dialog_title: '',
            dialog_text: '',
            dialog_type: 'text',
        }
    }

    onItemClick(item) {
        switch (item) {
            case 'nickname':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'User Name Setting',
                    dialog_text: this.props.data.user.nickname,
                    dialog_type: 'text',
                })
                break
        }
    }

    onActionClick() {
        
    }

    render() {
        return (
            <View style={styles.container}>
                <Dialog visible={this.state.dialogVisible} title={this.state.dialog_title} buttons={[{
                    text: 'CANCEL',
                    func: (()=>{this.setState({dialogVisible: false})}).bind(this),
                }, {
                    text: 'OK',
                    func: this.onActionClick.bind(this),
                }]}>
                    {
                        {
                            text: (
                                <View></View> 
                            ),
                        }[this.state.dialog_type]
                    }
                </Dialog>
                <HeadBar onBackClick={(()=>{
                    this.props.navigator.pop()
                }).bind(this)} title={Language.textMap("UserInfo")}/>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({headimgPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({headimgPress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.headimgPress]}>
                                { Language.textMap("Head Image") }
                            </Text>
                        </View>
                        <Image style={{ width: 50, height: 50 }} source={{ uri: NetConfig.Host + NetConfig.FormatHeadImg(this.props.data.user.headimg) }}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({nicknamePress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({nicknamePress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this, 'nickname')}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.nicknamePress]}>
                                { Language.textMap("User Name") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.nicknamePress]}>
                            { this.props.data.user.nickname }
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({emailPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({emailPress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.emailPress]}>
                                { Language.textMap("Email") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.emailPress]}>
                            { this.props.data.user.email }
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({userintroPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({userintroPress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.userintroPress]}>
                                { Language.textMap("Introduce") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.userintroPress]}>
                            { this.props.data.user.userintro }
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({genderPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({genderPress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.genderPress]}>
                                { Language.textMap("Gender") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.genderPress]}>
                            { this.props.data.user.gender }
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({languagePress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({languagePress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.languagePress]}>
                                { Language.textMap("Language") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.languagePress]}>
                            { this.props.data.user.language }
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flexDirection: 'row'}} underlayColor={BaseCSS.colors.green}
                    onHideUnderlay={(()=>{
                        this.setState({passwordPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({passwordPress: true})
                    }).bind(this)}
                    onPress={this.onItemClick.bind(this)}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.passwordPress]}>
                                { Language.textMap("Password") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.passwordPress]}>
                            { "******" }
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    info_item: {
        flex: 1,
        flexDirection: 'row',
        padding: 8,
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    info_item_text: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.black,
    },
    info_item_text_active: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.white,
    },
})
