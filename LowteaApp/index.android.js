/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator
} from 'react-native';
import WelcomeScene from './app/index.js'

export default class LowteaApp extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ component: WelcomeScene }}
        renderScene={(route, navigator) => {
          let TargetComponent = route.component
          return <TargetComponent navigator={navigator}></TargetComponent>
        }}
      ></Navigator>
    );
  }
}

AppRegistry.registerComponent('LowteaApp', () => LowteaApp);
