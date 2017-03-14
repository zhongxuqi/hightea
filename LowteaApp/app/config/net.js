function formatHeadImg(input) {
    let headImg = input
    if (headImg == "" || headImg == undefined) {
        headImg = "/img/head.png"
    }
    return headImg
}

export default {
    //Host: "http://blog.electronlowtea.tech", 
    Host: "http://192.168.0.101:7070",
    //Host: "http://192.168.201.196:7070",

    FormatHeadImg: formatHeadImg,
}
