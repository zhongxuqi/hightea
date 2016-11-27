import React from 'react'

import Menu from './menu/menu.jsx'

export default class Main extends React.Component {
    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="col-xs-2" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    <Menu></Menu>
                </div>
                <div className="col-xs-10" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}