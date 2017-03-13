import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import Language from '../language/index.js'
import RegisterShortCut from '../components/register_shortcut.js'
import HeadBar from '../components/headbar.js'

export default class RegistersScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            registers: [],
        }
        this.getRegisters()
    }
    
    onBackClick() {
        this.props.navigator.pop()
    }
    
    getRegisters() {
        Server.GetRegisters(((resp)=>{
            if (resp.registers == null) resp.registers = []
            this.setState({
                registers: resp.registers,
            })
        }).bind(this), (resp)=>{
            Alert.alert("Error", resp)
        })
    }

    agreeRegister(account) {
        Alert.alert(Language.textMap("Notice"), Language.textMap("agree the register of") + " " + account + " ?", [{
            text: Language.textMap("ok"),
            onPress: (()=>{
                Server.ActionRegister(account, "agree", ((resp)=>{
                    this.getRegisters()
                }).bind(this))
            }).bind(this)
        }, {
            text: Language.textMap("cancel"),
            onPress: ()=>{},
        }])
    }
    
    refuseRegister(account) {
        Alert.alert(Language.textMap("Warning"), Language.textMap("Refuse the register of") + " " + account + " ?", [{
            text: Language.textMap("ok"),
            onPress: (()=>{
                Server.ActionRegister(account, "deny", ((resp)=>{
                    this.getRegisters()
                }).bind(this))
            }).bind(this)
        }, {
            text: Language.textMap("cancel"),
            onPress: ()=>{},
        }])
    }
    
    render() {
        return (
            <View style={styles.container}>
                <HeadBar onBackClick={this.onBackClick.bind(this)} title={Language.textMap("Registers")}/>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.registers)}
                    renderRow={((register)=>{
                        return (
                            <RegisterShortCut register={register}
                                onRefuseClick={this.refuseRegister.bind(this, register.account)}
                                onAgressClick={this.agreeRegister.bind(this, register.account)}/>
                        )
                    }).bind(this)}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    }),
})
