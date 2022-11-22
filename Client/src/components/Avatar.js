import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

export default function Teamlist({ list, deleteFromList }) {
    if (list.length === 0) return null;
    return (
        <>
            {list.map((data) => {
                return (
                    <Chip
                        key={data._id}
                        avatar={<Avatar alt="user picture" src={data.picture} />}
                        label={data.nickname}
                        variant="outlined"
                        onDelete={() => deleteFromList(data)}
                    />
                );
            })}
        </>
    );
}