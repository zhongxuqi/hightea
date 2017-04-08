import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Server from '../server/index.js'
import Language from '../language/index.js'
import BaseCSS from '../config/css.js'
import MainScene from '../scenes/main.js'

export default class LoginScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: "",
            password: "",
            mode: "login",

            register_account: '',
            register_nickname: '',
            register_email: '',
            register_resume: '',
            register_password: '',
            register_repassword: '',
        }
    }

    onLogin() {
        if (this.state.account.length > 0 && this.state.password.length > 0) {
            if (!/^[a-zA-Z0-9]+$/.test(this.state.account)) {
                Alert.alert(Language.textMap("Error"), Language.textMap("Account must be a-z, A-Z and 0-9"))
                return
            }

            Server.login(this.state.account, this.state.password, ((res)=>{
                this.props.navigator.resetTo({
                    component: MainScene
                })
            }).bind(this), (res)=>{
                Alert.alert(Language.textMap("Login Failed"), Language.textMap("Account or password is wrong"))
            })
        } else {
            ToastAndroid.showWithGravity(Language.textMap('Please Input Account and Password'), ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    }

    toggleMode() {
        this.setState({
            mode: {login:"register",register:"login"}[this.state.mode],
        })
    }

    onRegister() {
        if (this.state.register_account.length == 0) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Please Input Account"))
            return
        }
        if (!/^[a-zA-Z0-9]+$/.test(this.state.register_account)) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Account must be a-z, A-Z and 0-9"))
            return
        }
        if (this.state.register_nickname.length == 0) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Please Input Nick Name"))
            return
        }
        if (this.state.register_email.length == 0) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Please Input Email"))
            return
        }
        if (this.state.register_password.length == 0) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Please Input Password"))
            return
        }
        if (this.state.register_password !== this.state.register_repassword) {
            Alert.alert(Language.textMap("Error"), Language.textMap("Password is not equal to the repeat"))
            return
        }
        Server.register({
            account: this.state.register_account,
            nickname: this.state.register_nickname,
            email: this.state.register_email,
            resume: this.state.register_resume,
            password: this.state.register_password,
        }, ((resp)=>{
            this.setState({
                mode: "login",
                register_account: '',
                register_nickname: '',
                register_email: '',
                register_resume: '',
                register_password: '',
                register_repassword: '',
            })
            ToastAndroid.showWithGravity(Language.textMap("register has sent"), ToastAndroid.SHORT, ToastAndroid.CENTER);
        }).bind(this), (resp)=>{
            Alert.alert(Language.textMap("Error"), Language.textMap("Account has registered") + ": " + JSON.stringify(resp))
        })
    }

    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: BaseCSS.colors.bg_login}}>
                <View style={styles.container}>
                    <Image style={{width:150, height: 150,marginBottom:16}} source={require("../../img/icon_white.png")}/>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.title}>
                            {Language.textMap("Welcome to lowtea")}
                        </Text>
                    </View>
                    {
                        {
                            login: (
                                <View style={styles.form}>
                                    <View style={styles.form_item}>
                                        <Icon name="user" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Account")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            keyboardType={"ascii-capable"}
                                            value={this.state.account}
                                            onChangeText={((text)=>{
                                                this.setState({account: text})
                                            }).bind(this)}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="lock" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Password")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            secureTextEntry={true}
                                            value={this.state.password}
                                            onChangeText={((text)=>{
                                                this.setState({password: text})
                                            }).bind(this)}/>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.loginBtn}
                                        onPress={(()=>{this.onLogin()}).bind(this)}>
                                        <Text style={styles.loginBtnText}>{Language.textMap("Login")}</Text>
                                    </TouchableOpacity>
                                </View>
                            ),
                            register: (
                                <View style={styles.form}>
                                    <View style={styles.form_item}>
                                        <Icon name="user" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Account")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            keyboardType={"ascii-capable"}
                                            value={this.state.register_account}
                                            onChangeText={((text)=>{
                                                this.setState({register_account: text})
                                            }).bind(this)}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="id-badge" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("NickName")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_nickname}
                                            onChangeText={((text)=>{
                                                this.setState({register_nickname: text})
                                            }).bind(this)}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="envelope" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Email")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_email}
                                            onChangeText={((text)=>{
                                                this.setState({register_email: text})
                                            }).bind(this)}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="address-card" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Resume")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_resume}
                                            onChangeText={((text)=>{
                                                this.setState({register_resume: text})
                                            }).bind(this)}
                                            multiline={true}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="lock" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Password")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            secureTextEntry={true}
                                            value={this.state.register_password}
                                            onChangeText={((text)=>{
                                                this.setState({register_password: text})
                                            }).bind(this)}/>
                                    </View>
                                    <View style={styles.form_item}>
                                        <Icon name="lock" size={25} style={styles.form_icon}/>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholder={Language.textMap("Repeat Password")}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            secureTextEntry={true}
                                            value={this.state.register_repassword}
                                            onChangeText={((text)=>{
                                                this.setState({register_repassword: text})
                                            }).bind(this)}/>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.loginBtn}
                                        onPress={(()=>{this.onRegister()}).bind(this)}>
                                        <Text style={styles.loginBtnText}>{Language.textMap("Register")}</Text>
                                    </TouchableOpacity>
                                </View>
                            ),
                        }[this.state.mode]
                    }
                    <TouchableOpacity
                        onPress={this.toggleMode.bind(this)}>
                        <Text style={styles.modeBtn}>
                            {
                                {
                                    login: Language.textMap("Go to Register"),
                                    register: Language.textMap("Go to Login"),
                                }[this.state.mode]
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: "8%",
    },
    title: {
        flex:1,
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        marginBottom: 16,
    },
    form: {
        flexDirection:'column',
        width: "80%",
        maxWidth: 400,
        paddingVertical: 15,
    },
    form_item: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: BaseCSS.colors.separation_line,
    },
    form_icon: {
        color: 'white',
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: 'white',
        paddingHorizontal: 3,
        paddingVertical: 0,
        marginLeft: 15,
    },
    loginBtn: Object.assign(BaseCSS.button, {
        padding: 8,
        backgroundColor: BaseCSS.colors.green,
        marginTop: 20,
    }),
    loginBtnText: {
        flex: 1,
        fontSize: 15,
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    modeBtn: {
        width: "80%",
        maxWidth: 400,
        marginVertical: 15,
        padding: 8,
        backgroundColor: BaseCSS.colors.info,
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
    },
});
