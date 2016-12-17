function unixtime2String(unixTime) {
    let timeDist = new Date().getTime() / 1000 - unixTime
    if (timeDist < 60) {
        return Math.floor(timeDist) + " seconds ago"
    } else if (timeDist < 60 * 60) {
        return Math.floor(timeDist / 60) + " minutes ago"
    } else if (timeDist < 24 * 60 * 60) {
        return Math.floor(timeDist / 60 / 60) + " hours ago"
    } else if (timeDist < 30 * 24 * 60 * 60) {
        return Math.floor(timeDist / 24 / 60 / 60) + " days ago"
    } else {
        let thatTime = new Date(unixTime * 1000)
        return thatTime.getYear() + "-" + thatTime.getMonth() + "-" + thatTime.getDay() + " " + thatTime.getHours() + ":" + thatTime.getMinutes() + ":" + thatTime.getSeconds()
    }
}

export default {
    unixtime2String: unixtime2String,
}
