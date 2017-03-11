import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateUtils from '../utils/date.js'

export default class DocumentShortCut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            press: false
        }
    }

    render() {
        return (
            <TouchableHighlight style={BaseCSS.container} onPress={this.props.onClick} underlayColor={BaseCSS.colors.green}
                onHideUnderlay={(()=>{
                    this.setState({press: false})
                }).bind(this)}
                onShowUnderlay={(()=>{
                    this.setState({press: true})
                }).bind(this)}>
                <View style={styles.container}>
                    <Text style={{false:styles.title,true:styles.title_active}[this.state.press]}>{this.props.document.title}</Text>
                    <View style={styles.infobar}>
                        <Icon name="star" size={BaseCSS.font.contentSize} style={{false:styles.info_icon,true:styles.info_icon_active}[this.state.press]}/>
                        <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{this.props.document.starNum}</Text>
                        <Icon name="pencil" size={BaseCSS.font.contentSize} style={{false:styles.info_icon,true:styles.info_icon_active}[this.state.press]}/>
                        <Text style={{false:styles.info_text,true:styles.info_text_active}[this.state.press]}>{DateUtils.unixtime2String(this.props.document.modifyTime)}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: BaseCSS.font.titleSize,
        margin: 7,
    },
    title_active: {
        fontSize: BaseCSS.font.titleSize,
        margin: 7,
        color: BaseCSS.colors.white,
    },
    infobar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7,
    },
    info_icon: {
        marginRight: 5,
    },
    info_icon_active: {
        marginRight: 5,
        color: BaseCSS.colors.white,
    },
    info_text: {
        fontSize: BaseCSS.font.contentSize,
        marginRight: 10,
    },
    info_text_active: {
        fontSize: BaseCSS.font.contentSize,
        marginRight: 10,
        color: BaseCSS.colors.white,
    },
})
