import React from 'react'
import {Link} from 'react-router'

import './doc_shortcut.less'

export default class DocShortcut extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({id:props.id})
    }

    render() {
        return (
            <div className="doc-shortcut">
                <h4><Link to={"/doc_reader/"+this.state.id}>{this.props.title}</Link></h4>
                <p className="doc-shortcut-abstract">{this.props.abstract}</p>
                <ul className="doc-shortcut-data clearfix">
                    <li>
                        <span className="glyphicon glyphicon-star"></span>
                        {this.props.likeNum}
                    </li>
                    <li>
                        <span className="glyphicon glyphicon-pencil"></span>
                        {this.props.modifyTime}
                    </li>
                </ul>
            </div>
        )
    }
}
