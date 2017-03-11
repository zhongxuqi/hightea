import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Server from './server/index.js'
import LoginScene from './scenes/login.js'
import MainScene from './scenes/main.js'

export default class WelcomeScene extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        let props = this.props
        Server.GetSelfInfo((res) => {
            props.navigator.push({
                component: MainScene
            })
        }, (err) => {
            props.navigator.push({
                component: LoginScene,
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to Lowtea!
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
