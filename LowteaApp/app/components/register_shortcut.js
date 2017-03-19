import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import NetConfig from '../config/net.js'
import Server from '../server/index.js'
import Language from '../language/index.js'

export default class RegisterShortCut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            press: false,
        }
    }

    onRegisterClick() {
        Alert.alert("Resume of " + this.props.register.email, this.props.register.resume)
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
                onPress={this.onRegisterClick.bind(this)}>
                <View style={styles.container}>
                    <Text style={{false:styles.register_text,true:styles.register_text_active}[this.state.press]}>{this.props.register.email}</Text>
                    {
                        {
                            false: null,
                            true: (
                                <View style={{flexDirection:'row'}}>
                                    <Button 
                                        onPress={this.props.onAgressClick}
                                        title={Language.textMap("agree")}
                                        color={BaseCSS.colors.success}/>
                                    <Button 
                                        onPress={this.props.onRefuseClick}
                                        title={Language.textMap("refuse")}
                                        color={BaseCSS.colors.warning}/>
                                </View>
                            ),
                        }[this.props.user.role=="admin"||this.props.user.role=="root"]
                    }
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    register_text: {
        flex: 1,
        fontSize: BaseCSS.font.titleSize,
        color: BaseCSS.colors.black,
    },
    register_text_active: {
        flex: 1,
        fontSize: BaseCSS.font.titleSize,
        color: BaseCSS.colors.white,
    },
})
