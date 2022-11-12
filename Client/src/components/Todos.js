import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { apiSend } from '../utils/services.js'


function Todos({ todos, taskId, editTodo }) {

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
            {todos.map((t, i) => <Todo todo={t} key={i} index={i} taskId={taskId} editTodo={editTodo} />)}
        </>
    );

}


function Todo({ todo, taskId, index, editTodo }) {

    const projectTasks = useSelector(state => state.tasks);
    let token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const taskIndex = projectTasks.tasks.findIndex(t => t._id === taskId);
    const todoIndex = projectTasks.tasks[taskIndex].todos.findIndex(t => t.id === todo.id);

    let style = todo.status;

    const handleStyle = async () => {

        if (style === 'neutral') style = 'green';
        else if (style === 'green') style = 'red';
        else if (style === 'red') style = 'neutral';

        let updatedTodos = projectTasks.tasks[taskIndex].todos.slice();
        updatedTodos[todoIndex].status = style;

        console.log("TASKID And updated TODO:", taskId, updatedTodos);

        let data = await apiSend('/projects/' + projectTasks._id + '/task/' + taskId, 'PUT', token, { todos: updatedTodos });
        console.log("DATA:", data);
        //refresh data
        const res = await apiSend('/projects/' + projectTasks._id, 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });

    }

    const deleteTodo = async () => {

        let updatedTodos = projectTasks.tasks[taskIndex].todos.slice();
        updatedTodos.splice(todoIndex, 1);

        let data = await apiSend('/projects/' + projectTasks._id + '/task/' + taskId, 'PUT', token, { todos: updatedTodos });
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
                        <div className='tasknum' onClick={() => handleStyle()}>#{index + 1}</div>
                        <div className='taskedit' dangerouslySetInnerHTML={{ __html: todo.value }} onClick={() => { editTodo(taskId, todo.id) }}>
                        </div>
                    </div>
                </div>
                <div className={'delete'} onClick={() => { deleteTodo() }}></div>
            </div>
        </>
    );
}

export default Todos