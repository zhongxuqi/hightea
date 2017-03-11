import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import BaseCSS from '../config/css.js'

export default class DocumentShortCut extends Component {
    render() {
        return (
                <View style={styles.container}>
                    <Text>{this.props.document.title}</Text>
                </View>
        )
    }
}

const styles=StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    })
})
