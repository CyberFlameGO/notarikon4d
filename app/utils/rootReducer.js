import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import io from 'socket.io-client';

import users from '../reducers/users';

const socket = io();

const rootReducer = combineReducers({
  users,
  socket: (state = socket) => state,
  routing: routerReducer,
});

export default rootReducer;
