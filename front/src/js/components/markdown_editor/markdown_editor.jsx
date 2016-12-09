import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/display/fullscreen.js'
import marked from 'marked'
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

import './markdown_editor.less'

let MaxLineLen = 99999999999999

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
        this.codemirror.replaceSelection("["+this.state.link.title+"]("+url+")", this.codemirror.getCursor("start"))
        this.setState({
            link: {
                title: "",
                url: "",
            },
        })
        $("#linkModal").modal("hide")
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
                    <a className="fa fa-picture-o"></a>
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
            </div>
        )
    }
}
