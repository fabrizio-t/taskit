import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, registerUserAndGetProjects } from '../utils/services.js'
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
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (token) initialize();
    }, [token]);

    const initialize = async () => {
        try {
            //console.log("TOKEN:", token)
            const res = await apiSend('/projects/' + _id, 'GET', token);
            //console.log("TASKS:", res.data)
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

    //Create New Task
    const saveTask = async (event) => {

        //console.log("TOKEN:", token);
        const { name, deadline, color, priority } = form;
        const data = await apiSend('/projects/' + _id, 'POST', token, { name, deadline, color, priority, todos: [], tags: [] });
        //console.log("SAVING NEW TASK: ", data);
        const res = await apiSend('/projects/' + _id, 'GET', token);
        //console.log("REFRESHING TASKS DATA: ", res.data);
        dispatch({ type: 'Tsk_update', data: res.data });
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

    if (!user) {
        return null;
    }

    return (
        <>
            <h2>Project: {_id}</h2>
            <Button onClick={toggleDialog}>New Task</Button>
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
                {projectTasks.tasks.map((t, i) => <Task task={t} key={i} deleteTask={deleteTask} />)}
            </section>
        </>
    );
};


function Task({ task, deleteTask }) {
    return (
        <>

            <div className="project">
                <div className="prj_date">{task.deadline} <button onClick={() => deleteTask(task._id)}>Delete</button></div>
                <h2>{task.name}</h2>
            </div>
        </>
    );
}

export default Tasks