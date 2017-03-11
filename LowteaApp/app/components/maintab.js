import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'

export default class MainTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            press: false,
        }
    }

    render() {
        return (
            <TouchableHighlight style={BaseCSS.container} underlayColor={BaseCSS.colors.transparent} 
                onHideUnderlay={(()=>{
                    this.setState({press: false})
                }).bind(this)}    
                onShowUnderlay={(()=>{
                    this.setState({press: true})
                }).bind(this)}    
                onPress={this.props.onPress}>
                <View style={{false:styles.button,true:styles.button_active}[this.props.active||this.state.press]}>
                    <Icon name={this.props.icon} size={20} color={{false:BaseCSS.colors.green,true:BaseCSS.colors.white}[this.props.active||this.state.press]}/>
                    <Text style={{false:styles.text,true:styles.text_active}[this.props.active||this.state.press]}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    button: {
        backgroundColor: BaseCSS.colors.transparent,
        borderTopColor: BaseCSS.colors.separation_line,
        borderTopWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
    },
    button_active: {
        backgroundColor: BaseCSS.colors.green,
        borderTopColor: BaseCSS.colors.green,
        borderTopWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
    },
    text: {
        color: BaseCSS.colors.green,
    },
    text_active: {
        color: BaseCSS.colors.white,
    },
})
