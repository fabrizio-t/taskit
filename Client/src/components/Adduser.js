import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';

export default function Adduser({ addToList, type }) {
    const [email, setEmail] = React.useState('');

    const handleChange = (prop) => (event) => {
        /* setValues({ ...values, [prop]: event.target.value }); */
        //console.log(prop, event.target.value);
        setEmail(event.target.value);
    };
    /* const handleSubmit = (event) => {
        console.log("TEST:", email);
    } */
    const add = () => {

        if (email !== '') addToList(email);
        setEmail('');
    }

    return (

        <>
            <Input
                placeholder={type === 'user' ? 'user@email.com' : 'customTag'}
                onChange={handleChange('email')}
                id="input-with-icon-adornment"
                value={email}
                startAdornment={
                    <InputAdornment position="start">
                        {/* <AccountCircle /> */}
                        {type === 'user' ? <AccountCircle /> : '#'}
                    </InputAdornment>
                }
            />
            <Button onClick={() => add()} variant="contained">Add</Button>
        </>

    );
}