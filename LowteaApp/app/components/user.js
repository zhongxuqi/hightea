import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native'
import Events from 'events'
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import UserInfoShortCut from './user_info_shortcut.js'
import MenuItem from './menu_item.js'
import Language from '../language/index.js'
import MyDocumentsScene from '../scenes/my_documents.js'
import MyStarDocumentsScene from '../scenes/my_star_documents.js'
import MyDraftsScene from '../scenes/my_drafts.js'
import MembersScene from '../scenes/members.js'
import RegistersScene from '../scenes/registers.js'
import DocEditorScene from '../scenes/doc_editor.js'

let eventEmitter = new Events.EventEmitter()

export default class UserView extends Component {
    constructor(props) {
        super(props)
        this.state={
            user: {},
        }
        eventEmitter.on("updateUserInfo", this.getSelfInfo.bind(this))
    }

    componentDidMount() {
        this.getSelfInfo()
    }

    getSelfInfo() {
        Server.GetSelfInfo(((resp) => {
            this.setState({
                user: resp.user,
            })
        }).bind(this))
    }

    createNewPaper() {
        this.props.navigator.push({
            component: DocEditorScene,
        })
    }

    showMyDrafts() {
        this.props.navigator.push({
            component: MyDraftsScene,
        })
    }

    showMyDocuments() {
        this.props.navigator.push({
            component: MyDocumentsScene,
            data: {
                user: this.state.user,
            },
        })
    }

    showMyStarDocuments() {
        this.props.navigator.push({
            component: MyStarDocumentsScene,
        })
    }

    showMembers() {
        this.props.navigator.push({
            component: MembersScene,
        })
    }

    showRegisters() {
        this.props.navigator.push({
            component: RegistersScene,
        })
    }

    render() {
        return (
            <ScrollView style={BaseCSS.container}>
                <UserInfoShortCut user={this.state.user} enableEdit={true} navigator={this.props.navigator}/>
                <MenuItem icon={"plus"} text={Language.textMap("Create New Paper")} onClick={this.createNewPaper.bind(this)}/>
                <MenuItem icon={"file-text"} text={Language.textMap("My Drafts")} onClick={this.showMyDrafts.bind(this)}/>
                <MenuItem icon={"book"} text={Language.textMap("My Documents")} onClick={this.showMyDocuments.bind(this)}/>
                <MenuItem icon={"star"} text={Language.textMap("My Stared Documents")} onClick={this.showMyStarDocuments.bind(this)}/>
                <MenuItem icon={"group"} text={Language.textMap("Members")} onClick={this.showMembers.bind(this)}/>
                <MenuItem icon={"address-book-o"} text={Language.textMap("Show Registers")} onClick={this.showRegisters.bind(this)}/>
            </ScrollView>
        )
    }
}
