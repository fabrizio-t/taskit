import { combineReducers } from 'redux';

const filters = (state = { from: '', to: '', tags: '' }, action) => {
  if (action.type === 'Filters') return action.data;
  return state;
};

const open_filter = (state = false, action) => {
  if (action.type === 'Open_filter') return action.data;
  return state;
};

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
  msg,
  filters,
  open_filter
});

export default reducers;
