import { combineReducers } from 'redux';

const projects = (state = [], action) => {
  if (action.type === 'Prj_update') return [...action.data];
  return state;
};

const tasks = (state = [], action) => {
  if (action.type === 'Tsk_update') {
    return [...action.data];
  }
  return state;
};

// Combining both reducers
const reducers = combineReducers({
  projects,
  tasks,
});

export default reducers;
