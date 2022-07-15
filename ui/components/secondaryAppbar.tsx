import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BackButton from './backButton';

interface Props {
    name?: string
}

const SecondaryAppBar = ({ name }: Props) => {
    return (
        <Box sx={{ flexGrow: 1, "alignItems": "stretch" }}>
            <AppBar position="static">
                <Toolbar>
                    <BackButton />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {name || "Page"}
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default SecondaryAppBar
