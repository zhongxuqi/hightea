function get(url, data, successFunc, errorFunc) {
    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: successFunc,
        error: errorFunc,
    })
}

function post(url, data, successFunc, errorFunc) {
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: successFunc,
        error: errorFunc,
    })
}

function deleteAction(url, data, successFunc, errorFunc) {
    $.ajax({
        type: 'DELETE',
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: successFunc,
        error: errorFunc,
    })
}

function alert(errMsg) {
    $.growl.error({ message: errMsg });
}

function notice(noticeMsg) {
    $.growl.notice({ message: noticeMsg });
}

export default {
    get: get,
    post: post,
    delete: deleteAction,
    alert: alert,
    notice: notice,
}