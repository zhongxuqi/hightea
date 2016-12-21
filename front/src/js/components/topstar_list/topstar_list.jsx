import React from 'react';

import './topstar_list.less'

export default class TopStarList extends React.Component {
    render() {
        return (
            <div className="topstar-list">
                <h5>{this.props.title+":"}</h5>
                <div className="list-group">
                    {
                        this.props.documents.map((document)=>{
                            return (
                                <a key={document.id} href={"#/doc_reader/"+document.id} className="list-group-item">
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
