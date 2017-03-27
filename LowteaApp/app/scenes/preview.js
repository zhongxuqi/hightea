import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    WebView,
    InteractionManager,
    Linking,
} from 'react-native'
import marked from 'marked'
import BaseCSS from '../config/css.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import NetConfig from '../config/net.js'
import Server from '../server/index.js'
import User from '../models/user.js'
import Language from '../language/index.js'

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

export default class PreviewScene extends Component {
    constructor(props) {
        super(props)
        this.state={
            backPress: false,
            starPress: false,
            flagPress: false,
            document: {content:""},
            flag: false,
            star: true,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getDocument(this.props.data.document.id)
        })
    }

    getDocument(documentId) {
        Server.GetDocument(documentId, ((resp)=>{
            this.setState({
                document: resp.document,
                flag: resp.flag,
                star: resp.star,
            })
        }).bind(this))
    }

    onBackClick() {
        this.props.navigator.pop()
    }

    onStarClick() {
        let action
        if (this.state.star) {
            action="unstar"
        } else {
            action="star"
        }
        Server.ActionDocumentStar(this.props.data.document.id, action, ((resp)=>{
            this.getDocument(this.props.data.document.id)
        }).bind(this), (resp)=>{
            Alert.alert("Error " + action, resp)
        })
    }

    onFlagClick() {
        if (User.GetUser().role !== 'admin' && User.GetUser().role !== 'root') return
        let action
        if (this.state.flag) {
            action="unflag"
        } else {
            action="flag"
        }
        Server.ActionDocumentFlag(this.props.data.document.id, action, ((resp)=>{
            this.getDocument(this.props.data.document.id)
        }).bind(this), (resp)=>{
            Alert.alert("Error " + action, resp)
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
                        <Text style={styles.title}>{Language.textMap("Document Content")}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'flex-end'}}>
                        <TouchableHighlight onPress={this.onStarClick.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({starPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({starPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={styles.headLeftBtn}>
                                <Icon name={{false:"star-o",true:"star"}[this.state.star]} size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.green}[this.state.starPress||this.state.star]}/>
                                <Text style={[{false: {color:BaseCSS.colors.black}, true: {color:BaseCSS.colors.green}}[this.state.star], {false:styles.headLeftBtnText,true:styles.headLeftBtnTextActive}[this.state.starPress]]}>{this.state.document.starNum}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.onFlagClick.bind(this)}
                            onHideUnderlay={(()=>{
                                this.setState({flagPress: false})
                            }).bind(this)}
                            onShowUnderlay={(()=>{
                                this.setState({flagPress: true})
                            }).bind(this)}
                            underlayColor={BaseCSS.colors.green}>
                            <View style={styles.headLeftBtn}>
                                <Icon name={{false:"flag-o",true:"flag"}[this.state.flag]} size={20} color={{false:BaseCSS.colors.black,true:BaseCSS.colors.green}[this.state.flagPress||this.state.flag]}/>
                                <Text style={[{false: {color:BaseCSS.colors.black}, true: {color:BaseCSS.colors.green}}[this.state.flag], {false:styles.headLeftBtnText,true:styles.headLeftBtnTextActive}[this.state.flagPress]]}>{this.state.document.flagNum}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <WebView source={{html:marked("## "+this.state.document.title+"\n***\n" + this.state.document.content), baseUrl:NetConfig.Host}} ref="webview"
                    onNavigationStateChange={((navState)=>{
                        if (navState.url.indexOf(NetConfig.Host) < 0 && navState.url.indexOf("://") > 0) {
                            this.refs.webview.stopLoading()
                            Linking.openURL(navState.url);
                        }
                    }).bind(this)}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column'
    }),
    headbar: {
        flexDirection: 'row',
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    headLeftBtn: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    headLeftBtnText: {
        marginLeft: 4,
        fontSize: BaseCSS.font.contentSize,
    },
    headLeftBtnTextActive: {
        marginLeft: 4,
        fontSize: BaseCSS.font.contentSize,
        color: BaseCSS.colors.white,
    },
    title: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: BaseCSS.font.titleSize,
        color: 'black',
    },
})
