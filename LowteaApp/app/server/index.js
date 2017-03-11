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
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
}

function GetTopFlagDocuments(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/top_flag_documents", {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
}

function GetTopStarDocuments(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/top_star_documents", {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
}

function GetDocument(documentId, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/document/" + documentId, {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
}

function ActionDocumentStar(documentId, action, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/star/" + documentId, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: action,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else console.log(resp)
        }
    })
    
}

function ActionDocumentFlag(documentId, action, resolve, reject) {
    fetch(NetConfig.Host + "/api/admin/flag/" + documentId, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: action,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
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
    GetTopFlagDocuments: GetTopFlagDocuments,
    GetTopStarDocuments: GetTopStarDocuments,
    GetDocument: GetDocument,
    ActionDocumentStar: ActionDocumentStar,
    ActionDocumentFlag: ActionDocumentFlag,
}
