import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, formInitial } from '../utils/services.js'
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

//------------------Text Editor ReactQuill--------------------
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

//------------------Material UI--------------------
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Tasks() {
    //Project ID we are operating in
    let { _id } = useParams();
    //Config Redux state
    const projectTasks = useSelector(state => state.tasks);
    let token = useSelector(state => state.token);
    const dispatch = useDispatch();
    //Dialog Window
    const [open, setOpen] = useState(false);
    //Value of ReactQuill Text Editor
    const [description, setEditorValue] = useState('');
    //Value of form
    const [form, setForm] = useState({ name: '', deadline: new Date().toISOString().slice(0, 16), color: '#fff', priority: "0" });
    //Edit mode
    const [editMode, setEditMode] = useState({ mode: false, id: null });
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (token) initialize();
    }, [token]);

    const initialize = async () => {
        try {
            console.log("TOKEN:", token)
            const res = await apiSend('/projects/' + _id, 'GET', token);
            console.log("TASKS:", res.data)
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
        else if (editMode.id) data = await apiSend('/projects/' + _id + '/task/' + editMode.id, 'PUT', token, { name, deadline, color, priority, todos: [], tags: [] });
        //refresh data
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
        console.log("form:", form);
    }

    const deleteTask = async (id) => {
        const data = await apiSend(`/projects/${_id}/task/${id}`, 'DELETE', token);
        console.log("DELETING TASK: ", data);
        const res = await apiSend(`/projects/${_id}`, 'GET', token);
        console.log("REFRESHING PROJECT TASKS: ", res);
        dispatch({ type: 'Tsk_update', data: res.data });
    }

    const editTask = async (index) => {
        setEditMode({ mode: true, id: projectTasks.tasks[index]._id });
        setForm({
            name: projectTasks.tasks[index].name,
            deadline: projectTasks.tasks[index].deadline,
            color: projectTasks.tasks[index].color,
            priority: projectTasks.tasks[index].priority
        });

        toggleDialog();
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <h2>Project: {projectTasks.title}</h2>
            <Button onClick={newTask}>New Task</Button>
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
                        <label>Title</label>
                        <input type="text" name="name" defaultValue={form.name} onChange={setValue}></input>
                        <label>Deadline</label>
                        <input type='datetime-local' name='deadline' defaultValue={form.deadline} onChange={setValue} />
                        <label>Color</label>
                        <input type='text' name='color' defaultValue={form.color} onChange={setValue}></input>
                        <label>Priority</label>
                        <select name="priority" onChange={setValue}>
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                        </select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDialog}>Cancel</Button>
                        <Button onClick={saveTask} autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
            <section>
                {projectTasks.tasks.map((t, i) => <Task task={t} key={i} index={i} deleteTask={deleteTask} editTask={editTask} />)}
            </section>
        </>
    );
};


function Task({ task, deleteTask, editTask, index }) {
    return (
        <>
            <div className="project">
                <div className="prj_date">
                    {task.deadline}
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                    <button onClick={() => editTask(index)}>Edit</button>
                </div>
                <h2>{task.name}</h2>
                <div>
                    {task.todos.map((t, i) => <Todo todo={t} index={i} />)}
                </div>
            </div>
        </>
    );
}

function Todo({ todo, index }) {

    let [style, setStyle] = useState(todo.status);
    const handleStyle = () => {
        console.log(style);
        if (style === 'neutral') style = 'green';
        else if (style === 'green') style = 'red';
        else if (style === 'red') style = 'neutral';
        setStyle(style);
    }

    return (
        <>
            <div className='itemContainer'>
                <div className={`section ${style}`}>
                    <div className='taskcnt'>
                        <div className='tasknum' onClick={handleStyle}>#{index + 1}</div>
                        <div className='taskedit' dangerouslySetInnerHTML={{ __html: todo.value }} onClick={() => { }}>
                            {/*  {todo.value} */}
                        </div>
                    </div>
                </div>
                <div className={'delete'} onClick={() => { }}></div>
            </div>
        </>
    );
}

export default Tasks