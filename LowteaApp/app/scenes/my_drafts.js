import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableHighlight,
    InteractionManager,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import DocumentShortCut from '../components/document_shortcut.js'
import Language from '../language/index.js'
import HeadBar from '../components/headbar.js'
import EventUtils from '../utils/events.js'

export default class MyDraftsScene extends Component {
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
    }

    componentDidMount() {
        this.mylistener = this.getDocuments.bind(this, 0)
        EventUtils.On("refreshSelfDocs", this.mylistener)
        InteractionManager.runAfterInteractions((() => {
            this.getDocuments(0)
        }).bind(this))
    }

    componentWillUnmount() {
        EventUtils.RemoveListener("refreshSelfDocs", this.mylistener)
    }
    
    onBackClick() {
        this.props.navigator.pop()
    }

    getDocuments(pageIndex) {
        if (pageIndex >= this.state.pageInfo.pageTotal) return
        Server.GetDrafts({
            pageSize: this.state.pageInfo.pageSize,
            keyword: this.state.pageInfo.keyword,
            pageIndex: pageIndex,
        }, ((resp)=>{
            if (resp.documents == null) return
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
    
    onPostDocumentStatus(document) {
        Server.PostDocumentStatus(document, ((resp)=>{
            this.getDocuments(0)
        }).bind(this))
    }

    render() {
        return (
            <View style={styles.container}>
                <HeadBar onBackClick={this.onBackClick.bind(this)} title={Language.textMap("My Drafts")}/>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.documents)}
                    onEndReached={(()=>{
                        this.getDocuments(this.state.pageInfo.pageIndex + 1)
                    }).bind(this)}
                    renderRow={(document)=>{
                        return (
                            <DocumentShortCut document={document} navigator={this.props.navigator} enableStatus={true} enableModal={true} enableEdit={true}
                                onPostDocumentStatus={this.onPostDocumentStatus.bind(this)} onRefreshDocuments={(()=>{
                                    this.getDocuments(0)
                                }).bind(this)}/>
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
