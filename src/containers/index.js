import React,{Component} from 'react';

export default class index extends Component{
	render(){
		let self=this;
		return 	<div>
					<div>{this.props.baseinfo.info}</div>
					<div>
						{
							typeof this.props.children.map=="function"?
							this.props.children.map(function(item){
								return React.cloneElement(item,{...self.props})
							}):React.cloneElement(this.props.children,{...self.props})
						}
					</div>
				</div>
	}
}