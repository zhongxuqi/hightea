import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Language from '../language/index.js'
import BaseCSS from '../config/css.js'

export default class DocEditorScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            backPress: false,
            document: {
                content: 'a\nb\nc',
            },
        }
    }

    onBackClick() {
        this.props.navigator.pop()
    }

    render() {
        let timeout = false
        return (
            <View style={{flex: 1,flexDirection: 'column'}}>
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
                </View>
                <TextInput style={styles.content}
                    multiline={true}
                    blurOnSubmit={false}
                    textAlignVertical='top'
                    value={this.state.document.content}
                    onChangeText={((text)=>{
                        this.state.document.content = text
                        this.setState({})
                    }).bind(this)}
                    onSubmitEditing={(()=>{
                        if (timeout) clearTimeout(timeout)
                        timeout = setTimeout((()=>{
                            this.state.document.content += '\n'
                            this.setState({})
                            timeout = undefined
                        }).bind(this), 100)
                    }).bind(this)}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    headbar: {
        flexDirection: 'row',
        borderBottomColor: BaseCSS.colors.separation_line,
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        textAlign: 'left',
    },
})
