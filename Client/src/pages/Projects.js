import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, registerUserAndGetProjects, getFullDate } from '../utils/services.js'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

//------------------My components--------------------
import Taglist from "./../components/Taglist";
import User from "./../components/User";
import Vmenu from "./../components/Vmenu";
import Adduser from "./../components/Adduser";
import Msgbox from "./../components/Msgbox";

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
    //Editor Mode - define mode when saving project
    const [editor, editorMode] = useState({ mode: false, id: null });
    //Value of ReactQuill Text Editor
    const [description, setEditorValue] = useState('');
    //Value of form
    const [form, setForm] = useState({/*  title: '', deadline: new Date().toISOString().slice(0, 16), collabs: []  */ });
    //Invited members to the project
    const [invitedList, setInvitedList] = useState([]);
    //Project team members
    const [teamMembers, setTeamMembers] = useState([]);
    //Save access token
    const token = useSelector(state => state.token);
    //Show Message box
    const msg = useSelector(state => state.msg);
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
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
        if (user) initialize();
    }, [user, dispatch, getAccessTokenSilently]);

    //Open / Close Dialog Window
    const toggleDialog = () => {
        setOpen(!open);
    };

    //Create New project
    const newProject = () => {
        setForm(f => {
            f.title = '';
            f.deadline = '';
            f.collabs = [];
            return f;
        });
        setEditorValue('');
        editorMode({ mode: false, id: null });
        toggleDialog();
    };

    //Create New project
    const saveProject = async (event) => {
        console.log("saving date:", event.target.deadline.value, teamMembers.map(e => e._id), invitedList);
        event.preventDefault();
        let data;
        if (!editor.mode) {
            data = await apiSend('/projects', 'POST', token,
                {
                    title: event.target.title.value,
                    deadline: event.target.deadline.value,
                    description,
                    collabs: teamMembers.map(e => e._id),
                    invites: invitedList
                });
        }
        else {
            data = await apiSend('/projects/' + editor.id, 'PUT', token,
                {
                    title: event.target.title.value,
                    deadline: event.target.deadline.value,
                    description,
                    collabs: teamMembers,
                    invites: invitedList
                });
        }
        console.log("API RESPONSE: ", data);
        if (data.status === 'error') {
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
        const res = await apiSend('/projects', 'GET', token);
        dispatch({ type: 'Prj_update', data: res });
        toggleDialog();
    };

    const deleteProject = async (id) => {
        const data = await apiSend(`/projects/${id}`, 'DELETE', token);
        console.log("DELETING PROJECT: ", data);
        if (data.status === 'error') {
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
        const res = await apiSend('/projects', 'GET', token);
        //console.log("REFRESHING PROJECT DATA: ", res);
        dispatch({ type: 'Prj_update', data: res });
    }

    const editProject = (id) => {
        const pId = projects.findIndex(p => p._id === id);
        console.log("COLLABS:", pId, projects[pId].collabs);
        setForm(f => {
            f.title = projects[pId].title;
            f.deadline = projects[pId].deadline.slice(0, - 8);
            /* f.collabs = projects[pId].collabs;
            f.invites = projects[pId].invites; */
            return f;
        });
        setTeamMembers(projects[pId].collabs);
        setInvitedList(projects[pId].invites);
        setEditorValue(projects[pId].description);
        editorMode({ mode: true, id });
        toggleDialog();
    }

    const deleteInvite = (toDelete) => {
        console.log("To DELETE:", toDelete)
        setInvitedList((chips) => chips.filter((chip) => chip._id !== toDelete._id));
    };
    const addToInviteList = (email) => {
        setInvitedList((chips) => [...chips, { _id: Date.now(), email }]);
    };
    const deleteTeamMember = (toDelete) => {
        setTeamMembers((chips) => chips.filter((chip) => chip._id !== toDelete._id));
        /* setForm(f => {
            f.collabs = f.collabs.filter((collab) => collab._id !== toDelete._id);
            return f;
        }); */
    };

    if (!user) {
        return null;
    }

    return (
        <>
            {msg.title !== ''
                ? < Msgbox msg={msg} />
                : ''
            }
            <div className="button_cnt">
                <div><Button variant="contained" onClick={newProject}>New Project</Button></div>
            </div>

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
                    <form id="new_project" onSubmit={saveProject}>
                        <div className="form">
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={form.title} ></input>
                            <label>Description</label>
                            <ReactQuill theme="snow" value={description} onChange={setEditorValue} />
                            <label>Deadline</label>
                            <input type='datetime-local' name='deadline' defaultValue={form.deadline} />
                            <label>Invite Team Members</label>
                            <Adduser addToList={addToInviteList} type="user" />
                            <Taglist list={invitedList} deleteFromList={deleteInvite} />
                            <label>Team</label>
                            <Taglist list={teamMembers} deleteFromList={deleteTeamMember} />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog}>Cancel</Button>
                    <Button form='new_project' type="submit" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <section>
                <h2>Team Projects</h2>
                {projects.filter(p => p.collabs.length > 0).map((p, i) => <Project project={p} key={p._id} deleteProject={deleteProject} editProject={editProject} />)}
            </section>

            <section>
                <h2>My Projects</h2>
                {projects.filter(p => p.collabs.length === 0).map((p, i) => <Project project={p} key={p._id} deleteProject={deleteProject} editProject={editProject} />)}
            </section>
        </>
    );
};


function Project({ project, deleteProject, editProject }) {
    return (
        <>
            <div className="project">
                <div className="prj_date">
                    <div>
                        <Vmenu edit={editProject} del={deleteProject} id={project._id} />
                        <User user={project.owner}></User>
                    </div>
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