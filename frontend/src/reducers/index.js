import { combineReducers } from 'redux';
import userReducer from './user';

const root=combineReducers({userReducer});

export default root;
