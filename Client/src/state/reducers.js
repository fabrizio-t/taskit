import { combineReducers } from 'redux';

const msg = (state = { title: '', descr: '' }, action) => {
  if (action.type === 'Msg') return action.data;
  return state;
};

const token = (state = '', action) => {
  if (action.type === 'Token') return action.data;
  return state;
};

const projects = (state = [], action) => {
  if (action.type === 'Prj_update') return [...action.data];
  return state;
};

const tasks = (state = { tasks: [] }, action) => {
  if (action.type === 'Tsk_update') {
    return { ...action.data };
  }
  return state;
};

// Combining both reducers
const reducers = combineReducers({
  token,
  projects,
  tasks,
  msg
});

export default reducers;
