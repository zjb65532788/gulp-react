import React,{Component} from 'react';
import {render} from 'react-dom';

import store from '../stores/index';
import Index from '../containers/index.js';
import {Router,Route} from '../components/route.js';
import { connect,Provider } from 'react-redux';

function select(state) {
  	return {...state}
}
var Newapp=connect(select)(Index);

class Provn extends Component{
	render(){
		return <Provider store={store}>
				    <Newapp>{this.props.children}</Newapp>
				</Provider>
	}
}

//动态加载组件
function ceshi(callback){
	require.ensure(["../containers/ceshi"], function(require) {
			let Dzd = require("../containers/ceshi");
			callback(Dzd.default);
		});
}

class Apphome extends Component{
	render(){
		return 	<Router>
					<Route Path="/" Component={Provn}>
						<Route Path="/ceshi" getComponent={ceshi}>
						</Route>
					</Route>
				</Router>
	}
}

render(
	<Apphome></Apphome>,
	document.getElementById('content')
)