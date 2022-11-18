import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend, formInitial, getShortDate, getFullDate, helpTask } from '../utils/services.js'
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

//------------------My components--------------------
import Todos from "./../components/Todos";
import User from "./../components/User";
import Vmenu from "./../components/Vmenu";
import Progress from "./../components/Progress";
import Msgbox from "./../components/Msgbox";
import Taglist from "./../components/Taglist";
import Adduser from "./../components/Adduser";
import Filter from "./../components/Filter";
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';


function Tasks() {
    //Project ID we are operating in
    let { _id } = useParams();
    //Config Redux state
    const projectTasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();
    //Dialog Window
    const [open, setOpen] = useState(false);
    //Task Dialog Window
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
    //Invited members to the project
    const [tagList, setTagList] = useState([]);
    //OverAll rogress tracker
    const [progress, setProgress] = useState(0);
    //Show Message box
    const msg = useSelector(state => state.msg);
    //Get user details from auth0
    const { user, getAccessTokenSilently } = useAuth0();
    /* let token = useSelector(state => state.token); */
    let [token, setToken] = useState('');

    useEffect(() => {
        const initialize = async () => {
            try {
                const t = await getAccessTokenSilently();
                setToken(t);
                /* dispatch({ type: 'Token', data: accessToken }); */
                console.log("TOKEN:", t)
                const res = await apiSend('/projects/' + _id, 'GET', t);
                console.log("API RESPONSE:", res);
                dispatch({ type: 'Tsk_update', data: res.data });
            }
            catch (e) {
                console.log("ERROR:", e);
            }
        }
        if (user) initialize();
    }, [user, dispatch, _id, getAccessTokenSilently]);

    useEffect(() => {
        const computeProgress = () => {
            const completedTodos = projectTasks.tasks.map(task => task.tags.some(f => f.email === 'milestone') ? task.todos.filter(t => t.status === 'green').length : 0)
                .reduce((partialSum, a) => partialSum + a, 0);
            if (completedTodos > 0) {
                const totalTodos = projectTasks.tasks.map(task => task.tags.some(f => f.email === 'milestone') ? task.todos.length : 0)
                    .reduce((partialSum, a) => partialSum + a, 0);
                setProgress(completedTodos / totalTodos * 100);
            }
            else setProgress(0);
        }
        computeProgress();
    }, [projectTasks]);

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
        setTagList([])
        toggleDialog();
    };

    //Create New Task
    const saveTask = async (event) => {

        const { name, deadline, color, priority } = form;
        console.log("saving date:", deadline.substr(0, deadline - 8));
        console.log("<<<<<<<Saving task with token:", token)
        let data = null;
        if (!editMode.mode) data = await apiSend('/projects/' + _id, 'POST', token, { name, deadline, color, priority, todos: [], tags: tagList });
        else if (editMode.id) data = await apiSend('/projects/' + _id + '/task/' + editMode.id, 'PUT', token, { name, deadline, color, priority, tags: tagList });
        //refresh data
        console.log("API Response:", data);
        if (data.status === 'error') {
            //setMsg({ title: data.status, descr: data.message });
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
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
        if (data.status === 'error') {
            //setMsg({ title: data.status, descr: data.message });
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
        const res = await apiSend(`/projects/${_id}`, 'GET', token);
        console.log("REFRESHING PROJECT TASKS: ", res);
        dispatch({ type: 'Tsk_update', data: res.data });
    }

    const editTask = async (id) => {
        setEditMode({ mode: true, id });
        const index = projectTasks.tasks.findIndex(t => t._id === id);
        setForm({
            name: projectTasks.tasks[index].name,
            deadline: projectTasks.tasks[index].deadline.slice(0, - 8),
            color: projectTasks.tasks[index].color,
            priority: projectTasks.tasks[index].priority
        });
        setTagList(projectTasks.tasks[index].tags);
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
        if (data.status === 'error') {
            //setMsg({ title: data.status, descr: data.message });
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
        //refresh data
        const res = await apiSend('/projects/' + _id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

        toggleTask();
    };

    const deleteTag = (toDelete) => {
        console.log("To DELETE:", toDelete)
        setTagList((chips) => chips.filter((chip) => chip._id !== toDelete._id));
    };
    const addToTagList = (email) => {//Email is actually the Tag in this case -> To FIX
        setTagList((chips) => [...chips, { _id: Date.now(), email }]);
    };

    const help = () => {
        const title = 'How to use TasKit';
        const descr = helpTask();
        dispatch({ type: 'Msg', data: { title, descr } });
    }

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
                <div>
                    <Link to="/projects">
                        <Button size="small">
                            <ArrowBackIcon /> Back
                        </Button>
                    </Link>
                </div>
                <div><Button color="success" onClick={help}><ContactSupportIcon /> Help</Button></div>
                <div><Progress key="overall_progress" data={progress} /></div>
            </div>
            <div className="prj_title"><h1>{projectTasks.title}</h1></div>
            <div className="button_cnt">
                <div><Button variant="contained" onClick={newTask}><AddIcon />New Task</Button></div>
                <div>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="Disabled elevation buttons"
                    >
                        <Button onClick={() => dispatch({ type: 'Open_filter', data: true })}><FilterAltIcon /></Button>
                        <Button onClick={() => setView(true)}><CalendarMonthIcon /></Button>
                        <Button onClick={() => setView(false)}><FormatListBulletedIcon /></Button>
                    </ButtonGroup>
                </div>
            </div>
            <form>
                <Dialog
                    key='task_new_edit'
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
                        <form>
                            <div className="form">
                                <label>Title</label>
                                <input type="text" name="name" defaultValue={form.name} onChange={setValue}></input>
                                <label>Deadline</label>
                                <input type='datetime-local' name='deadline' defaultValue={form.deadline} onChange={setValue} />
                                <div className="hide">Color</div>
                                <input className="hide" type='text' name='color' defaultValue={form.color} onChange={setValue}></input>
                                <div className="hide">Priority</div>
                                <select className="hide" name="priority" onChange={setValue} defaultValue={form.priority}>
                                    <option value={0}>Low</option>
                                    <option value={1}>Medium</option>
                                    <option value={2}>High</option>
                                </select>
                                <label>Add Tags</label>
                                <Adduser key="uddUsr" addToList={addToTagList} type="tag" />
                                <Taglist key="tagLst" list={tagList} deleteFromList={deleteTag} />
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDialog}>Cancel</Button>
                        <Button onClick={saveTask} autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    key='todo_new_edit'
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
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid key="cal_container" container spacing={1}>
                            {Array.from(Array(30).keys()).map(i => (
                                <Grid key={'cal_day_' + i} xs={12} sm={6} md={4} lg={3}>
                                    <div className="calendar_date">
                                        {getShortDate(new Date().setDate(new Date().getDate() + i))}
                                    </div>
                                    <div className="calendar_cnt">
                                        {projectTasks.tasks.filter(t => getShortDate(t.deadline) === getShortDate(new Date().setDate(new Date().getDate() + i))).map((t, i) => (
                                            <Task task={t} key={'c' + i} index={i} deleteTask={deleteTask} editTask={editTask} newTodo={newTodo} editTodo={editTodo} view={view} />
                                        )
                                        )}
                                    </div>
                                </Grid>
                            )
                            )}
                        </Grid>
                    </Box>
                </>
                : ''
            }
            <Filter key="filter_dialog" id={_id} token={token} />
        </>
    );
};


function Task({ task, deleteTask, editTask, index, newTodo, editTodo, view }) {

    const progressCalc = () => {
        const v = task.todos.reduce((acc, t) => t.status === 'green' ? acc + 1 : acc, 0);
        return v === 0 ? 0 : (v / task.todos.length * 100);
    }

    return (
        <>
            <div className="mb">

                <Accordion key={'a' + index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div className="mb">
                            <div className="prj_date">
                                <div>
                                    <Vmenu edit={editTask} del={deleteTask} id={task._id} />
                                    <User user={task.user}></User>
                                </div>
                                <div>{!view ? getShortDate(task.deadline) : ''}</div>
                                <div><Progress data={progressCalc} /></div>
                            </div>
                            <div><h3>{task.name}</h3></div>
                            <div>
                                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                    {task.tags.map((tag, i) => (
                                        <Chip
                                            key={'chip_' + i}
                                            color={tag.email === 'milestone' ? "primary" : "default"}
                                            variant="default"
                                            size="small"
                                            label={tag.email}
                                        />
                                    ))}
                                </Stack>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <Button size="small" variant="outlined" onClick={() => newTodo(task._id)}> <AddIcon />New Todo</Button>
                            <Todos key={'t' + index} todos={task.todos} taskId={task._id} editTodo={editTodo} />
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}

export default Tasks