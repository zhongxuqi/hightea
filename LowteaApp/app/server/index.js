import md5 from "react-native-md5";
import NetConfig from '../config/net.js'
import {Alert} from 'react-native'

function handleError(resp) {
    Alert.alert("Net Error", JSON.stringify(resp))
}

function GetSelfInfo(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self", {
        method: 'GET',
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(JSON.parse(res._bodyText))
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
            else handleError(resp)
        }
    })
}

function register(params, resolve, reject) {
    fetch(NetConfig.Host + "/openapi/register", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(resp)
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function Logout(resolve, reject) {
    fetch(NetConfig.Host + "/openapi/logout", {
        method: 'GET',
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(JSON.parse(res._bodyText))
        } else {
            reject(res)
        }
    })
}

function GetMembers(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/users", {
        method: 'GET',
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(JSON.parse(res._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function GetRegisters(resolve, reject) {
    fetch(NetConfig.Host + "/api/admin/registers", {
        method: 'GET',
        credentials: 'include',
    }).then((res) => {
        if (res.ok) {
            resolve(JSON.parse(res._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
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
            else handleError(resp)
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
            else handleError(resp)
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
            else handleError(resp)
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
            else handleError(resp)
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
            else handleError(resp)
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
            else handleError(resp)
        }
    })
}

function GetStarDocuments(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/star_documents", {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function GetDrafts(params, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/drafts?"+Object.keys(params).map((key) => {
        return key + "=" + params[key]
    }).join("&"), {
        method: "GET",
        credentials: 'include',
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function ActionRegister(account, action, resolve, reject) {
    fetch(NetConfig.Host + "/api/admin/register", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            account: account,
            action: action,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function PostDocument(action, document, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/document", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: action,
            document: document,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function PostDocumentStatus(document, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/document_status", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            document: document,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function DeleteDocument(documentId, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/document/" + documentId, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function PostSelf(self, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(self),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function PostPassword(oldPassword, newPassword, resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self_password", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: oldPassword,
            newPassword: newPassword,
        }),
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

function PostImage(imageFile, resolve, reject) {
    let formData = new FormData()
    formData.append("imagefile", {
        uri:imageFile,
        type: 'multipart/form-data',
        name: 'imagefile'
    })
    fetch(NetConfig.Host + "/api/member/upload_image", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    }).then((resp)=>{
        if (resp.ok) {
            resolve(JSON.parse(resp._bodyText))
        } else {
            if (typeof reject == "function") reject(resp)
            else handleError(resp)
        }
    })
}

export default {
    login: login,
    register: register,
    Logout: Logout,
    GetSelfInfo: GetSelfInfo,
    GetDocuments: GetDocuments,
    GetTopFlagDocuments: GetTopFlagDocuments,
    GetTopStarDocuments: GetTopStarDocuments,
    GetDocument: GetDocument,
    ActionDocumentStar: ActionDocumentStar,
    ActionDocumentFlag: ActionDocumentFlag,
    GetMembers: GetMembers,
    GetRegisters: GetRegisters,
    GetStarDocuments: GetStarDocuments,
    GetDrafts: GetDrafts,
    ActionRegister: ActionRegister,
    PostDocument: PostDocument,
    PostDocumentStatus: PostDocumentStatus,
    DeleteDocument: DeleteDocument,
    PostSelf: PostSelf,
    PostPassword: PostPassword,
    PostImage: PostImage,
}
