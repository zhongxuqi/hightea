import md5 from "react-native-md5";
import NetConfig from '../config/net.js'
import {Alert} from 'react-native'

function GetSelfInfo(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self", {
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(res)
        } else {
            reject(res)
        }
    }).catch((err) => {
        reject(err)
    })
}

function login(account, password, resolve, reject) {
    let expireTime = Math.floor(new Date().getTime() / 1000 + 60),
        sign = md5.hex_md5(account + password + expireTime)
    fetch(NetConfig.Host + "/openapi/login", {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            account: account,
            expireTime: expireTime,
            sign: sign,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(resp)
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    }).catch((err)=>{
        Alert.alert("Http Error", JSON.stringify(err))
    })
}

export default {
    GetSelfInfo: GetSelfInfo,
    login: login,
}
