import React,{Component} from 'react';

const rootPath={

};

let histrotycontrol={
	fun:''
}
window.rootPath=rootPath;
export class Router extends Component{
	constructor(){
		super();
		this.state={
			load:false,
			list:[],
			listload:false,
			app:null
		}
	}
	render(){
		//let app="";
		/*if(this.state.list.length>0&&this.state.listload){
			app=this.getapp(this.state.list);
		}*/
		return <div>{
					this.state.load?<div>{this.state.app}</div>:<div className="hidden">{this.props.children}</div>
				}</div>
	}
	getapp(list){
		let self=this;
		if (list.length>0) {
			let App=list[0].Component;
			let param={};
			if (list[0].param) {
				param=list[0].param;
			}
			list.shift();
			return <App params={param}>{self.getapp(list)}</App>
		}else{
			return null;
		}
	}
	componentDidMount(){
		this.setState({
			load:true
		});
		this.changestate();
		this.hashchange();
	}
	hashchange(){
		let self=this;

		if (window.history.pushState) {
			histrotycontrol.fun=function(){
				self.changestate();
			}
			window.onpopstate=function(){
				self.changestate();
			}
		}else{
			window.onhashchange=function(){
				self.changestate();
			}
		}
		if (!location.hash) {
			location.hash="#/";
		}
		
	}
	changestate(){
		let self=this;
		let children=this.props.children;
		let hash=location.hash;
		let nowhistory=hash.replace("#","");
		if (nowhistory=="") {
			nowhistory="/";
		}
		this.setState({
			list:[],
			listload:false
		});
		let arr=[];
		if (nowhistory=="/") {
			/*this.gethtml(rootPath,[""]);
			return false;*/
			arr=[""];
		}else{
			arr=nowhistory.split("/");
		}
		arr.push("IndexRoute");
		/*for (let i=0,len=arr.length;i<len;i++){
			let item="/"+arr[i];
			console.log(item);
			console.log(rootPath[item]);
		}*/
		this.gethtml(rootPath,arr);
	}
	gethtml(obj,arr){
		let self=this;
		if (arr&&arr.length>0) {
			let newjson=obj["/"+arr[0]];
			if (newjson) {
				arr.shift();
				let Component="";
				if (newjson.Component) {
					let list=self.state.list;
					list.push({Component:newjson.Component,param:""});
					self.setState({list:list});
					self.gethtml(newjson,arr);
				}else if(newjson.getComponent){
					let param="",
						index=0;
					while (newjson.paramarr&&arr.length>0&&arr[0]!="IndexRoute") {
						if (param) {
						}else{
							param={};
						}
						param[newjson.paramarr[index]]=arr[0];
						arr.shift();
						index++;
					}
					newjson.getComponent(function(Component) {
						let list=self.state.list;
						list.push({Component,param});
						self.setState({list:list});
						self.gethtml(newjson,arr);
					});
				}
			}else{
				let app=this.getapp(self.state.list);
				self.setState({listload:true,app});
				//console.log('结束');
			}
		}else{
			let app=this.getapp(self.state.list);
			self.setState({listload:true,app});
				//console.log('结束');
		}
	}
}

function json_deep(obj,arr,value){
	if (arr&&arr.length>0) {
		if (!obj[arr[0]]) {
			obj[arr[0]]=value;
			return false;
		}
		let newjson=obj[arr[0]];
		arr.shift();
		json_deep(newjson,arr,value);
	}
}

export class IndexRoute extends Component{
	constructor(){
		super();
		this.state={
			path:'',
		}
	}
	render(){
		let self=this;
		return null;
	}
	componentWillMount(){
		let props=this.props;
		let nowpath="/IndexRoute";
		let Component=this.props.Component;
		let getComponent=this.props.getComponent;
		let newpath=this.props.fa_path?this.props.fa_path+","+nowpath:nowpath;
		let arr=newpath.split(",");
		json_deep(rootPath,arr,{path:nowpath,Component,getComponent});		
		/*this.setState({
			path:newpath
		});*/
	}
}

export class Route extends Component{
	constructor(){
		super();
		this.state={
			path:'',
		}
	}
	render(){
		let self=this;
		return <div className="hidden">
					{
						(this.props.children&&typeof this.props.children.map)=="function"?
						this.props.children.map(function(item,key){
							return React.cloneElement(item,{fa_path:self.state.path});
						}):this.props.children?
						React.cloneElement(this.props.children,{fa_path:self.state.path})
						:null
					}
				</div>
	}
	componentWillMount(){
		let props=this.props;
		let nowpath=this.props.Path;
		let Component=this.props.Component;
		let getComponent=this.props.getComponent;
		if (/\:(\S)+/.test(nowpath)) {
			let newpath=this.props.fa_path;
			let arr=newpath.split(",");
			arr.push("paramarr");
			let nowpath_arr=nowpath.split(":");
			let param=[];
			for(var i=0,len=nowpath_arr.length;i<len;i++){
				let key=nowpath_arr[i];
				if(key){
					param.push(key);
				}
			}
			json_deep(rootPath,arr,param);	
			this.setState({
				path:newpath
			});
		}else{
			let newpath=this.props.fa_path?this.props.fa_path+","+nowpath:nowpath;
			let arr=newpath.split(",");
			json_deep(rootPath,arr,{path:nowpath,Component,getComponent});	
			this.setState({
				path:newpath
			});
		}
		
	}
	componentDidMount(){

	}
}



export class Link extends Component{
	render(){
		return <a onClick={(e)=>this.onclickhanlder(e)} className={this.props.className||""}>{this.props.children}</a>
	}
	onclickhanlder(e){
		if (this.props.onClick) {
			this.props.onClick();
			return false;
		}
		if (this.props.href=="javascript:;") {
			return false;
		}
		else if (window.history.pushState) {
			window.history.pushState({title:'金服商城'},this.props.title,window.location.href.replace(/#(\/\S*)*$/g,"#/"+this.props.href));
			histrotycontrol.fun();
		}else{
			window.location.hash="#/"+this.props.href;
		}
	}
}

export function jump(href,title){
	if (window.history.pushState) {
		window.history.pushState({title:title||""},title||"",window.location.href.replace(/#(\/\S*)*$/g,"#/"+href));
		histrotycontrol.fun();
	}else{
		window.location.hash="#/"+href;
	}
}