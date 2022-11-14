import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getFullDate } from '../utils/services';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';


export default function Tableview({ data, uid, toggleCollab }) {

    /* const [checked, setChecked] = useState(false); */

    const handleChange = (event, id) => {
        /* setChecked(event.target.checked, id); */
        //console.log(uid, row.collabs);
        toggleCollab(event.target.checked, id);
    };
    const check = (row) => {
        console.log(row.collabs, uid, row.collabs.includes(uid));
    }
    return (
        <TableContainer component={Paper}>
            {/* sx={{ minWidth: 650 }} */}
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Project name:</b></TableCell>
                        <TableCell align="right"><b>Description:</b></TableCell>
                        <TableCell align="right"><b>Deadline:</b></TableCell>
                        <TableCell align="right"><b>Actions:</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="right" dangerouslySetInnerHTML={{ __html: row.description }}></TableCell>
                            <TableCell align="right">{getFullDate(row.deadline)}</TableCell>
                            <TableCell align="right">
                                <Switch
                                    key={'sw_' + row._id}
                                    checked={row.collabs.includes(uid)}
                                    onChange={(e) => handleChange(e, row._id)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}