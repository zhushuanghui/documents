import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
import App from './App';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Channel from "./Channel";
import Detail from "./Deliver";
import Login from "./Login";
import Statistics from "./Statistics";
import Product from "./Product";
import Admin from "./Admin";
import Authorize from "./Authorize";
import DayList from "./DayList";

ReactDOM.render(
    <Router>
            <Switch>
                <Route path={'/login'} component={Login}/>
                <Route path='/authorize' component={Authorize}/>
                <Redirect path={"/"} exact={true} to={"/login"}/>
                <App>
                    <Route path="/channel" component={Channel}/>
                    <Route path="/deliver" component={Detail}/>
                    <Route path="/statistics" component={Statistics}/>
                    <Route path="/daylist" component={DayList}/>
                    <Route path='/product' component={Product}/>
                    <Route path='/admin' component={Admin}/>
                </App>
            </Switch>
    </Router>
    , document.getElementById('root'));
