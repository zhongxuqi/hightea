import Language from '../language/index.js'

function unixtime2String(unixTime) {
    let timeDist = new Date().getTime() / 1000 - unixTime
    if (timeDist < 60) {
        return Math.floor(timeDist) + Language.textMap(" seconds ago")
    } else if (timeDist < 60 * 60) {
        return Math.floor(timeDist / 60) + Language.textMap(" minutes ago")
    } else if (timeDist < 24 * 60 * 60) {
        return Math.floor(timeDist / 60 / 60) + Language.textMap(" hours ago")
    } else if (timeDist < 7 * 24 * 60 * 60) {
        return Math.floor(timeDist / 24 / 60 / 60) + Language.textMap(" days ago")
    } else if (timeDist < 28 * 24 * 60 * 60) {
        return Math.floor(timeDist / 7 / 24 / 60 / 60) + Language.textMap(" weeks ago")
    } else {
        let thatTime = new Date(unixTime * 1000)
        return thatTime.getFullYear() + "-" + (thatTime.getMonth() + 1) + "-" + thatTime.getDate() + " " + thatTime.getHours() + ":" + thatTime.getMinutes() + ":" + thatTime.getSeconds()
    }
}

export default {
    unixtime2String: unixtime2String,
}
