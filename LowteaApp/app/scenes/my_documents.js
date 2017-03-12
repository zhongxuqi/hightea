import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseCSS from '../config/css.js'
import Server from '../server/index.js'
import DocumentShortCut from '../components/document_shortcut.js'
import Language from '../language/index.js'

export default class MyDocumentsScene extends Component {
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
            backPress: false,
        }
        this.getDocuments(0)
    }
    
    onBackClick() {
        this.props.navigator.pop()
    }

    getDocuments(pageIndex) {
        if (pageIndex >= this.state.pageInfo.pageTotal) return
        Server.GetDocuments({
            pageSize: this.state.pageInfo.pageSize,
            keyword: this.state.pageInfo.keyword,
            pageIndex: pageIndex,
            account: this.props.data.user.account,
        }, ((resp)=>{
            console.log(resp)
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
                        <Text style={styles.title}>{Language.textMap("My Documents")}</Text>
                    </View>
                </View>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.documents)}
                    onEndReached={(()=>{
                        this.getDocuments(this.state.pageInfo.pageIndex + 1)
                    }).bind(this)}
                    renderRow={(document)=>{
                        return (
                            <DocumentShortCut document={document} navigator={this.props.navigator}/>
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
