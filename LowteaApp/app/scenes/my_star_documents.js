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

export default class MyStarDocumentsScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
            documents: [],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getDocuments()
        })
    }
    
    onBackClick() {
        this.props.navigator.pop()
    }

    getDocuments() {
        Server.GetStarDocuments(((resp)=>{
            if (resp.documents == null) return
            this.setState({
                documents: resp.documents,
            })
        }).bind(this), (resp)=>{
            Alert.alert("Error", resp)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <HeadBar onBackClick={this.onBackClick.bind(this)} title={Language.textMap("My Stared Documents")}/>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.documents)}
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
})
