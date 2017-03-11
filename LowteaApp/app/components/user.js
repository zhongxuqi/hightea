import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import BaseCSS from '../config/css.js'

export default class UserView extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>User Page</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    }),
})
