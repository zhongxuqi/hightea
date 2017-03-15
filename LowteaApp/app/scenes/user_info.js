import React, {Component} from 'react'
import {
    StyleSheet,
    Alert,
    View,
    TouchableHighlight,
    Text,
    Image,
    Picker,
    Button,
    TextInput,
} from 'react-native'
import Events from 'events'
import ImagePicker from 'react-native-image-picker'
import BaseCSS from '../config/css.js'
import Language from '../language/index.js'
import NetConfig from '../config/net.js'
import HeadBar from '../components/headbar.js'
import Dialog from '../components/dialog.js'
import Server from '../server/index.js'
import LoginScene from './login.js'

let eventEmitter = new Events.EventEmitter()

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
            dialog_value: '',
            dialog_type: 'text',

            oldPassword: '',
            newPassword: '',
            reNewPassword: '',
        }
    }

    onItemClick(item) {
        if (this.props.data.enableEdit !== true) return
        switch (item) {
            case 'headimg':
                ImagePicker.showImagePicker({
                    title: 'Select Head Image',
                    cancelButtonTitle: Language.textMap('CANCEL'),
                    takePhotoButtonTitle: Language.textMap('From Photo'),
                    chooseFromLibraryButtonTitle: Language.textMap('From Image'),
                }, (resp)=>{
                    if (resp.didCancel) {
                    } else if (resp.error) {
                    } else if ( resp.customButton) {
                    } else {
                        Server.PostImage(resp.uri, (resp)=>{
                            Server.PostSelf(Object.assign(this.props.data.user,{
                                headimg: resp.imageUrl, 
                            }), ((resp)=>{
                                eventEmitter.emit("updateUserInfo")
                                this.setState({dialogVisible: false})
                            }).bind(this))
                        }, (resp)=>{
                            Alert.alert(Language.textMap("Error"), JSON.stringify(resp))
                        })
                    }
                })
                break
            case 'nickname':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'User Name Setting',
                    dialog_value: this.props.data.user.nickname,
                    dialog_type: 'text',
                })
                break
            case 'email':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'Email Setting',
                    dialog_value: this.props.data.user.email,
                    dialog_type: 'text',
                })
                break
            case 'userintro':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'Introduce Setting',
                    dialog_value: this.props.data.user.userintro,
                    dialog_type: 'text',
                })
                break
            case 'gender':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'Gender Setting',
                    dialog_value: this.props.data.user.gender,
                    dialog_type: 'gender',
                })
                break
            case 'language':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'Language Setting',
                    dialog_value: this.props.data.user.language,
                    dialog_type: 'language',
                })
                break
            case 'password':
                this.setState({
                    selected_item: item,
                    dialogVisible: true,
                    dialog_title: 'Password Setting',
                    dialog_value: this.props.data.user.language,
                    dialog_type: 'password',
                    oldPassword: '',
                    newPassword: '',
                    reNewPassword: '',
                })
                break
        }
    }

    onActionClick() {
        switch (this.state.selected_item) {
            case 'nickname':
                Server.PostSelf(Object.assign(this.props.data.user,{
                    nickname: this.state.dialog_value, 
                }), ((resp)=>{
                    eventEmitter.emit("updateUserInfo")
                    this.setState({dialogVisible: false})
                }).bind(this))
                break
            case 'email':
                Server.PostSelf(Object.assign(this.props.data.user,{
                    email: this.state.dialog_value, 
                }), ((resp)=>{
                    eventEmitter.emit("updateUserInfo")
                    this.setState({dialogVisible: false})
                }).bind(this))
                break
            case 'userintro':
                Server.PostSelf(Object.assign(this.props.data.user,{
                    userintro: this.state.dialog_value, 
                }), ((resp)=>{
                    eventEmitter.emit("updateUserInfo")
                    this.setState({dialogVisible: false})
                }).bind(this))
                break
            case 'gender':
                Server.PostSelf(Object.assign(this.props.data.user,{
                    gender: this.state.dialog_value, 
                }), ((resp)=>{
                    eventEmitter.emit("updateUserInfo")
                    this.setState({dialogVisible: false})
                }).bind(this))
                break
            case 'language':
                Server.PostSelf(Object.assign(this.props.data.user,{
                    language: this.state.dialog_value, 
                }), ((resp)=>{
                    eventEmitter.emit("updateUserInfo")
                    this.setState({dialogVisible: false})
                }).bind(this))
                break
            case 'password':
                if (this.state.newPassword !== this.state.reNewPassword) {
                    Alert.alert(Language.textMap("Error"), Language.textMap("two new password is not same"))
                    return
                }
                Server.PostPassword(this.state.oldPassword, this.state.newPassword, (resp)=>{
                    this.setState({dialogVisible: false})
                }, (resp)=>{
                    Alert.alert(Language.textMap("Error"), Language.textMap("Password is wrong"))
                })
                break
        }
    }

    onLogoutClick() {
        Alert.alert(Language.textMap("Warning"), Language.textMap("Logout the account") + " ?", [{
            text: 'cancel',
            onPress: ()=>{}
        }, {
            text: "ok",
            onPress: (()=>{
                Server.Logout((resp)=>{
                    this.props.navigator.resetTo({
                        component: LoginScene,
                    })
                })
            }).bind(this)
        }])
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
                                <TextInput value={this.state.dialog_value}
                                    onChangeText={((text)=>{
                                        this.setState({dialog_value: text})
                                    }).bind(this)}/> 
                            ),
                            gender: (
                                <Picker style={{minWidth: 300}} selectedValue={this.state.dialog_value}
                                    onValueChange={((value)=>{
                                        this.setState({dialog_value: value})
                                    }).bind(this)}>
                                    {
                                        Language.GetGenders().map((item, i)=>{
                                            return (
                                                <Picker.Item key={i} label={item.label} value={item.value} />
                                            )
                                        })
                                    }
                                </Picker>
                            ),
                            language: (
                                <Picker style={{minWidth: 300}} selectedValue={this.state.dialog_value}
                                    onValueChange={((value)=>{
                                        this.setState({dialog_value: value})
                                    }).bind(this)}>
                                    {
                                        Language.languages.map((item, i)=>{
                                            return (
                                                <Picker.Item key={i} label={item.value} value={item.short} />
                                            )
                                        })
                                    }
                                </Picker>
                            ),
                            password: (
                                <View style={{flexDirection: 'column'}}>
                                    <TextInput value={this.state.oldPassword}
                                        placeholder={Language.textMap("Please Input Password")}
                                        secureTextEntry={true}
                                        onChangeText={((text)=>{
                                            this.setState({oldPassword: text})
                                        }).bind(this)}/> 
                                    <TextInput value={this.state.newPassword}
                                        placeholder={Language.textMap("Please Input New Password")}
                                        secureTextEntry={true}
                                        onChangeText={((text)=>{
                                            this.setState({newPassword: text})
                                        }).bind(this)}/> 
                                    <TextInput value={this.state.reNewPassword}
                                        placeholder={Language.textMap("Please ReInput New Password")}
                                        secureTextEntry={true}
                                        onChangeText={((text)=>{
                                            this.setState({reNewPassword: text})
                                        }).bind(this)}/> 
                                </View>
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
                    onPress={this.onItemClick.bind(this, 'headimg')}>
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
                    onPress={this.onItemClick.bind(this, 'email')}>
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
                    onPress={this.onItemClick.bind(this, 'userintro')}>
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
                    onPress={this.onItemClick.bind(this, 'gender')}>
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
                    onPress={this.onItemClick.bind(this, 'language')}>
                    <View style={styles.info_item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.languagePress]}>
                                { Language.textMap("Language") }
                            </Text>
                        </View>
                        <Text style={{false:styles.info_item_text,true:styles.info_item_text_active}[this.state.languagePress]}>
                            { Language.Short2Language(this.props.data.user.language) }
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
                    onPress={this.onItemClick.bind(this, 'password')}>
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

                {
                    {
                        false: null,
                        true: (
                            <TouchableHighlight style={{flexDirection: 'column'}} underlayColor={BaseCSS.colors.transparent}
                                onPress={this.onLogoutClick.bind(this)}>
                                <Text style={styles.logoutBtn}>{Language.textMap("Logout")}</Text>
                            </TouchableHighlight>
                        ),
                    }[this.props.data.enableEdit===true]
                }
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
    logoutBtn: {
        color: BaseCSS.colors.white,
        backgroundColor: BaseCSS.colors.warning,
        fontSize: BaseCSS.font.contentSize,
        marginHorizontal: 50,
        marginVertical: 10,
        padding: 7,
        borderRadius: 3,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})
