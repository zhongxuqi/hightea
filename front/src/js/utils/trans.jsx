import Language from '../language/language.jsx'

let status2stringMap = {
    "status_draft": Language.textMap("draft"),
    "status_publish_self": Language.textMap("only self"),
    "status_publish_member": Language.textMap("for member"),
    "status_publish_public": Language.textMap("for public"),
}

function status2string(status) {
    return status2stringMap[status]
}

export default {
    status2string: status2string,
}
