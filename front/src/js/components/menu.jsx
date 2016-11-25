'use strict';

import React from 'react'

export default class Menu extends React.Component {
    render() {
        return <div className={[this.props.class,"zxq-menu"].join(" ")} style={{height:$(window).height()+'px'}}>menu</div>;
    }
}