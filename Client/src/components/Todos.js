import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { apiSend } from '../utils/services.js'
//------------------Text Editor ReactQuill--------------------
/* import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; */

//------------------Material UI--------------------
/* import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; */


function Todos({ todos, taskIndex, editTodo }) {
    console.log("TODOS:", todos);

    //Dialog Window
    const [open, setOpen] = useState(true);

    /*     const editTodo = async (_id, id, todos) => {
    
            let data = await apiSend('/projects/' + _id + '/task/' + id, 'PUT', token, { todos });
            //refresh data
            const res = await apiSend('/projects/' + _id, 'GET', token);
            dispatch({ type: 'Tsk_update', data: res.data });
    
            toggleDialog();
        }; */

    const toggleDialog = () => {
        setOpen(!open);
    };

    return (
        <>
            {/* <Dialog
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
                    Hello
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog}>Cancel</Button>
                    <Button onClick={editTodo} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog> */}
            {todos.map((t, i) => <Todo todo={t} key={i} index={i} taskIndex={taskIndex} editTodo={editTodo} />)}
        </>
    );

}


function Todo({ todo, taskIndex, index, editTodo }) {

    const projectTasks = useSelector(state => state.tasks);
    let token = useSelector(state => state.token);
    const dispatch = useDispatch();

    let style = todo.status;

    const handleStyle = async (taskIndex, index) => {

        if (style === 'neutral') style = 'green';
        else if (style === 'green') style = 'red';
        else if (style === 'red') style = 'neutral';

        let updatedTodos = projectTasks.tasks[taskIndex].todos.slice();
        let taskid = projectTasks.tasks[taskIndex]._id;

        updatedTodos[index].status = style;

        console.log("Updated TODO:", updatedTodos)

        let data = await apiSend('/projects/' + projectTasks._id + '/task/' + taskid, 'PUT', token, { todos: updatedTodos });
        console.log("DATA:", data);
        //refresh data
        const res = await apiSend('/projects/' + projectTasks._id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

    }

    const deleteTodo = async (taskIndex, index) => {

        let updatedTodos = projectTasks.tasks[taskIndex].todos.slice();
        let taskid = projectTasks.tasks[taskIndex]._id;
        console.log("PROJ", projectTasks);

        updatedTodos.splice(index, 1);

        let data = await apiSend('/projects/' + projectTasks._id + '/task/' + taskid, 'PUT', token, { todos: updatedTodos });
        console.log("DATA:", data);
        //refresh data
        const res = await apiSend('/projects/' + projectTasks._id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

    };

    return (
        <>
            <div className='itemContainer'>
                <div className={`section ${style}`}>
                    <div className='taskcnt'>
                        <div className='tasknum' onClick={() => handleStyle(taskIndex, index)}>#{index + 1}</div>
                        <div className='taskedit' dangerouslySetInnerHTML={{ __html: todo.value }} onClick={() => { editTodo(taskIndex, index) }}>
                        </div>
                    </div>
                </div>
                <div className={'delete'} onClick={() => { deleteTodo(taskIndex, index) }}></div>
            </div>
        </>
    );
}

export default Todos