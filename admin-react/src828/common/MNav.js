import React, {Component} from 'react';
import {NavMenu} from 'element-react';
import {NavLink} from 'react-router-dom';
import './common.css';

import 'element-theme-default';

class MNav extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            < div className="nav" style={{textAlign:"center"}}>
                <NavLink to={"/channel"}  >
                    <div className="row">配置列表</div>
                </NavLink>
                <NavLink to={"/deliver"} >
                    <div className="row">投递列表</div>
                </NavLink>
                <NavLink to={"/product"} >
                    <div className="row">产品列表</div>
                </NavLink>
                <NavLink to={"/admin"} >
                    <div className="row">用户管理</div>
                </NavLink>
                <NavLink to={"/daylist"} >
                    <div className="row">每日统计</div>
                </NavLink>
                <NavLink to={"/statistics"} >
                    <div className="row">统计列表</div>
                </NavLink>
            </div>
        )
    }

}

export default MNav;