import React,{Component} from 'react';
import {Redirect,Route}from "react-router-dom";

class ProtectRpute  extends  Component{


    render(){
        let role=localStorage.getItem('role');
        let { component: Component,...rest} =this.props;
        return(

                <Route {...rest} render={props=>{
                    return role==="2"?<Component {...this.props} />:<Redirect to="/Authorize" />
                }}/>
        )
    }
}

export default ProtectRpute;