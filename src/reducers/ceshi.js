import {injectReducer} from './index.js';

let ceshi_state="我是一个测试reduex数据";

function ceshi(state=ceshi_state,action){
	if (action.type=="ceshi") {
		return action.data;
	}
	return ceshi_state;
}

injectReducer([
{
	key:"ceshi",
	reducer:ceshi
}
	]);