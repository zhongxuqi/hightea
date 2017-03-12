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

export default class MembersScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            users: [],
            backPress: false,
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
                        <Text style={styles.title}>{Language.textMap("Members")}</Text>
                    </View>
                </View>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.users)}
                    renderRow={(user)=>{
                        return (
                            <UserInfoShortCut user={user}/>
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
