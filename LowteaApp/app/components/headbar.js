import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Language from '../language/index.js'
import BaseCSS from '../config/css.js'

export default class HeadBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            backPress: false,
        }
    }

    render() {
        return (
            <View style={styles.headbar}>
                <TouchableHighlight onPress={this.props.onBackClick}
                    onHideUnderlay={(()=>{
                        this.setState({backPress: false})
                    }).bind(this)}
                    onShowUnderlay={(()=>{
                        this.setState({backPress: true})
                    }).bind(this)}
                    underlayColor={BaseCSS.colors.green}>
                    <View style={{height: 40, paddingHorizontal: 18, alignItems:'center', justifyContent: 'center'}}>
                        <Icon name="angle-left" size={30} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.backPress]}/>
                    </View>
                </TouchableHighlight>
                <View style={{flex: 1, flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    headbar: {
        flexDirection: 'row',
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: BaseCSS.font.titleSize,
        color: BaseCSS.colors.green,
        textAlign: 'center',
    },
})
