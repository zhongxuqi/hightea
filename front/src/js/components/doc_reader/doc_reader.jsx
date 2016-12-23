import React from 'react'
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './doc_reader.less'

export default class DocReader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            document: {},
        }
        this.updateDoc(props.routeParams.id)
    }

    componentWillReceiveProps(props) {
        this.updateDoc(props.routeParams.id)
    }

    updateDoc(id) {
        HttpUtils.get("/api/member/document/"+id,{},((resp)=>{
            this.setState({
                document:resp.document,
                star: resp.star,
                flag: resp.flag,
            })
            
            $(".lowtea-doc-reader #content")[0].innerHTML = marked(resp.document.content)
            
            $(".lowtea-doc-reader #content a").each((i, element)=>{
                $(element).attr("target", "_blank")
            })
        }).bind(this),(resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    toggleStar() {
        let action
        if (this.state.star) {
            action = "unstar"
        } else {
            action = "star"
        }
        HttpUtils.post("/api/member/star/"+this.state.document.id, {
            action: action,
        }, ((resp)=>{
            let document = this.state.document
            document.starNum = resp.starNum
            this.setState({
                document: document,
                star: !this.state.star,
            })
        }).bind(this), ((resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        }).bind(this))
    }
    
    toggleFlag() {
        let action
        if (this.state.flag) {
            action = "unflag"
        } else {
            action = "flag"
        }
        HttpUtils.post("/api/admin/flag/"+this.state.document.id, {
            action: action,
        }, ((resp)=>{
            let document = this.state.document
            document.flagNum = resp.flagNum
            this.setState({
                document: document,
                flag: !this.state.flag,
            })
        }).bind(this), ((resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        }).bind(this))
    }
    
    render() {
        return (
            <div className="lowtea-doc-reader">
                <div className="titlebar" style={{verticalAlign:"middle"}}>
                    <div className="table-cell" style={{width:"1%"}}>
                        <h1 className="title">
                            {this.state.document.title}
                        </h1>
                    </div>
                    <div className="table-cell" style={{width:"99%", paddingLeft:"10px"}}>
                        <h4 className="title-status">
                            <span className="label label-info">{{"status_draft":Language.textMap("draft"),"status_publish_self":Language.textMap("only self"),"status_publish_member":Language.textMap("for member"),"status_publish_public":Language.textMap("for public")}[this.state.document.status]}</span>
                        </h4>
                    </div>
                    <div className="table-cell">
                        <button className="btn btn-primary btn-sm" type="button" onClick={this.toggleFlag.bind(this)}>
                            {{true:Language.textMap("Unflag"), false:Language.textMap("Flag")}[this.state.flag]} <span className="badge">{this.state.document.flagNum}</span>
                        </button>
                    </div>
                    <div className="table-cell" style={{paddingLeft:"10px"}}>
                        <button className="btn btn-primary btn-sm" type="button" onClick={this.toggleStar.bind(this)}>
                            {{true:Language.textMap("Unstar"), false:Language.textMap("Star")}[this.state.star]} <span className="badge">{this.state.document.starNum}</span>
                        </button>
                    </div>
                </div>
                <div id="content"></div>
            </div>
        )
    }
}
