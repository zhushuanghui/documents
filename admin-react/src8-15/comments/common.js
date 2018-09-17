import axios from "./axios";


//格式化tabel数据
let formatDate = (ary) => {
    ary = ary.map(item => {
        for (var key in item) {
            if (key === "createTime") {
                let date = new Date(item[key]);
                let month=(date.getMonth() + 1)>=10?date.getMonth() + 1:'0'+(date.getMonth() + 1);
                let day=date.getDate()>=10?date.getDate():'0'+date.getDate();
                let hours=date.getHours()>=10?date.getHours():'0'+date.getHours();
                let minutes=date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes();
                let seconds=date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds();
                date = date.getFullYear() + '-' + month + '-' + day+' '+hours+':'+minutes+':'+seconds;
                item = {...item, [key]: date, originTime: item[key]}
            }else if(key==='priceUp'||key==='priceDown'){

                let price=item[key]/100;
                item = {...item, [key]:price}
            }else if(key==='role'){
                let role='';
                if(item.role==="1"){
                    role='下游用户';
                }else if(item.role==="2"){
                    role='系统';
                }
                item = {...item, role}
            }else if(key==='state'){
                let state='';
                if(item.state===1){
                    state='开启';
                }else if(item.state===0){
                    state='暂停';
                }
                item = {...item,state}
            }
        }
        return item;
    });
    return ary;
};

//格式化传给后台的数据
let  formatData = (data) => {
    let obj = {};
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if(item.prop==='priceUp'||item.prop==='priceDown'){
            obj = {...obj, [item.prop]: item[item.prop]*100}
        }else{
            obj = {...obj, [item.prop]: item[item.prop]}
        }

    }
    return obj;
};

//input 框数据校验
let inputRule=(item)=>(
    {
        required: true, trigger: 'blur',
        validator: (rule, value, callback) => {
            item[item.prop] = item[item.prop] === undefined ? '' : item[item.prop];
            if (item[item.prop].length === 0) {
                callback(new Error(`${item.name}不能为空`));
            } else {
                if (item.prop === 'loginName') {
                    axios.get(`/user/check?loginName=${item.loginName}`).
                    then(res => {
                            if (res) {
                                callback(new Error(`${res.message}`));
                            }else{
                                callback();
                            }
                        }
                    )
                }else if(item.prop==='countN'||item.prop==='countM'){
                 let num=Number(item[item.prop]);
                  if(isNaN(num)){
                      callback(new Error('请输入数字'));
                  }else{
                      callback();
                  }
                }else if(item.prop === 'productId'){
                    axios.get(`/product/check?productId=${item.productId}`).then(res => {
                        console.log(res);
                        if (res) {
                                callback(new Error(`${res.message}`));
                            }else{
                                callback();
                            }
                        }
                    )
                }else if(item.prop === 'phone'){
                    let num=Number(item[item.prop]);
                    if(isNaN(num)||(item.phone.length!==11)){
                        callback(new Error('手机号码不合法'));
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            }

        }
    }

);

//state校验
let stateRule=(state)=>(
{
    required: true,
    message: `请选择状态`,
    trigger: 'change',
    validator: (rule, value, callback) => {
    state = state === undefined ? '' : state + '';
    if (state.length === 0) {
        callback(new Error(`状态不能为空`));
    } else {
        callback();
    }
}
});


let admin={username:localStorage.getItem('loginName')};



//规格lable宽度
let lableWidth={indexWidth:70,dateWidth:170};


export  {formatDate,formatData,stateRule,inputRule,lableWidth,admin};
