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
                pageSize: 15,
                pageIndex: 0,
                keyword: "",
                pageTotal: 1,
            },
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            documents: [],
        }
        this.getDocuments(0)
    }

    getDocuments(pageIndex) {
        if (pageIndex >= this.state.pageInfo.pageTotal) return
        Server.GetDocuments({
            pageSize: this.state.pageInfo.pageSize,
            keyword: this.state.pageInfo.keyword,
            pageIndex: pageIndex,
        }, ((resp)=>{
            let documents = this.state.documents
            if (pageIndex == 0) {
                documents = resp.documents
            } else {
                resp.documents.forEach((document)=>{
                    for (let i=0;i<documents.length;i++) {
                        if (document.id == documents[i].id) {
                            return
                        }
                    }
                    documents.push(document)
                })
            }
            this.state.pageInfo.pageIndex = pageIndex
            this.state.pageInfo.pageTotal = resp.pageTotal
            this.setState({
                documents: documents,
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
                    onEndReached={(()=>{
                        this.getDocuments(this.state.pageInfo.pageIndex + 1)
                    }).bind(this)}
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
