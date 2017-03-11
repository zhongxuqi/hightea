import md5 from "react-native-md5";
import NetConfig from '../config/net.js'

function GetSelfInfo(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self", {
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(res)
        } else {
            reject(res)
        }
    })
}

function login(account, password, resolve, reject) {
    let expireTime = Math.floor(new Date().getTime() / 1000 + 60),
        sign = md5.hex_md5(account + password + expireTime)
    fetch(NetConfig.Host + "/openapi/login", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
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
    })
}

function GetDocuments(params, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/documents?"+Object.keys(params).map((key) => {
        return key + "=" + params[key]
    }).join("&"), {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(resp)
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
}

export default {
    GetSelfInfo: GetSelfInfo,
    login: login,
    GetDocuments: GetDocuments,
}
