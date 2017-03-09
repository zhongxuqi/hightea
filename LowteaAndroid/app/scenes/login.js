import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
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
                    <TextInput
                        style={styles.textInput}
                        placeholder={Language.textMap("Please Input Account")}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={Language.textMap("Please Input Password")}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Button
                        style={styles.loginBtn}
                        title={Language.textMap("Login")}/>
                </View>
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
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: BaseCSS.font.contentSize,
    margin: 10,
  },
  loginBtn: {
    flex: 1,
    height: 50,
    fontSize: BaseCSS.font.contentSize,
    margin: 10,
  },
});