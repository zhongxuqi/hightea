import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import Server from './server/index.js'
import LoginScene from './scenes/login.js'
import MainScene from './scenes/main.js'
import BaseCSS from './config/css.js'
import Language from './language/index.js'
import UserModel from './models/user.js'

export default class WelcomeScene extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        let props = this.props
        setTimeout((()=>{
            Server.GetSelfInfo((resp) => {
                Language.SelectLanguage(resp.user.language)
                UserModel.SetUser(resp.user)
                props.navigator.resetTo({
                    component: MainScene
                })
            }, (err) => {
                props.navigator.push({
                    component: LoginScene,
                })
            })
        }).bind(this), 1000)
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{width:200,height:200}} source={require("../img/icon.png")}/>
                {/*<Text style={styles.welcome}>
                    Welcome to Lowtea!
                </Text>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseCSS.colors.yellow_green,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
});
