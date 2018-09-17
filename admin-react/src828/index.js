import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
import App from './App';
import {HashRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import ProtectRoute from './ProtectRoute';
import Channel from "./Channel";
import Detail from "./Deliver";
import Login from "./Login";
import Statistics from "./Statistics";
import ProductDown from "./ProductDown";
import Product from "./Product";
import Admin from "./Admin";
import Authorize from "./Authorize";
import DayList from "./DayList";
import DayListDown from "./DayListDown";
import {store} from './store';
import {Provider} from 'react-redux';

let role=localStorage.getItem('role');

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path={'/login'} component={Login}/>
                <Redirect path={"/"} exact={true} to={"/login"}/>
                <App>
                    <ProtectRoute path="/channel"  component={Channel}/>
                    <Route path="/deliver" component={Detail}/>
                    <Route path="/statistics" component={Statistics}/>
                    <ProtectRoute path="/daylist" component={DayList}/>
                    <Route path="/daylistdown" component={DayListDown}/>
                    <ProtectRoute path='/product' component={Product}/>
                    <Route path='/productdown' component={ProductDown}/>
                    <ProtectRoute path='/admin' component={Admin}/>
                    <Route path='/authorize' component={Authorize}/>
                </App>
                {/*<Redirect from='/' exect={true} to="/login"/>*/}
            </Switch>
        </Router>
    </Provider>

    , document.getElementById('root'));
