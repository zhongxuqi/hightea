let status2stringMap = {
    "status_draft": "草稿",
    "status_publish_self": "自己可见",
    "status_publish_member": "内部可见",
    "status_publish_public": "公开",
}

function status2string(status) {
    return status2stringMap[status]
}

export default {
    status2string: status2string,
}
