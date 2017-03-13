import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableOpacity,
} from 'react-native'
import BaseCSS from '../config/css.js'

export default class Dialog extends Component {
    render() {
        return (
            <Modal visible={this.props.visible} 
                transparent={true}
                onRequestClose={()=>{}}>
                <View style={{flex: 1, backgroundColor:BaseCSS.colors.transparent_black, alignItems:'center', justifyContent:'center'}}>
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row', borderBottomColor: BaseCSS.colors.separation_line, borderBottomWidth:1, padding: 5}}>
                            <Text style={{flex: 1, fontSize: BaseCSS.font.contentSize, color: BaseCSS.colors.black, fontWeight: 'bold'}}>{this.props.title}</Text>
                        </View>
                        <View style={{flexDirection: 'column', padding: 10}}>
                            {
                                this.props.children
                            }
                        </View>
                        <View style={styles.footer}>
                            {
                                this.props.buttons.map((item, i)=>{
                                    return (
                                        <TouchableOpacity key={i} onPress={item.func}>
                                            <Text style={styles.button}>{item.text}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: BaseCSS.colors.white,
        borderRadius: 3,
        minWidth: 200,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 7,
        borderTopColor: BaseCSS.colors.separation_line,
        borderTopWidth: 1,
    },
    button: {
        minWidth: 50,
        marginRight: 5, 
        color: BaseCSS.colors.info, 
        fontSize: BaseCSS.font.contentSize, 
        fontWeight: 'bold',
        textAlign: 'center',
    }
})
