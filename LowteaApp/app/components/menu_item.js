import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'

export default class MenuItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            press: false,
        }
    }

    render() {
        return (
            <TouchableHighlight underlayColor={BaseCSS.colors.green}
                onHideUnderlay={(()=>{
                    this.setState({press: false})
                }).bind(this)}
                onShowUnderlay={(()=>{
                    this.setState({press: true})
                }).bind(this)}
                onPress={this.props.onClick}>
                <View style={styles.container}>
                    <View style={{height: 30, justifyContent: 'center', marginHorizontal: 10}}>
                        <Icon name={this.props.icon} size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.press]}/>
                    </View>
                    <View style={{flex: 1, height: 30, justifyContent: 'center'}}>
                        <Text style={{false:styles.text,true:styles.text_active}[this.state.press]}>{this.props.text}</Text>
                    </View>
                    <View style={{height: 30, justifyContent: 'center'}}>
                        <Icon name="angle-right" size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.press]}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        padding: 7,
    },
    text: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.black,
    },
    text_active: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.white,
    },
})
