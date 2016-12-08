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

function _toggleQuote(editor) {
    let cm = editor.codemirror

    if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	let startPoint = cm.getCursor("start");
	let endPoint = cm.getCursor("end");

    for(let i = startPoint.line; i <= endPoint.line; i++) {
        let lineStr = cm.getLine(i)

        if (/^> /.test(lineStr)) {
            cm.replaceRange(lineStr.substring(2), {
                line: i,
                ch: 0,
            }, {
                line: i,
                ch: MaxLineLen,
            })
        } else {
            cm.replaceRange("> "+lineStr, {
                line: i,
                ch: 0,
            }, {
                line: i,
                ch: MaxLineLen,
            })
        }
    }
}

export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFullScreen: false,
            isColumns: false,
            isPreView: false,
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
        _toggleQuote(this)
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
                    <a className="fa fa-list-ul"></a>
                    <a className="fa fa-list-ol"></a>
                    <i className="separator">|</i>
                    <a className="fa fa-link"></a>
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
            </div>
        )
    }
}
