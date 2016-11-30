import React from 'react'

import './user_badge.less'

export default class UserBadge extends React.Component {
    constructor(props) {
        super(props)
        this.state = {nickname: this.props.nickname,role: this.props.role}
    }

    componentWillReceiveProps(newProps) {
        this.setState({nickname: newProps.nickname, role: newProps.role})
    }

    render() {
        return (
            <div>
                <p className="lowtea-menu-username"><span className={"nickname-"+this.state.role}>{this.state.nickname}</span></p>
                <p className="lowtea-menu-userbadge"><span className={["label label-info", "role-"+this.state.role].join(" ")}>{this.state.role}</span></p>
            </div>
        )
    }
}