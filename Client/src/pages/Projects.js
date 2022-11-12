import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, registerUserAndGetProjects, getFullDate } from '../utils/services.js'
import { Link } from "react-router-dom";
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

function Projects() {
    const projects = useSelector(state => state.projects);
    const dispatch = useDispatch();
    //Dialog Window
    const [open, setOpen] = useState(false);
    //Value of ReactQuill Text Editor
    const [description, setEditorValue] = useState('');
    //Value of form
    const [form, setForm] = useState({ title: '', deadline: new Date().toISOString().slice(0, 16) });
    //Save access token
    /* const [token, setToken] = useState(''); */
    const token = useSelector(state => state.token);
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (user) initialize();
    }, [user]);

    const initialize = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            //console.log("TOKEN ----->", accessToken);
            dispatch({ type: 'Token', data: accessToken });
            const data = await registerUserAndGetProjects(accessToken, user);
            dispatch({ type: 'Prj_update', data });
        }
        catch (e) {
            console.log("ERROR:", e);
        }
    }

    //Open / Close Dialog Window
    const toggleDialog = () => {
        setOpen(!open);
    };

    //Create New project
    const newProject = () => {
        toggleDialog();
    };

    //Create New project
    const saveProject = async (event) => {
        //event.target.
        const { title, deadline } = form;
        const data = await apiSend('/projects', 'POST', token, { title, deadline, description });
        //console.log("SAVING PROJECT: ", data);
        const res = await apiSend('/projects', 'GET', token);
        //console.log("REFRESHING PROJECT DATA: ", res);
        dispatch({ type: 'Prj_update', data: res });
        toggleDialog();
        event.preventDefault();
    };

    const setProject = (event) => {
        setForm(f => {
            f[event.target.name] = event.target.value;
            return f;
        })
    }

    const deleteProject = async (id) => {
        const data = await apiSend(`/projects/${id}`, 'DELETE', token);
        //console.log("DELETING PROJECT: ", data);
        const res = await apiSend('/projects', 'GET', token);
        //console.log("REFRESHING PROJECT DATA: ", res);
        dispatch({ type: 'Prj_update', data: res });
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Button onClick={newProject}>New Project</Button>
            <form onSubmit={saveProject}>
                <Dialog
                    open={open}
                    onClose={toggleDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Project:"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        </DialogContentText>
                        <div className="form">
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={form.title} onChange={setProject}></input>
                            <label>Description</label>
                            <ReactQuill theme="snow" value={description} onChange={setEditorValue} />
                            <label>Deadline</label>
                            <input type='datetime-local' name='deadline' defaultValue={form.deadline} onChange={setProject} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDialog}>Cancel</Button>
                        <Button onClick={saveProject} autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
            <section>
                {projects.map((p, i) => <Project project={p} key={i} deleteProject={deleteProject} />)}
            </section>
        </>
    );
};


function Project({ project, deleteProject }) {
    return (
        <>

            <div className="project">
                <div className="prj_date">
                    <div><button onClick={() => deleteProject(project._id)}>❌</button></div>
                    <div>{getFullDate(project.deadline)}</div>
                </div>
                <Link to={"/projects/" + project._id}>
                    <h2>{project.title}</h2>
                </Link>
                <div dangerouslySetInnerHTML={{ __html: project.description }}></div>
            </div>
        </>
    );
}

export default Projects