import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import NetConfig from '../config/net.js'
import Server from '../server/index.js'

export default class UserInfoShortCut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            headImag: "/img/head.png",
            userPress: false,
        }
        this.getSelfInfo()
    }

    getSelfInfo() {
        Server.GetSelfInfo(((resp) => {
            this.setState({
                user: resp.user,
            })
        }).bind(this))
    }

    formatHeadImg(rawImg) {
        let headImg = rawImg
        if (headImg == "" || headImg == undefined) {
            headImg = "/img/head.png"
        }
        return headImg
    }

    onUserClick() {
    
    }

    render() {
        return (
            <TouchableHighlight underlayColor={BaseCSS.colors.green}
                onHideUnderlay={(()=>{
                    this.setState({userPress: false})
                }).bind(this)}
                onShowUnderlay={(()=>{
                    this.setState({userPress: true})
                }).bind(this)}
                onPress={this.onUserClick.bind(this)}>
                <View style={styles.container}>
                    <Image style={{width: 50, height: 50, marginRight: 10}} source={{uri: NetConfig.Host + this.formatHeadImg(this.state.user.headimg)}}/>
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                        <Text style={{false:styles.userinfo_text,true:styles.userinfo_text_active}[this.state.userPress]}>{this.state.user.account}</Text>
                        <Text style={{false:styles.userinfo_text,true:styles.userinfo_text_active}[this.state.userPress]}>{this.state.user.email}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Icon name="angle-right" size={30} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.white}[this.state.userPress]}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 7,
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
    },
    userinfo_text: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.black,
    },
    userinfo_text_active: {
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.white,
    },
})
