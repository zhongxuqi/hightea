import React from 'react'
import marked from 'marked'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './publicdoc_reader.less'

export default class PublicDocReader extends React.Component {
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
        HttpUtils.get("/openapi/document/"+id,{},((resp)=>{
            this.setState({
                document:resp.document,
                star: resp.star,
            })
            
            $(".lowtea-publicdoc-reader #content")[0].innerHTML = marked(resp.document.content)
            
            $(".lowtea-publicdoc-reader #content a").each((i, element)=>{
                $(element).attr("target", "_blank")
            })
        }).bind(this),(resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }
    
    render() {
        return (
            <div className="lowtea-publicdoc-reader">
                <div className="titlebar" style={{verticalAlign:"middle"}}>
                    <div className="table-cell" style={{width:"99%"}}>
                        <h1 className="title">
                            {this.state.document.title}
                        </h1>
                    </div>
                    <div className="table-cell">
                        <button className="btn btn-primary btn-sm" type="button">
                            {Language.textMap("Star")} <span className="badge">{this.state.document.starNum}</span>
                        </button>
                    </div>
                </div>
                <div id="content"></div>
            </div>
        )
    }
}
