import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    ListView,
    Text,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import DocumentShortCut from './document_shortcut.js'

export default class NewsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageInfo: {
                pageSize: 10,
                pageIndex: 0,
                keyword: "",
            },
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            documents: [],
        }
        this.getDocuments()
    }

    getDocuments() {
        Server.GetDocuments(this.state.pageInfo, ((resp)=>{
            this.setState({documents: JSON.parse(resp._bodyText).documents})
        }).bind(this), (resp)=>{
            Alert.alert("Error", resp)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.documents)}
                    renderRow={(document)=>{
                        return (
                            <DocumentShortCut document={document}/>
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
