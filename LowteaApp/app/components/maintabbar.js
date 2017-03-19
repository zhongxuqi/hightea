import React, {Component} from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'
import BaseCSS from '../config/css.js'
import Language from '../language/index.js'
import MainTab from './maintab.js'

export default class MainTabBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: [{
                title: Language.textMap('News'),
                icon: 'file-text-o',
                active_icon: 'file-text',
                active: true,
            }, {
                title: Language.textMap('Flags'),
                icon: 'flag-o',
                active_icon: 'flag',
                active: false,
            }, {
                title: Language.textMap('Stars'),
                icon: 'star-o',
                active_icon: 'star',
                active: false,
            }, {
                title: Language.textMap('User'),
                icon: 'user-o',
                active_icon: 'user',
                active: false,
            }],
        }
    }

    onTabPress(index) {
        this.setState({
            tabs: this.state.tabs.map((item, i) => {
                if (index == i) {
                    item.active = true
                } else {
                    item.active = false
                }
                return item
            }),
        })
        this.props.onTabSelected(index)
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.tabs.map((item, index)=>{
                        return (
                            <MainTab key={index} title={item.title} icon={item.icon} active_icon={item.active_icon} active={item.active} onPress={this.onTabPress.bind(this, index)}/>
                        )
                    })
                }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
})
