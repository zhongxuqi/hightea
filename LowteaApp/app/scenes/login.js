import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Language from '../language/index.js'
import BaseCSS from '../config/css.js'

export default class LoginScene extends Component {
    constructor(props) {
        super(props)
        this.state = {}
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
                        placeholder={Language.textMap("Please Input Account")}/>
                </View>
                <View style={styles.textInputBg}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid={BaseCSS.colors.transparent}
                        placeholderTextColor={'grey'}
                        selectionColor={'white'}
                        placeholder={Language.textMap("Please Input Password")}/>
                </View>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={()=>{}}>
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
        padding: 5,
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
