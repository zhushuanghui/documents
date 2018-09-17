import axios from 'axios';


let failLogin = (data) => {
    if (data === 5) {
        window.location.hash = '#/authorize';
    } else {
        window.location.hash = '#/login';
    }

};

axios.defaults.headers.comments = {'X-Requested-With': 'XMLHttpRequest'};
axios.defaults.withCredentials = true;  //设置cross跨域 并设置访问权限 允许跨域携带cookie信息

//配置发送请求前的拦截器 可以设置token信息
axios.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

// 配置响应拦截器
axios.interceptors.response.use(res => {
    if (res.data.status === 4) {
        failLogin(4);
        return {total: '',rows:[]}
    } else if (res.data.status === 5) {
        failLogin(5);
    } else if (res.data.status === 0) {
        return Promise.resolve(res.data.data);
    } else if (res.data.status === -1) {
        return Promise.resolve(res.data);
    }
}, error => {
    console.info(error);
});
export default axios;

