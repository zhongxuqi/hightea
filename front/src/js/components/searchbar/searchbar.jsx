import React from 'react'

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "",
        }
    }

    getValue() {
        return this.state.value
    }

    render() {
        return (
            <div className="lowtea-searchbar clearfix lowtea-table" style={{width:"100%"}}>
                <div className="lowtea-table-cell" style={{width:"99%", paddingRight:"10px"}}>
                    <input className="form-control" placeholder="请输入关键词" value={this.state.value} onChange={((event)=>{
                        this.setState({value:event.target.value})
                    }).bind(this)}/>
                </div>
                <div className="lowtea-table-cell" style={{width:"1%"}}>
                    <button className="btn btn-default" onClick={this.props.onClick}>搜索</button>
                </div>
            </div>
        )
    }
}
