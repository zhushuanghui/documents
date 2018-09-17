import React, {
  Component
} from "react";
import "element-theme-default";
import {
  NavMenu,
  Button
} from "element-react";
import {
  NavLink,
  withRouter
} from "react-router-dom";
import {
  connect
} from "react-redux";
import "babel-polyfill";
import {
  actions
} from "./store";
import axios from "./common/axios";

@connect(
  state => ({ ...state
  }),
  actions
)
class App extends Component {
  constructor() {
    super();
    this.state = {
      loginName: "",
      role: ""
    };
  }

  handelClick = () => {
    axios.get("/user/out").then(res => {
      localStorage.clear();
      this.props.history.push("/login");
    });
  };

  componentWillMount() {
    console.log(this.props);
    this.setState({
      loginName: localStorage.getItem("loginName"),
      role: localStorage.getItem("role")
    });
  }

  render() {
    // let role = this.state.role;
    let role = this.props.role;
    let style = role === "2" ? {
      display: "block"
    } : {
      display: "none"
    };
    let style1 = role === "1" ? {
      display: "block"
    } : {
      display: "none"
    };
    return ( <
      div className = "app" >
      <
      div className = "header" >
      <
      div className = "user" > {
        " "
      } { /*用户名:{this.state.loginName}*/ }
      用户名: {
        this.props.loginName
      } {
        " "
      } <
      Button type = "text"
      className = "button exit"
      onClick = {
        this.handelClick
      } >
      退出 {
        " "
      } <
      /Button>{" "} <
      /div>{" "} <
      /div>

      <
      div className = "page" >
      <
      div className = "nav"
      style = {
        {
          textAlign: "center"
        }
      } >
      <
      NavLink to = {
        "/channel"
      }
      style = {
        style
      } >
      <
      div className = "row" > 配置列表 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/deliver"
      } >
      <
      div className = "row" > 投递列表 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/product"
      }
      style = {
        style
      } >
      <
      div className = "row" > 产品列表 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/productdown"
      }
      style = {
        style1
      } >
      <
      div className = "row" > 产品列表 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/admin"
      }
      style = {
        style
      } >
      <
      div className = "row" > 用户管理 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/daylist"
      }
      style = {
        style
      } >
      <
      div className = "row" > 每日统计 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/daylistdown"
      }
      style = {
        style1
      } >
      <
      div className = "row" > 每日统计 < /div>{" "} <
      /NavLink>{" "} <
      NavLink to = {
        "/statistics"
      } >
      <
      div className = "row" > 图表统计 < /div>{" "} <
      /NavLink>{" "} <
      /div>{" "} <
      div className = "containerBox" > {
        this.props.children
      } < /div>{" "} <
      /div> <
      /div>
    );
  }
}

export default withRouter(App);