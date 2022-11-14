import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function Taglist({ list, deleteFromList }) {
    /* const [chipData, setChipData] = React.useState(list); */

    /* React.useEffect(() => {
        setChipData(list);
        console.log("receiving:", list)
    }, [list]); */
    if (list.length == 0) return (
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
                let icon;

                {/* if (data.label === 'React') {
                    icon = <TagFacesIcon />;
                } */}
                return (
                    <ListItem key={data._id}>
                        <Chip
                            icon={icon}
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