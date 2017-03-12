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

export default class RegistersScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            registers: [],
            backPress: false,
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
                <View style={styles.headbar}>
                    <TouchableHighlight onPress={this.onBackClick.bind(this)}
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
                        <Text style={styles.title}>{Language.textMap("Registers")}</Text>
                    </View>
                </View>
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
    },
})
