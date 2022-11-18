import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { apiSend } from '../utils/services.js'

function Filter({ id, token }) {

    let filters = useSelector(state => state.filters);
    const open_filter = useSelector(state => state.open_filter);
    const dispatch = useDispatch();

    /* const [open, setOpen] = useState(false); */

    const toggleDialog = () => {
        dispatch({ type: 'Open_filter', data: !open_filter })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.from.value);
        let params = [];
        if (e.target.from.value !== '') params.push('from=' + e.target.from.value);
        if (e.target.to.value !== '') params.push('to=' + e.target.to.value);
        if (e.target.tags.value !== '') params.push('tags=' + e.target.tags.value);
        const res = await apiSend('/projects/' + id + '/?' + params.join("&"), 'GET', token);
        dispatch({ type: 'Tsk_update', data: res.data });
        toggleDialog();
    }

    return (
        <>
            <Dialog
                key='task_filter'
                open={open_filter}
                onClose={toggleDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Filters:"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                    <form id="filter_form" onSubmit={handleSubmit}>
                        <div className="form">
                            <label>From</label>
                            <input type='datetime-local' name='from' defaultValue={filters.from} />
                            <label>To</label>
                            <input type='datetime-local' name='to' defaultValue={filters.to} />
                            <label>Tags</label>
                            <input type='text' name='tags' defaultValue={filters.tags} ></input>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog}>Cancel</Button>
                    <Button form='filter_form' type="submit" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default Filter