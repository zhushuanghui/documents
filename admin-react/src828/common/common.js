import axios from "./axios";


//格式化tabel数据
let formatDate = (ary) => {
    ary = ary.map(item => {
        for (var key in item) {
            if (key === "createTime") {
                let date = new Date(item[key]);
                let month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
                let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
                let hours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
                let minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
                let seconds = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
                date = date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                item = {...item, [key]: date, originTime: item[key] }
            } else if (key === 'priceUp' || key === 'priceDown') {

                let price = item[key] / 100;
                item = {...item, [key]: price }
            } else if (key === 'role') {
                let role = '';
                if (item.role === "1") {
                    role = '下游用户';
                } else if (item.role === "2") {
                    role = '系统';
                }
                item = {...item, role }
            } else if (key === 'state') {
                let state = '';
                if (item.state == 1) {
                    state = '开启';
                } else if (item.state == 0) {
                    state = '暂停';
                }
                item = {...item, state }
            } else if (key === 'appType') {
                let appType = '';
                if (item.appType == 1) {
                    appType = '普通应用'
                } else if (item.appType == 2) {
                    appType = '游戏'
                } else if (item.appType == 3) {
                    appType = '助手'
                }
                item = {...item, appType }
            }
        }
        return item;
    });
    return ary;
};

//格式化传给后台的数据
let formatData = (data) => {
    let obj = {};
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.prop === 'priceUp' || item.prop === 'priceDown') {
            obj = {...obj, [item.prop]: item[item.prop] * 100 }
        } else {
            obj = {...obj, [item.prop]: item[item.prop] }
        }

    }
    return obj;
};

//input 框数据校验
let countN = null;
let countM = null;
let inputRule = (item) => {
    return {
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
            item[item.prop] = item[item.prop] === undefined ? '' : item[item.prop];

            if (item[item.prop].length === 0) {
                callback(new Error(`${item.name}不能为空`));
            } else {
                if (item.prop === 'loginName') {
                    let reg = /^\w+$/;
                    if (reg.test(item.loginName)) {
                        axios.get(`/user/check?loginName=${item.loginName}`).then(res => {
                            if (res) {
                                callback(new Error(`${res.message}`));
                            } else {
                                callback();
                            }
                        })
                    } else {
                        callback(new Error('用户名由数字、字母、下划线组成'));
                    }
                } else if (item.prop === 'passwd') {
                    let reg = /^[^\u4E00-\u9FA5]+$/;
                    if (reg.test(item.passwd)) {
                        callback();
                    } else {
                        callback(new Error('密码不能有中文'));
                    }
                } else if (item.prop === 'countN') {
                    let reg = /^\d+$/;
                    if (!reg.test(item[item.prop])) {
                        callback(new Error('请输入正整数'));
                    } else {
                        countN = item.countN;
                        console.log(22, countN, countM);
                        callback();
                    }
                } else if (item.prop === 'countM') {
                    let reg = /^\d+$/;
                    if (!reg.test(item[item.prop])) {
                        callback(new Error('请输入正整数'));
                    } else {
                        countM = item.countM;
                        if (countN <= countM) {
                            callback(new Error('下游成功次数应小于上游成功次数'))
                        } else {
                            callback();
                        }
                    }

                } else if (item.prop === 'rate') {
                    let reg = /^0(\.\d)*$/;
                    if (reg.test(item.rate)) {
                        callback();
                    } else {
                        callback(new Error('请输入小于1的数'))
                    }

                } else if (item.prop === 'productId') {
                    let reg = /^([0-9A-Za-z])+$/;
                    if (reg.test(item.productId)) {
                        axios.get(`/product/check?productId=${item.productId}`).then(res => {
                            if (res) {
                                callback(new Error(`${res.message}`));
                            } else {
                                callback();
                            }
                        })
                    } else {
                        callback(new Error('只能输入字母或数字'));
                    }

                } else if (item.prop === 'phone') {
                    let reg = /^1(\d){10}$/;
                    if (reg.test(item.phone)) {
                        callback();
                    } else {
                        callback(new Error('手机号码不合法'));
                    }
                } else if (item.prop === 'priceUp' || item.prop === 'priceDown') {
                    let reg = /^(\d|([1-9])\d+)(\.(\d){1,2})?$/;
                    if (reg.test(item[item.prop])) {
                        callback();
                    } else {
                        callback(new Error('小数点后最多保留两位'));
                    }
                } else if (item.prop === 'email') {
                    let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    if (reg.test(item.email)) {
                        callback();
                    } else {
                        callback(new Error('邮箱不合法，请重新输入'));
                    }
                } else {
                    callback();
                }
            }

        }
    }

};

//state校验
let stateRule = (state) => ({
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


//let admin={username:localStorage.getItem('loginName'),role:localStorage.getItem('role')};



//规格lable宽度
let lableWidth = { indexWidth: 70, dateWidth: 170 };

export { formatDate, formatData, stateRule, inputRule, lableWidth };