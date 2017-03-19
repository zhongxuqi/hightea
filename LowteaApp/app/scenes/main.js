import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    ViewPagerAndroid,
    BackAndroid,
} from 'react-native'
import BaseCSS from '../config/css.js'
import MainTabBar from '../components/maintabbar.js'
import NewsView from '../components/news.js'
import FlagsView from '../components/flags.js'
import StarsView from '../components/stars.js'
import UserView from '../components/user.js'
import EventUtils from '../utils/events.js'

export default class MainScene extends Component {
    constructor(props) {
        super(props)
        BackAndroid.addEventListener("hardwareBackPress", (() => {
            if (this.props.navigator.getCurrentRoutes().length > 1) {
                this.props.navigator.pop()
                return true
            }
            return false
        }).bind(this))
    }

    setPage(index) {
        this.refs.viewPage.setPage(index)
    }

    onPageSelected(e) {
        this.refs.tabbar.onTabPress(e.nativeEvent.position)
    }

    render() {
        return (
            <View style={styles.container}>
                <ViewPagerAndroid style={styles.main} initialPage={0} ref="viewPage" onPageSelected={this.onPageSelected.bind(this)}>
                    <View><NewsView navigator={this.props.navigator}/></View>
                    <View><FlagsView navigator={this.props.navigator}/></View>
                    <View><StarsView navigator={this.props.navigator}/></View>
                    <View><UserView navigator={this.props.navigator}/></View>
                </ViewPagerAndroid>
                <MainTabBar onTabSelected={this.setPage.bind(this)} ref="tabbar"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: Object.assign(BaseCSS.container, {
        flexDirection: 'column',
    }),
    main: {
        flex: 1,
    },
})
