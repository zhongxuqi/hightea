import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import UserInfoShortCut from './user_info_shortcut.js'
import MenuItem from './menu_item.js'
import Language from '../language/index.js'

export default class UserView extends Component {
    constructor(props) {
        super(props)
        this.state={
            user: {},
        }
    }

    getSelfInfo() {
        Server.GetSelfInfo((resp)=>{
            this.setState({
                user: resp.user,
            })
        })
    }

    createNewPaper() {
    
    }

    showMyDrafts() {
    
    }

    showMembers() {
    
    }

    showJoinMessages() {
        
    }

    render() {
        return (
            <ScrollView style={BaseCSS.container}>
                <UserInfoShortCut user={this.state.user}/>
                <MenuItem icon={"plus"} text={Language.textMap("Create New Paper")} onClick={this.createNewPaper}/>
                <MenuItem icon={"file-text"} text={Language.textMap("My Drafts")} onClick={this.showMyDrafts}/>
                <MenuItem icon={"group"} text={Language.textMap("Members")} onClick={this.showMembers}/>
                <MenuItem icon={"address-book-o"} text={Language.textMap("Join Messages")} onClick={this.showJoinMessages}/>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
})
