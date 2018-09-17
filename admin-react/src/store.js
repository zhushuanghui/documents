import {createStore,applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import axios from './common/axios';

const GET_LOGIN = "GET_LOGIN";


let getLoginAPI = (loginName, passwd) => axios.get(`user/login?loginName=${loginName}&passwd=${passwd}`);


let actions = {
    getLogin(loginName, passwd) {
        return (dispatch)=>{
            getLoginAPI (loginName, passwd).then(data=>{
                dispatch({type: GET_LOGIN, payload:data});
            })
        }

    }
};

let initState = {loginName: '', role: ''};
let reducer = (state = initState, actions) => {
    switch (actions.type) {
        case GET_LOGIN:
            let data=actions.payload;
            if(data.status){
              return {...state,loginStatus:-1,message:actions.payload.message}
            }else{
                // data.role==="2"? this.props.history.push(`/channel`):this.props.history.push(`/deliver`);
                return {...state,loginName:data.loginName,role:data.role,loginStatus:'',message:''}
            }

    }
    return state;
};

let store = createStore(reducer,applyMiddleware(reduxThunk,reduxLogger));
window.store = store;
export {store, actions, getLoginAPI};