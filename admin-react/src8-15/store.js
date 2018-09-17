import { createStore} from 'redux';
import axios from 'axios';

const  GET_DATA="GET_DATA";

var  actions={
//     getDataAPI:axios.get('/info/list').then(res => {
//     // this.setState({total: res.data.data.total, data: res.data.data.rows})
//         return{type:GET_DATA,data:res.data.data}
// }).catch(error => {
//     console.log(error);
// })
}

var state={}
var reducer=(state,actions)=>{
    switch (actions.type){
        case 'GET_DATA':
            return {...state,...actions.data}
    }
}
var store=createStore(reducer);
window.store=store;
export default store ;