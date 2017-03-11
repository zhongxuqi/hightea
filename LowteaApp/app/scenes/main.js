import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    ViewPagerAndroid,
} from 'react-native'
import BaseCSS from '../config/css.js'
import MainTabBar from '../components/maintabbar.js'
import NewsView from '../components/news.js'
import FlagsView from '../components/flags.js'
import StarsView from '../components/stars.js'
import UserView from '../components/user.js'

export default class MainScene extends Component {
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
                    <View><NewsView/></View>
                    <View><FlagsView/></View>
                    <View><StarsView/></View>
                    <View><UserView/></View>
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
