/*import App_redux from '../reducers/index';
import { createStore , applyMiddleware} from 'redux';

const store = createStore(App_redux);

export default store;*/


import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import {createRootReducer} from '../reducers/index';

const loggerMiddleware = createLogger()

const store = createStore(
  createRootReducer(),
  applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
  )
)

export default store;