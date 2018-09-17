import React,{Component} from 'react';
import {Redirect,Route}from "react-router-dom";
import {connect} from "react-redux";
import {actions} from "./store";

@connect(state=>({...state}),actions)
class ProtectRoute  extends  Component{
    render(){
        // let role=localStorage.getItem('role');
        let role=this.props.role;
        let { component: Component,...rest} =this.props;
        return(
                <Route {...rest} render={props=>{
                    return role==="2"?<Component {...this.props} />:<Redirect to="/Authorize" />
                }}/>
        )
    }
}

export default ProtectRoute;