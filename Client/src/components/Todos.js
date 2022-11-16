import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { apiSend } from '../utils/services.js'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function Todos({ todos, taskId, editTodo }) {

    //Dialog Window
    /* const [open, setOpen] = useState(true); */

    /* const toggleDialog = () => {
        setOpen(!open);
    }; */

    return (
        <>
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
        if (data.status === 'error') {
            dispatch({ type: 'Msg', data: { title: data.status, descr: data.message } });
            return false;
        }
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
                <div onClick={() => { deleteTodo() }}><RemoveCircleOutlineIcon /></div>
                {/* className={'delete'} */}
            </div>
        </>
    );
}

export default Todos