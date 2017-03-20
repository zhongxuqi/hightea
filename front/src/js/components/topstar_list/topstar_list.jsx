import React from 'react';
import ReactTooltip from 'react-tooltip'

import Language from '../../language/language.jsx'

import './topstar_list.less'

export default class TopStarList extends React.Component {
    render() {
        return (
            <div className="topstar-list">
                <h5>{Language.textMap("Star documents top list")}:</h5>
                <div className="list-group">
                    {
                        this.props.documents.map((document)=>{
                            return (
                                <a key={document.id} href={"#/doc_reader/"+document.id} className="list-group-item"
                                    data-tip={Language.textMap("Account") + ": "+ document.account}>
                                    <ReactTooltip place="left"/>
                                    {document.title}
                                    <span className="badge">{document.starPercent}%</span>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
