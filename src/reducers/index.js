import { combineReducers } from 'redux'
import store from '../stores/index';
const baseinfo_state={
  info:"啦啦啦"
};

function baseinfo(state=baseinfo_state,action){//广告条
  if (action.type=='baseinfo') {
    if (Object.assign) {
      return Object.assign({},state,action.data);
    }
    else{
      return assign({},state,action.data);
    }
  }
  return state;
}



const syncReducers={baseinfo};
const asyncReducers={};

export function createRootReducer() {
  return combineReducers({
    ...syncReducers,
    ...asyncReducers
  })
}

export function injectReducer(reducers) {
  for(let i=0,len=reducers.length;i<len;i++){
    let item=reducers[i];
    asyncReducers[item.key] = item.reducer;
  }
  store.replaceReducer(createRootReducer()) // 替换当前的 rootReducer
}