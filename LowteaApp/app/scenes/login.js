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
            Server.login(this.state.account, this.state.password, ((res)=>{
                this.props.navigator.resetTo({
                    component: MainScene
                })
            }).bind(this), (res)=>{
                Alert.alert(Language.textMap("Login Failed"), Language.textMap("Account or password is wrong"))
            })
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
            <ScrollView>
                <View style={styles.container}>
                    <Image style={{width:100,height:100,marginBottom:20}} source={require("../../img/icon.png")}/>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.title}>
                            {Language.textMap("Welcome to lowtea")}
                        </Text>
                    </View>
                    {
                        {
                            login: (
                                <View style={styles.form}>
                                    <Text style={styles.subtitle}>{Language.textMap("Account")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.account}
                                            onChangeText={((text)=>{
                                                this.setState({account: text})
                                            }).bind(this)}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("Password")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
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
                                    <Text style={styles.subtitle}>{Language.textMap("Account")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_account}
                                            onChangeText={((text)=>{
                                                this.setState({register_account: text})
                                            }).bind(this)}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("NickName")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_nickname}
                                            onChangeText={((text)=>{
                                                this.setState({register_nickname: text})
                                            }).bind(this)}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("Email")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_email}
                                            onChangeText={((text)=>{
                                                this.setState({register_email: text})
                                            }).bind(this)}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("Resume")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            value={this.state.register_resume}
                                            onChangeText={((text)=>{
                                                this.setState({register_resume: text})
                                            }).bind(this)}
                                            multiline={true}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("Password")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
                                            placeholderTextColor={'grey'}
                                            selectionColor={'white'}
                                            secureTextEntry={true}
                                            value={this.state.register_password}
                                            onChangeText={((text)=>{
                                                this.setState({register_password: text})
                                            }).bind(this)}/>
                                    </View>
                                    <Text style={styles.subtitle}>{Language.textMap("Repeat Password")}</Text>
                                    <View style={styles.textInputBg}>
                                        <TextInput
                                            style={styles.textInput}
                                            underlineColorAndroid={BaseCSS.colors.transparent}
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
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: BaseCSS.colors.bg_grey,
        paddingTop: 100,
        overflow: 'scroll',
    },
    title: {
        flex:1,
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
        marginBottom: 20,
    },
    form: {
        flexDirection:'column',
        borderColor:"#d8dee2",
        borderRadius:4,
        borderWidth:1,
        minWidth: "60%",
        paddingVertical: 30,
        backgroundColor: "#fff",
    },
    subtitle: {
        fontWeight: 'bold',
        marginHorizontal: 40,
        marginBottom: 10,
        fontSize: 18,
        color: "black",
    },
    textInputBg: {
        flexDirection: 'row',
        marginHorizontal: 40,
        backgroundColor: BaseCSS.colors.transparent_white,
        marginBottom: 10,
    },
    textInput: {
        flex: 1,
        fontSize: BaseCSS.font.contentSize,
        color: 'black',
        padding: 7,
        marginBottom: 20,
        borderColor: "#d1d5da",
        borderWidth: 1,
        borderRadius: 4,
    },
    loginBtn: Object.assign(BaseCSS.button, {
        marginHorizontal: 40,
        padding: 8,
        backgroundColor: BaseCSS.colors.green,
    }),
    loginBtnText: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    modeBtn: {
        width: "60%",
        marginHorizontal: 40,
        marginVertical: 15,
        padding: 8,
        backgroundColor: BaseCSS.colors.info,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        borderRadius: 4,
    },
});
