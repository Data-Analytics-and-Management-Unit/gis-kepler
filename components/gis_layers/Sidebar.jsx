import React, { useState } from "react";
import CheckboxTree from 'react-checkbox-tree-reorderable';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LayersIcon from '@mui/icons-material/Layers';
import ApiIcon from '@mui/icons-material/Api';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import styles from "../../styles/Checklist.module.scss";

import data from "./data.json";
import layers from "../../public/styles/mute.json";

for (var i = 0; i < layers.layers.length; i++) {
    layers.layers[i].label = layers.layers[i].id;
    layers.layers[i].value = layers.layers[i].id;
    
}


function Checklist(props) {
    const [expanded, setExpanded] = useState([]);
    const [nodes, setOrderNodes] = useState(props.data);

    function handleCheck(checked) {
        props.handleCheck(checked)
    }

    function handleExpanded(expanded) {
        setExpanded(expanded);
    }
    function onOrderChange(orderedNodes) {
        setOrderNodes(orderedNodes);
    }

    return (

        <CheckboxTree

            nodes={nodes}
            checked={props.checked}
            expanded={expanded}
            onCheck={handleCheck}
            onExpand={handleExpanded}
            orderable={true}
            onOrderChange={onOrderChange}




            // icons={{
            //     check: <i className="fa-regular fa-square-check"></i>,
            //     uncheck: <span className="rct-icon rct-icon-uncheck" />,
            //     halfCheck: <span className="rct-icon rct-icon-half-check" />,
            //     expandClose: <i className="fa-regular fa-square-plus fa-1x"></i>,
            //     expandOpen: <i className="fa-regular fa-square-minus fa-1x"></i>,
            //     expandAll: <span className="rct-icon rct-icon-expand-all" />,
            //     collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
            //     parentClose: <i className="fa-solid fa-layer-group"></i>,
            //     parentOpen: <i className="fa-solid fa-layer-group"></i>,
            //     leaf: ""
            // }}

            // icons={{
            //     check: <FontAwesomeIcon icon={regular('coffee')} />,
            //     uncheck: <FontAwesomeIcon icon={regular('coffee')} />,
            //     halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
            //     expandClose: <FontAwesomeIcon icon={regular('coffee')} />,
            //     expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
            //     expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
            //     collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
            //     parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
            //     parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
            //     leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />
            // }}

            icons={{
                uncheck:  <CropSquareIcon/>,
                check: <CheckBoxIcon/>,
                halfCheck: <IndeterminateCheckBoxIcon/>,
                expandClose: <ChevronRightIcon/>,
                expandOpen: <ChevronRightIcon sx={{transform: 'rotate(90deg)'}}/>,
                expandAll: <ChevronRightIcon sx={{transform: 'rotate(90deg)'}}/>,
                collapseAll: <ChevronRightIcon sx={{transform: 'rotate(90deg)'}}/>,
                parentClose: <LayersIcon/>,
                parentOpen: <LayersIcon/>,
                leaf: <ApiIcon/>
            }}

        />

    )
}


function Sidebar(props) {

    const drawerWidth = 500;

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginRight: -drawerWidth,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginRight: 0,

            }),
        }),
    );

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,

        }),
    }));

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));


    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div" />
                            <h3>India Urban Observatory | GIS Explorer</h3>

                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerOpen}
                            sx={{ ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader />

                </Main>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            backgroundColor: '#272727'
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <div className={styles.data_heading}>
                        <Typography variant="h6">
                            Custom Data
                        </Typography>
                    </div>
                    <Divider />
                    <div className={styles.custom_data}>
                        <Checklist
                            data={data.data}
                            handleCheck={props.handleCheck}
                            checked={props.checked}
                        />
                    </div>
                    <Divider />
                    <div className={styles.data_heading}>
                        <Typography variant="h6">
                            Base Data
                        </Typography>
                    </div>
                    <Divider />
                    <div className={styles.custom_data}>
                    <Checklist
                        data={layers.layers}
                        handleCheck={props.handleCheckBase}
                        checked={props.checkedBase}


                    />
                        </div>

                    <Divider />



                </Drawer>


            </Box>
        </ThemeProvider>
    );
}





export default Sidebar;
