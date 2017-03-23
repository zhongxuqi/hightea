let userModel = {}

function SetUser(user) {
    userModel = Object.assign(user)
}

function GetUser(user) {
    return Object.assign(userModel)
}

export default {
    SetUser: SetUser,
    GetUser: GetUser,
}