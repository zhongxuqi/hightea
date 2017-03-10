import NetConfig from '../config/net.js'

function GetSelfInfo(resolve, reject) {
    fetch(NetConfig.Host + "/api/member/self").then((res) => {
        if (res.ok) {
            resolve(res)
        } else {
            reject(res)
        }
    }).catch((err) => {
        reject(err)
    })
}

export default {
    GetSelfInfo: GetSelfInfo
}