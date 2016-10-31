import React,{Component} from 'react';
import ceshi from '../actions/ceshi.js';
require('../reducers/ceshi.js');

export default class index extends Component{
	render(){
		return 	<div>
					{this.props.ceshi}
				</div>
	}
	componentDidMount(){
		let dispatch=this.props.dispatch;
		dispatch(ceshi("加载后端数据啦"))
	}
}