import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    Text,
    ListView,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import DocumentShortCut from './document_shortcut.js'

export default class StarsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            documents: [],
            memberNum: 0,
        }
        this.getTopStarDocuments()
    }
        
    getTopStarDocuments() {
        Server.GetTopStarDocuments(((resp)=>{
            this.setState({
                documents: resp.documents,
                memberNum: resp.adminNum,
            })
        }).bind(this), (resp)=>{
            Alert.alert("Error", resp)
        })
    }
        
    onItemClick(document) {
    
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.documents)}
                    renderRow={(document)=>{
                        return (
                            <DocumentShortCut document={document} onClick={this.onItemClick.bind(this, document)}/>
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
