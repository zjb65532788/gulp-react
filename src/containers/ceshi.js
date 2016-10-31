import React,{Component} from 'react';
require('../reducers/ceshi.js');

export default class index extends Component{
	render(){
		return 	<div>
					{this.props.ceshi}
				</div>
	}
}