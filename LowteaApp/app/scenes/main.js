import React, {Component} from 'react'
import {
    Alert,
    StyleSheet,
    View,
    ViewPagerAndroid,
    BackAndroid,
    Text,
    Animated,
    Easing,
} from 'react-native'
import BaseCSS from '../config/css.js'
import MainTabBar from '../components/maintabbar.js'
import NewsView from '../components/news.js'
import FlagsView from '../components/flags.js'
import StarsView from '../components/stars.js'
import UserView from '../components/user.js'
import EventUtils from '../utils/events.js'
import Language from '../language/index.js'
import NavigatorUtil from '../utils/navigator.js'
import Dialog from '../components/dialog.js'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class MainScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingVisible: false,
            loadingTitle: 'Loading...',
            rotateAnim: new Animated.Value(0),
        }
        BackAndroid.addEventListener("hardwareBackPress", (() => {
            if (NavigatorUtil.GetShowAlert()) {
                Alert.alert(Language.textMap("Warning"), Language.textMap("whether confirm to go back") + " ?",[{
                    text: Language.textMap('CANCEL'),
                    onPress: ()=>{},
                }, {
                    text: Language.textMap('OK'),
                    onPress: (()=>{
                        NavigatorUtil.SetShowAlert(false)
                        this.props.navigator.pop()
                    }).bind(this)
                }])
                return true
            }
            if (this.props.navigator.getCurrentRoutes().length > 1) {
                this.props.navigator.pop()
                return true
            }
            return false
        }).bind(this))

        EventUtils.On("showLoadingModal", (()=>{
            this.startAnim()
            this.setState({loadingVisible: true})
        }).bind(this))
        EventUtils.On("hideLoadingModal", (()=>{
            this.setState({loadingVisible: false})
        }).bind(this))
    }

    startAnim() {
        this.state.rotateAnim.setValue(0)
        Animated.timing(this.state.rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
        }).start((()=>{
            if (this.state.loadingVisible) this.startAnim()
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

                <Dialog visible={this.state.loadingVisible} buttons={[]}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Animated.View style={{
                            transform:[{
                                rotateZ: this.state.rotateAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                }),
                            }],
                        }}>
                            <Icon name="rotate-right" size={25} style={{color: 'black'}}/>
                        </Animated.View>
                        <Text style={styles.loadingText}>{Language.textMap(this.state.loadingTitle)}</Text>
                    </View>
                </Dialog>
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
    loadingText: {
        fontSize: BaseCSS.font.titleSize,
        fontWeight: 'bold',
        marginLeft: 15,
        color: "black",
    },
})
