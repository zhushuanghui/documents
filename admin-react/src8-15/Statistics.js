import React, {Component} from 'react';
import { Select} from 'element-react';
import axios from 'axios';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie' ;
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import MHeader from "./comments/MHeader";
import ChannelID from "./comments/ChannelID";
axios.defaults.headers={'X-Requested-With': 'XMLHttpRequest'};

class Statistics extends Component {

    constructor() {
        super();
        this.state = {
            loginStatus:0,
            options: [],
            value: '',
            pieData: [{value: 0, name: 'success'}, {value: 0, name: 'fail'}],
            pieData2: [{value: 0, name: 'success'}, {value: 0, name: 'fail'}]

        }
    }


    componentDidMount() {
       this.pieInit();
    }

    //初始化饼图数据
    pieInit=()=>{
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        // 绘制图表
        myChart.setOption({
            title: {text: '被调统计图表', x: 'center'},
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['成功', '失败']
            },
            series: [
                {
                    name: '被调统计图表',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: this.state.pieData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },]
        });
        myChart2.setOption({
            title: {text: '主调统计图表', x: 'center'},
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['成功', '失败', '其他']
            },
            series: [
                {
                    name: '主调统计图表',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: this.state.pieData2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },]
        });
    };

    onChange = (value) => {

            axios.get(`/info/dataCount?channelId=${value}`).then(res => {
                    this.setState({
                        loginStatus:0,
                        pieData: [{value: res[0]['success'], name: 'success'}, {value: res[0]['fail'], name: 'fail'}],
                        pieData2: [{value: res[1]['success'], name: 'success'}, {value: res[1]['fail'], name: 'fail'}]
                    })
            }).then(res=>{
                this.pieInit();
            }).catch(e => {
                console.log(e);
            })

    };

    render() {

        return (
                <div className="container">
                    <ChannelID handleChange={this.onChange}/>

                    <div className="pieImg">
                        <div id='main'
                             style={{width: '400px', height: '400px'}}>
                        </div>
                        <div id='main2'
                             style={{width: '400px', height: '400px'}}>
                        </div>
                    </div>

                </div>

        )
    }
}

export default Statistics;