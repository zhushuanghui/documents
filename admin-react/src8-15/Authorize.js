import React, {Component} from 'react';


class Authorize extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="authorize">
                <div className="logo">
                    <div className="iconfont icon-weishouquan">
                    </div>
                    <p> 抱歉，您无权访问该页面</p>
                </div>

            </div>

        )
    }
}

export default Authorize;