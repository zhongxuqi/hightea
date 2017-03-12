import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Language from '../language/index.js'
import DocConfig from '../config/document.js'

export default class StatusView extends Component {
    formatStatus(status) {
        switch (status) {
            case DocConfig.status[0].value:
                return Language.textMap(DocConfig.status[0].label)
            case DocConfig.status[1].value:
                return Language.textMap(DocConfig.status[1].label)
            case DocConfig.status[2].value:
                return Language.textMap(DocConfig.status[2].label)
            case DocConfig.status[3].value:
                return Language.textMap(DocConfig.status[3].label)
            default:
                return ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.formatStatus(this.props.status)}</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        backgroundColor: BaseCSS.colors.info,
        borderRadius: 2,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    text: {
        fontSize: BaseCSS.font.subcontentSize,
        color: BaseCSS.colors.white,
    },
})
