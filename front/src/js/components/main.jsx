import React from 'react'

import Menu from './menu.jsx'
import ListPage from './list_page.jsx'

export default class Main extends React.Component {
    render() {
        return (
            <div className="row">
                <Menu class={"col-xs-2"}></Menu>
                <ListPage class={"col-xs-10"}></ListPage>
            </div>
        )
    }
}