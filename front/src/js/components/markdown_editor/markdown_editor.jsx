import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/display/fullscreen.js'
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

import './markdown_editor.less'

let MaxLineLen = 99999999999999

export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFullScreen: false,
            isColumns: false,
            isPreView: false,
            link: {
                title: "",
                url: "",
            },
            image: {
                isFile: true,
                imageUrl: "",
            },
            audio: {
                isFile: true,
                audioUrl: "",
            },
            video: {
                isFile: true,
                videoUrl: "",
            },
        }
    }

    componentDidMount() {
        this.codemirror = CodeMirror.fromTextArea(document.getElementById("markdown-editor"), {
            lineNumbers: false,
            mode: {
                name: "gfm",
                gitHubSpice: false,
                highlightFormatting: true,
            },
            tabSize: 4,
        });
        let preView = document.getElementById("preview"),
            cm = this.codemirror;
        cm.on("update", ()=>{
            preView.innerHTML = marked(cm.getValue())

            $("#preview a").each((i, element)=>{
                $(element).attr("target", "_blank")
            })
        })
        
        $("#linkModal").on("hidden.bs.modal", () => {
            this.setState({
                link: {
                    title: "",
                    url: "",
                },
            })
        })
        
        $("#imageModal").on("hidden.bs.modal", () => {
            this.setState({
                image: {
                    imageUrl: "",
                    isFile: true,
                },
            })
            document.getElementById("imageFile").value = ""
        })
        
        $("#audioModal").on("hidden.bs.modal", () => {
            this.setState({
                audio: {
                    audioUrl: "",
                    isFile: true,
                },
            })
            document.getElementById("audioFile").value = ""
        })

        $("#videoModal").on("hidden.bs.modal", () => {
            this.setState({
                video: {
                    videoUrl: "",
                    isFile: true,
                },
            })
            document.getElementById("videoFile").value = ""
        })
    }

    toggleBlock(type) {
        _toggleBlock(this, type, {
            bold: "**",
            italic: "*",
        }[type])
    }

    toggleHeading() {
        _toggleHeading(this)
    }

    toggleFullScreen() {
        let options = {
            isFullScreen: !this.state.isFullScreen,
        }
        if (!options.isFullScreen) options["isColumns"] = false
        this.setState(options)

        let cm = this.codemirror
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    }

    togglePreView() {
        let options = {
            isPreView: !this.state.isPreView,
        }
        if (options.isPreView) options["isColumns"] = false
        this.setState(options)
    }

    toggleColumns() {
        if (this.state.isFullScreen) {
            let options = {
                isColumns: !this.state.isColumns,
            }
            if (options.isColumns) options["isPreView"] = false
            this.setState(options)
        }
    }

    toggleQuote() {
        _toggleLineHeader(this, ">")
    }

    toggleUnorderedList() {
        _toggleLineHeader(this, "*")
    }

    toggleOrderedList() {
        _toggleOrderedList(this)
    }

    modalLink() {
        $("#linkModal").modal("show")
    }

    insertLink() {
        let url = this.state.link.url
        if (!/:\/\//.test(url)) url = "http://"+url
        let startPoint = this.codemirror.getCursor("start"),
            insertContent = "["+this.state.link.title+"]("+url+")"
        this.codemirror.replaceSelection(insertContent, startPoint)
        this.codemirror.setSelection({
            line: startPoint.line,
            ch: startPoint.ch + insertContent.length,
        })
        this.codemirror.focus()
        $("#linkModal").modal("hide")
    }

    modalImage() {
        $("#imageModal").modal("show")
    }

    insertImage() {
        if (this.state.image.isFile) {
            let imagefile = document.getElementById("imageFile").files[0]

            if (imagefile == null) {
                HttpUtils.alert("请选择图片")
                return
            } else if (!(/\.(png|jpeg|jpg)$/.test(imagefile.name))) {
                HttpUtils.alert("所选文件不是图片")
                return
            }
            
            let formData = new FormData()
            formData.append("imagefile", imagefile)
            $.ajax({
                type: "POST",
                url: "/api/member/upload_image",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: (resp) => {
                    let startPoint = this.codemirror.getCursor("start")
                    this.codemirror.replaceSelection("<img src=\""+resp.imageUrl+"\" style=\"max-width:90%\"></img>\n", startPoint)
                    this.codemirror.setSelection({
                        line: startPoint.line+1,
                        ch: 0,
                    })
                    this.codemirror.focus()
                    $("#imageModal").modal("hide")
                },
                error: (resp) => {
                    HttpUtils.alert("["+resp.status+"] "+resp.responseText)
                },
            })
        } else {
            let imageUrl = this.state.image.imageUrl
            
            if (imageUrl == null || imageUrl.length == 0) {
                HttpUtils.alert("请输入图片URL")
                return
            }
            let startPoint = this.codemirror.getCursor("start")
            this.codemirror.replaceSelection("<img src=\""+imageUrl+"\" style=\"max-width:90%\"></img>\n", startPoint)
            this.codemirror.setSelection({
                line: startPoint.line+1,
                ch: 0,
            })
            this.codemirror.focus()
            $("#imageModal").modal("hide")
        }
    }
    
    modalAudio() {
        $("#audioModal").modal("show")
    }

    insertAudio() {
        if (this.state.audio.isFile) {
            let audiofile = document.getElementById("audioFile").files[0]

            if (audiofile == null) {
                HttpUtils.alert("请选择MP3")
                return
            } else if (!(/\.(mp3)$/.test(audiofile.name))) {
                HttpUtils.alert("所选文件不是MP3")
                return
            }
            
            let formData = new FormData()
            formData.append("audiofile", audiofile)
            $.ajax({
                type: "POST",
                url: "/api/member/upload_audio",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: (resp) => {
                    let startPoint = this.codemirror.getCursor("start")
                    this.codemirror.replaceSelection("<audio src=\""+resp.audioUrl+"\" controls=\"controls\" style=\"max-width:90%\"></audio>\n", startPoint)
                    this.codemirror.setSelection({
                        line: startPoint.line+1,
                        ch: 0,
                    })
                    this.codemirror.focus()
                    $("#audioModal").modal("hide")
                },
                error: (resp) => {
                    HttpUtils.alert("["+resp.status+"] "+resp.responseText)
                },
            })
        } else {
            let audioUrl = this.state.audio.audioUrl
            
            if (audioUrl == null || audioUrl.length == 0) {
                HttpUtils.alert("请输入MP3 URL")
                return
            }
            let startPoint = this.codemirror.getCursor("start")
            this.codemirror.replaceSelection("<audio src=\""+audioUrl+"\" controls=\"controls\" style=\"max-width:90%\"></audio>\n", startPoint)
            this.codemirror.setSelection({
                line: startPoint.line+1,
                ch: 0,
            })
            this.codemirror.focus()
            $("#audioModal").modal("hide")
        }
    }
    
    modalVideo() {
        $("#videoModal").modal("show")
    }

    insertVideo() {
        if (this.state.video.isFile) {
            let videofile = document.getElementById("videoFile").files[0]

            if (videofile == null) {
                HttpUtils.alert("请选择图片")
                return
            } else if (!(/\.(mp4)$/.test(videofile.name))) {
                HttpUtils.alert("所选文件不是MP4")
                return
            }
            
            let formData = new FormData()
            formData.append("videofile", videofile)
            $.ajax({
                type: "POST",
                url: "/api/member/upload_video",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: (resp) => {
                    let startPoint = this.codemirror.getCursor("start")
                    this.codemirror.replaceSelection("<video src=\""+resp.videoUrl+"\" controls=\"controls\" style=\"max-width:90%\"></video>\n", startPoint)
                    this.codemirror.setSelection({
                        line: startPoint.line+1,
                        ch: 0,
                    })
                    this.codemirror.focus()
                    $("#videoModal").modal("hide")
                },
                error: (resp) => {
                    HttpUtils.alert("["+resp.status+"] "+resp.responseText)
                },
            })
        } else {
            let videoUrl = this.state.video.videoUrl
            
            if (videoUrl == null || videoUrl.length == 0) {
                HttpUtils.alert("请输入视频URL")
                return
            }
            let startPoint = this.codemirror.getCursor("start")
            this.codemirror.replaceSelection("<video src=\""+videoUrl+"\" controls=\"controls\" style=\"max-width:90%\"></video>\n", startPoint)
            this.codemirror.setSelection({
                line: startPoint.line+1,
                ch: 0,
            })
            this.codemirror.focus()
            $("#videoModal").modal("hide")
        }
    }

    render() {
        return (
            <div className={["lowtea-markdown-editor", 
                    {true: "lowtea-markdown-editor-fullscreen", false: ""}[this.state.isFullScreen], 
                    {true:"lowtea-markdown-editor-preview", false:""}[this.state.isPreView],
                    {true:"lowtea-markdown-editor-columns", false:""}[this.state.isColumns]].join(" ")}>
                <div className="toolbar">
                    <a className="fa fa-bold" onClick={this.toggleBlock.bind(this, "bold")}></a>
                    <a className="fa fa-italic" onClick={this.toggleBlock.bind(this, "italic")}></a>
                    <a className="fa fa-header" onClick={this.toggleHeading.bind(this)}></a>
                    <i className="separator">|</i>
                    <a className="fa fa-quote-left" onClick={this.toggleQuote.bind(this)}></a>
                    <a className="fa fa-list-ul" onClick={this.toggleUnorderedList.bind(this)}></a>
                    <a className="fa fa-list-ol" onClick={this.toggleOrderedList.bind(this)}></a>
                    <i className="separator">|</i>
                    <a className="fa fa-link" onClick={this.modalLink.bind(this)}></a>
                    <a className="fa fa-picture-o" onClick={this.modalImage.bind(this)}></a>
                    <a className="fa fa-file-audio-o" onClick={this.modalAudio.bind(this)}></a>
                    <a className="fa fa-file-video-o" onClick={this.modalVideo.bind(this)}></a>
                    <i className="separator">|</i>
                    <a className={["fa fa-eye", {true:"active",false:""}[this.state.isPreView]].join(" ")} onClick={this.togglePreView.bind(this)}></a>
                    <a className={["fa fa-columns", {true:"active",false:""}[this.state.isColumns]].join(" ")} style={{display:{true:"inline-block", false:"none"}[this.state.isFullScreen]}} onClick={this.toggleColumns.bind(this)}></a>
                    <a className={["fa fa-arrows-alt", {true:"active",false:""}[this.state.isFullScreen]].join(" ")} onClick={this.toggleFullScreen.bind(this)}></a>
                    <i className="separator">|</i>
                    <a className="fa fa-question-circle" href="https://simplemde.com/markdown-guide" target="_blank"></a>
                </div>
                <textarea id="markdown-editor"></textarea>
                <div id="preview"></div>

                <div className="modal fade" id="linkModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">Insert Link</h4>
                            </div>
                            <div className="modal-body">
                                <form role="form">
                                    <div className="form-group">
                                        <label>LinkTitle</label>
                                        <input className="form-control" placeholder="Enter link title" value={this.state.link.title} onChange={((event)=>{this.setState({link:{title:event.target.value,url:this.state.link.url}})}).bind(this)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Link address</label>
                                        <input className="form-control" placeholder="Enter link address" value={this.state.link.url} onChange={((event)=>{this.setState({link:{title:this.state.link.title,url:event.target.value}})}).bind(this)}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                              <button type="button" className="btn btn-primary" onClick={this.insertLink.bind(this)}>Affirm</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="imageModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <ul className="nav nav-pills" role="tablist">
                                    <li role="presentation" className={{true:"active", false:""}[this.state.image.isFile]}><a href="javascript:void(0)" onClick={(()=>{this.setState({image:{isFile:true, imageUrl:this.state.image.imageUrl}})}).bind(this)}>上传图片</a></li>
                                    <li role="presentation" className={{true:"", false:"active"}[this.state.image.isFile]}><a href="javascript:void(0)" onClick={(()=>(this.setState({image:{isFile:false, imageUrl:this.state.image.imageUrl}})))}>图片链接</a></li>
                                </ul>
                            </div>
                            <div className="modal-body">
                                <form role="form">
                                    <div className="form-group" style={{display:{true:"none",false:"block"}[this.state.image.isFile]}}>
                                        <label>图片链接</label>
                                        <input type="text" className="form-control" placeholder="Enter Image URL" value={this.state.image.imageUrl} onChange={((event)=>{this.setState({image:{imageUrl:event.target.value,isFile:this.state.image.isFile}})}).bind(this)}/>
                                    </div>
                                    <div className="form-group" style={{display:{true:"block",false:"none"}[this.state.image.isFile]}}>
                                        <label>图片地址</label>
                                        <input type="file" id="imageFile"/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.insertImage.bind(this)}>Affirm</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="audioModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <ul className="nav nav-pills" role="tablist">
                                    <li role="presentation" className={{true:"active", false:""}[this.state.audio.isFile]}><a href="javascript:void(0)" onClick={(()=>{this.setState({audio:{isFile:true, audioUrl:this.state.audio.audioUrl}})}).bind(this)}>上传MP3</a></li>
                                    <li role="presentation" className={{true:"", false:"active"}[this.state.audio.isFile]}><a href="javascript:void(0)" onClick={(()=>(this.setState({audio:{isFile:false, audioUrl:this.state.audio.audioUrl}})))}>MP3链接</a></li>
                                </ul>
                            </div>
                            <div className="modal-body">
                                <form role="form">
                                    <div className="form-group" style={{display:{true:"none",false:"block"}[this.state.audio.isFile]}}>
                                        <label>MP3链接</label>
                                        <input type="text" className="form-control" placeholder="Enter MP3 URL" value={this.state.audio.audioUrl} onChange={((event)=>{this.setState({audio:{audioUrl:event.target.value,isFile:this.state.audio.isFile}})}).bind(this)}/>
                                    </div>
                                    <div className="form-group" style={{display:{true:"block",false:"none"}[this.state.audio.isFile]}}>
                                        <label>MP3地址</label>
                                        <input type="file" id="audioFile"/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.insertAudio.bind(this)}>Affirm</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="videoModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <ul className="nav nav-pills" role="tablist">
                                    <li role="presentation" className={{true:"active", false:""}[this.state.video.isFile]}><a href="javascript:void(0)" onClick={(()=>{this.setState({video:{isFile:true, videoUrl:this.state.video.videoUrl}})}).bind(this)}>上传MP4</a></li>
                                    <li role="presentation" className={{true:"", false:"active"}[this.state.video.isFile]}><a href="javascript:void(0)" onClick={(()=>(this.setState({video:{isFile:false, videoUrl:this.state.video.videoUrl}})))}>MP4链接</a></li>
                                </ul>
                            </div>
                            <div className="modal-body">
                                <form role="form">
                                    <div className="form-group" style={{display:{true:"none",false:"block"}[this.state.video.isFile]}}>
                                        <label>MP4链接</label>
                                        <input type="text" className="form-control" placeholder="Enter Video URL" value={this.state.video.videoUrl} onChange={((event)=>{this.setState({video:{videoUrl:event.target.value,isFile:this.state.video.isFile}})}).bind(this)}/>
                                    </div>
                                    <div className="form-group" style={{display:{true:"block",false:"none"}[this.state.video.isFile]}}>
                                        <label>MP4地址</label>
                                        <input type="file" id="videoFile"/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.insertVideo.bind(this)}>Affirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * The state of CodeMirror at the given position.
 */
function getState(cm, pos) {
	pos = pos || cm.getCursor("start");
	var stat = cm.getTokenAt(pos);
	if(!stat.type) return {};

	var types = stat.type.split(" ");

	var ret = {},
		data, text;
	for(var i = 0; i < types.length; i++) {
		data = types[i];
		if(data === "strong") {
			ret.bold = true;
		} else if(data === "variable-2") {
			text = cm.getLine(pos.line);
			if(/^\s*\d+\.\s/.test(text)) {
				ret["ordered-list"] = true;
			} else {
				ret["unordered-list"] = true;
			}
		} else if(data === "atom") {
			ret.quote = true;
		} else if(data === "em") {
			ret.italic = true;
		} else if(data === "quote") {
			ret.quote = true;
		} else if(data === "strikethrough") {
			ret.strikethrough = true;
		} else if(data === "comment") {
			ret.code = true;
		} else if(data === "link") {
			ret.link = true;
		} else if(data === "tag") {
			ret.image = true;
		} else if(data.match(/^header(\-[1-6])?$/)) {
			ret[data.replace("header", "heading")] = true;
		}
	}
	return ret;
}

function _toggleBlock(editor, type, start_chars, end_chars) {
    if(/editor-preview-active/.test(editor.codemirror.getWrapperElement().lastChild.className))
		return;
    
    end_chars = (typeof end_chars === "undefined") ? start_chars : end_chars;
	var cm = editor.codemirror;
	var stat = getState(cm);

	var text;
	var start = start_chars;
	var end = end_chars;

	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");

	if(stat[type]) {
		text = cm.getLine(startPoint.line);
		start = text.slice(0, startPoint.ch);
		end = text.slice(startPoint.ch);
		if(type == "bold") {
			start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
			end = end.replace(/(\*\*|__)/, "");
		} else if(type == "italic") {
			start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
			end = end.replace(/(\*|_)/, "");
		} else if(type == "strikethrough") {
			start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
			end = end.replace(/(\*\*|~~)/, "");
		}
		cm.replaceRange(start + end, {
			line: startPoint.line,
			ch: 0
		}, {
			line: startPoint.line,
			ch: 99999999999999
		});

		if(type == "bold" || type == "strikethrough") {
			startPoint.ch -= 2;
			if(startPoint !== endPoint) {
				endPoint.ch -= 2;
			}
		} else if(type == "italic") {
			startPoint.ch -= 1;
			if(startPoint !== endPoint) {
				endPoint.ch -= 1;
			}
		}
	} else {
		text = cm.getSelection();
		if(type == "bold") {
			text = text.split("**").join("");
			text = text.split("__").join("");
		} else if(type == "italic") {
			text = text.split("*").join("");
			text = text.split("_").join("");
		} else if(type == "strikethrough") {
			text = text.split("~~").join("");
		}
		cm.replaceSelection(start + text + end);

		startPoint.ch += start_chars.length;
		endPoint.ch = startPoint.ch + text.length;
	}

	cm.setSelection(startPoint, endPoint);
	cm.focus();
}

function _toggleHeading(editor) {
    let cm = editor.codemirror

    if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	let startPoint = cm.getCursor("start");
	let endPoint = cm.getCursor("end");

    for(let i = startPoint.line; i <= endPoint.line; i++) {
        let lineStr = cm.getLine(i)
        let headStr = lineStr.match(/^#* /)

        if (headStr == null) {
            cm.replaceRange("# " + lineStr, {
                line: i,
                ch: 0
            }, {
                line: i,
                ch: MaxLineLen
            })
        } else {
            headStr = headStr[0]
            if (headStr.length < 7) {
                cm.replaceRange("#" + lineStr, {
                    line: i,
                    ch: 0
                }, {
                    line: i,
                    ch: MaxLineLen
                })
            } else {
                cm.replaceRange(lineStr.replace(headStr, ""), {
                    line: i,
                    ch: 0
                }, {
                    line: i,
                    ch: MaxLineLen
                })
            }
        }
    }
}

function _toggleLineHeader(editor, header) {
    let cm = editor.codemirror

    if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	let re
    if (header == "*") re = new RegExp("^\\"+header+" ")
    else re = new RegExp("^"+header+" ")

    let startPoint = cm.getCursor("start"),
	    endPoint = cm.getCursor("end");
    
    for(let i = startPoint.line; i <= endPoint.line; i++) {
        let lineStr = cm.getLine(i)

        if (re.test(lineStr)) {
            cm.replaceRange(lineStr.substring(2), {
                line: i,
                ch: 0,
            }, {
                line: i,
                ch: MaxLineLen,
            })
        } else {
            cm.replaceRange(header+" "+lineStr, {
                line: i,
                ch: 0,
            }, {
                line: i,
                ch: MaxLineLen,
            })
        }
    }
}

function _toggleOrderedList(editor) {
    let cm = editor.codemirror

    if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

    let startPoint = cm.getCursor("start"),
	    endPoint = cm.getCursor("end");
    
    let replaceStr = ""
    if (/^[0-9]\. /.test(cm.getLine(startPoint.line))) {
        for (let i = startPoint.line; i <= endPoint.line; i++) {
            replaceStr += cm.getLine(i).replace(/^[0-9]+\. /, "") + "\n"
        }
    } else {
        let startIndex = 1
        if (startPoint.line > 0) {
            let prevLine = cm.getLine(startPoint.line - 1)
            let res = prevLine.match(/^[0-9]+/)
            if (res != null && res.length > 0) {
                startIndex = Number.parseInt(res[0]) + 1
            }
        }
        
        for (let i = startPoint.line; i <= endPoint.line; i++) {
            let lineStr = cm.getLine(i)
            if (/^[0-9]+\. /.test(lineStr)) {
                replaceStr += lineStr.replace(/^[0-9]+/, startIndex.toString()) + "\n"
            } else {
                replaceStr += startIndex.toString() + ". " + lineStr + "\n"
            }
            startIndex++
        }
    }
    cm.replaceRange(replaceStr, {
        line: startPoint.line,
        ch: 0,
    }, {
        line: endPoint.line,
        ch: MaxLineLen,
    })
    cm.setSelection({
        line: startPoint.line,
        ch: 0,
    }, {
        line: endPoint.line,
        ch: MaxLineLen,
    })
}
