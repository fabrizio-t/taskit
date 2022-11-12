import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, formInitial, getShortDate, getFullDate } from '../utils/services.js'
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

//------------------Text Editor ReactQuill--------------------
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

//------------------Material UI--------------------
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
/* import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack'; */
/* import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; */

import Todos from "./../components/Todos";

function Tasks() {
    //Project ID we are operating in
    let { _id } = useParams();
    //Config Redux state
    const projectTasks = useSelector(state => state.tasks);
    let token = useSelector(state => state.token);
    const dispatch = useDispatch();
    //Dialog Window
    const [open, setOpen] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    //Value of form
    const [form, setForm] = useState({ name: '', deadline: new Date().toISOString().slice(0, 16), color: '#fff', priority: 0 });
    //Value of ReactQuill Text Editor
    const [description, setEditorValue] = useState('');
    //Edit mode
    const [editMode, setEditMode] = useState({ mode: false, id: null });
    //Todo mode
    const [editModeTodo, setEditModeTodo] = useState({ mode: false, taskId: null, todoId: null });
    //Task view mode
    const [view, setView] = useState(true);
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();

    var tIndex = 0;

    useEffect(() => {
        if (token) initialize();
    }, [token]);

    const initialize = async () => {
        try {
            console.log("TOKEN:", token)
            const res = await apiSend('/projects/' + _id, 'GET', token);
            console.log("API RESPONSE:", res);
            dispatch({ type: 'Tsk_update', data: res.data });
        }
        catch (e) {
            console.log("ERROR:", e);
        }
    }

    //Open / Close Dialog Window
    const toggleDialog = () => {
        setOpen(!open);
    };
    const toggleTask = () => {
        setOpenTask(!openTask);
    };

    //New Task
    const newTask = () => {
        setEditMode({ mode: false, id: null });
        setForm(formInitial());
        toggleDialog();
    };

    //Create New Task
    const saveTask = async (event) => {

        const { name, deadline, color, priority } = form;
        let data = null;
        if (!editMode.mode) data = await apiSend('/projects/' + _id, 'POST', token, { name, deadline, color, priority, todos: [], tags: [] });
        else if (editMode.id) data = await apiSend('/projects/' + _id + '/task/' + editMode.id, 'PUT', token, { name, deadline, color, priority });
        //refresh data
        console.log("API Response:", data);
        const res = await apiSend('/projects/' + _id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

        setEditMode({ mode: false, id: null });
        setForm(formInitial());

        toggleDialog();
        event.preventDefault();
    };

    const setValue = (event) => {
        setForm(f => {
            f[event.target.name] = event.target.value;
            return f;
        })
    }

    const deleteTask = async (id) => {
        const data = await apiSend(`/projects/${_id}/task/${id}`, 'DELETE', token);
        console.log("DELETING TASK: ", data);
        const res = await apiSend(`/projects/${_id}`, 'GET', token);
        console.log("REFRESHING PROJECT TASKS: ", res);
        dispatch({ type: 'Tsk_update', data: res.data });
    }

    const editTask = async (id) => {
        setEditMode({ mode: true, id });
        const index = projectTasks.tasks.findIndex(t => t._id === id);
        setForm({
            name: projectTasks.tasks[index].name,
            deadline: projectTasks.tasks[index].deadline,
            color: projectTasks.tasks[index].color,
            priority: projectTasks.tasks[index].priority
        });

        toggleDialog();
    }

    const newTodo = async (taskId) => {
        setEditorValue('');
        setEditModeTodo({ mode: false, taskId, todoId: null })
        toggleTask();
    };

    const editTodo = async (taskId, todoId) => {
        setEditModeTodo({ mode: true, taskId, todoId })
        console.log("---->", taskId, todoId)
        const taskIndex = projectTasks.tasks.findIndex(t => t._id === taskId);
        const todoIndex = projectTasks.tasks[taskIndex].todos.findIndex(t => t.id === todoId);
        setEditorValue(projectTasks.tasks[taskIndex].todos[todoIndex].value);
        toggleTask();
    };

    const saveTodo = async () => {

        const taskIndex = projectTasks.tasks.findIndex(t => t._id === editModeTodo.taskId);
        const todoIndex = projectTasks.tasks[taskIndex].todos.findIndex(t => t.id === editModeTodo.todoId);
        let updatedTodos = projectTasks.tasks[taskIndex].todos.slice();
        let taskid = editModeTodo.taskId;
        console.log("PROJ", projectTasks);

        if (!editModeTodo.mode) {
            updatedTodos.push({ id: Date.now(), status: 'neutral', value: description });
        }
        else {
            updatedTodos[todoIndex].value = description;
        }
        let data = await apiSend('/projects/' + _id + '/task/' + taskid, 'PUT', token, { todos: updatedTodos });
        console.log("DATA:", data);
        //refresh data
        const res = await apiSend('/projects/' + _id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

        toggleTask();
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="page_nav">
                <div>
                    <Link to="/projects">
                        <Button variant="outlined" startIcon={'⬅️'}>
                            Back
                        </Button>
                    </Link>
                </div>
                <div><h2>Project: {projectTasks.title}</h2></div>
            </div>
            <div className="button_cnt">
                <div><Button variant="contained" onClick={newTask}>New Task</Button></div>
                <div>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="Disabled elevation buttons"
                    >
                        <Button onClick={() => setView(true)}>Calendar</Button>
                        <Button onClick={() => setView(false)}>List</Button>
                    </ButtonGroup>
                </div>
            </div>
            <form>
                <Dialog
                    open={open}
                    onClose={toggleDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Task:"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        </DialogContentText>
                        <div className="form">
                            <label>Title</label>
                            <input type="text" name="name" defaultValue={form.name} onChange={setValue}></input>
                            <label>Deadline</label>
                            <input type='datetime-local' name='deadline' defaultValue={form.deadline} onChange={setValue} />
                            <label>Color</label>
                            <input type='text' name='color' defaultValue={form.color} onChange={setValue}></input>
                            <label>Priority</label>
                            <select name="priority" onChange={setValue}>
                                <option value={0} selected={form.priority == 0}>Low</option>
                                <option value={1} selected={form.priority == 1}>Medium</option>
                                <option value={2} selected={form.priority == 2}>High</option>
                            </select>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDialog}>Cancel</Button>
                        <Button onClick={saveTask} autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openTask}
                    onClose={toggleTask}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Todo:"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        </DialogContentText>
                        <ReactQuill theme="snow" value={description} onChange={setEditorValue} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleTask}>Cancel</Button>
                        <Button onClick={saveTodo} autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
            {!view ?
                <section>
                    {projectTasks.tasks.map((t, i) => <Task task={t} key={'l' + i} index={i} deleteTask={deleteTask} editTask={editTask} newTodo={newTodo} editTodo={editTodo} />)}
                </section>
                : ''
            }
            {view ?
                <section className="calendar">
                    {Array.from(Array(30).keys()).map(i => (
                        <div className="calendar_day">
                            <div className="calendar_date">
                                {getShortDate(new Date().setDate(new Date().getDate() + i))}
                            </div>
                            <div className="calendar_cnt">
                                {projectTasks.tasks.filter(t => getShortDate(t.deadline) == getShortDate(new Date().setDate(new Date().getDate() + i))).map((t, i) => (
                                    <Task task={t} key={'c' + i} index={i} deleteTask={deleteTask} editTask={editTask} newTodo={newTodo} editTodo={editTodo} />)
                                )}
                            </div>
                        </div>)
                    )}
                </section>
                : ''
            }
        </>
    );
};


function Task({ task, deleteTask, editTask, index, newTodo, editTodo }) {

    return (
        <>
            <div className="mb">

                <Accordion key={'a' + index}>
                    <AccordionSummary
                        expandIcon={'➕'}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div className="mb">
                            <div className="prj_date">
                                <div>
                                    <button onClick={() => deleteTask(task._id)}>❌</button>
                                    <button onClick={() => editTask(task._id)}>🛠️</button>
                                </div>
                                <div>{getFullDate(task.deadline)}</div>
                            </div>
                            <div><h3>{task.name}</h3></div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <Button variant="outlined" onClick={() => newTodo(task._id)}>New Todo</Button>
                            <Todos key={'t' + index} todos={task.todos} taskId={task._id} editTodo={editTodo} />
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}

export default Tasks