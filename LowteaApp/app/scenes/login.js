import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
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

    render() {
        return (
            <View style={styles.container}>
                <Image style={{width:100,height:100,marginBottom:20}} source={require("../../img/icon.png")}/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title}>
                        {Language.textMap("Welcome to lowtea")}
                    </Text>
                </View>
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
            </View>
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
        minWidth: 400,
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
});
