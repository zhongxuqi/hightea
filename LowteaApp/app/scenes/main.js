import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import BaseCSS from '../config/css.js'
import MainTabBar from '../components/maintabbar.js'

export default class MainScene extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <Text>Main Lowtea</Text>
                </View>
                <MainTabBar/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    }),
    main: {
        flex: 1,
    },
})
