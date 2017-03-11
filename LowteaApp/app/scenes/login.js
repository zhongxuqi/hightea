import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
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
                this.props.navigator.push({
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
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title}>
                        {Language.textMap("Welcome to lowtea")}
                    </Text>
                </View>
                <View style={styles.textInputBg}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid={BaseCSS.colors.transparent}
                        placeholderTextColor={'grey'}
                        selectionColor={'white'}
                        value={this.state.account}
                        onChangeText={((text)=>{
                            this.setState({account: text})
                        }).bind(this)}
                        placeholder={Language.textMap("Please Input Account")}/>
                </View>
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
                        }).bind(this)}
                        placeholder={Language.textMap("Please Input Password")}/>
                </View>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={(()=>{this.onLogin()}).bind(this)}>
                    <Text style={styles.loginBtnText}>{Language.textMap("Login")}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BaseCSS.colors.bg_dark,
    },
    title: {
        flex:1,
        fontSize: BaseCSS.font.titleSize,
        textAlign: 'center',
        color: 'white',
    },
    textInputBg: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginBottom: 10,
        backgroundColor: BaseCSS.colors.transparent_white,
    },
    textInput: {
        flex: 1,
        fontSize: BaseCSS.font.contentSize,
        color: 'white',
        padding: 5,
    },
    loginBtn: Object.assign(BaseCSS.button, {
        marginHorizontal: 40,
        padding: 8,
        backgroundColor: BaseCSS.colors.green,
    }),
    loginBtnText: {
        flex: 1,
        fontSize: BaseCSS.font.contentSize,
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
    },
});
