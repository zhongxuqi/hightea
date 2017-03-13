import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import Language from '../language/index.js'
import Server from '../server/index.js'
import UserInfoShortCut from '../components/user_info_shortcut.js'
import HeadBar from '../components/headbar.js'

export default class MembersScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            users: [],
        }
        this.getUsers()
    }
    
    onBackClick() {
        this.props.navigator.pop()
    }

    getUsers() {
        Server.GetMembers(((resp)=>{
            if (resp.users == null) return
            this.setState({
                users: resp.users,
            })
        }).bind(this), (resp)=>{
            Alert.alert("Error", resp)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <HeadBar onBackClick={this.onBackClick.bind(this)} title={Language.textMap("Members")}/>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.users)}
                    renderRow={(user)=>{
                        return (
                            <UserInfoShortCut user={user} navigator={this.props.navigator}/>
                        )
                    }}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    }),
})
