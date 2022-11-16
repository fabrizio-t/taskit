import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function Taglist({ list, deleteFromList }) {

    if (list.length === 0) return (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            List is empty...
        </Paper>
    )
    return (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {list.map((data) => {
                return (
                    <ListItem key={data._id}>
                        <Chip
                            label={data.email}
                            variant="outlined"
                            onDelete={() => deleteFromList(data)}
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}