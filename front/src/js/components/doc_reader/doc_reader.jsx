import React from 'react'
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'

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
                            <span className="label label-info">{{"status_draft":"草稿","status_publish_self":"仅自己可见","status_publish_member":"内部可见","status_publish_public":"公开"}[this.state.document.status]}</span>
                        </h4>
                    </div>
                    <div className="table-cell">
                        <button className="btn btn-primary btn-sm" type="button" onClick={this.toggleStar.bind(this)}>
                            {{true:"unstar", false:"star"}[this.state.star]} <span className="badge">{this.state.document.starNum}</span>
                        </button>
                    </div>
                </div>
                <div id="content"></div>
            </div>
        )
    }
}
