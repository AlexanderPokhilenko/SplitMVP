import { Component, Fragment, ChangeEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import AccountsDropdown from "./AccountsDropdown";
import {IconButton, Tabs, Tab, Box, Badge} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DialogPreviews from "./DialogPreviews";
import { matchPath } from 'react-router';
import { inject, observer } from "mobx-react";
import DialogsPreviewsStore from '../../stores/DialogsPreviewsStore';
import DialogsCreator from "./DialogsCreator";

const drawerWidth = 240;

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: "0 " + theme.spacing(3) + "px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        active: {
            color: theme.palette.primary.dark,
            "& [class*='MuiListItemText']": {
                fontWeight: "bold"
            }
        },
        tab: {
            minWidth: drawerWidth / 2 + 'px'
        }
    });

type StoreProps = {
    DialogsPreviewsStore: DialogsPreviewsStore;
};

interface Props extends StoreProps {
    classes: any;
    theme: any;
}

interface State {
    open: boolean;
    tabIndex: number;
}

type CurrentProps = RouteComponentProps & Props;

class TabPanel extends Component<{value: number, index: number}> {
    render() {
        const {value, index, children, ...other} = this.props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box>
                        {this.props.children}
                    </Box>
                )}
            </div>
        );
    }
}

@inject("DialogsPreviewsStore")
@observer
class Sidebar extends Component<CurrentProps, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: CurrentProps) {
        super(props);
        this.state = { ...this.state, tabIndex: 1 };
    }

    handleDrawerToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
        this.setState({tabIndex: newValue});
    };

    generateTabProps(index: any) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    render() {
        const { classes, theme, DialogsPreviewsStore } = this.props;
        const disableElements = !DialogsPreviewsStore.isAuthorized;
        const isDialogPage = matchPath(this.props.location.pathname, "/dialogs/:id(\\d+)?");

        const navList = (
            <List>
                <ListItem button key={"main_nav_item"} component={NavLink} to={'/'} exact activeClassName={classes.active}>
                    <ListItemText primary={"Main"} />
                </ListItem>
                <ListItem button key={"dialogs_nav_item"} disabled={disableElements} component={NavLink} to={'/dialogs'} activeClassName={classes.active}>
                    <Badge badgeContent={disableElements ? 0 : DialogsPreviewsStore.totalUnreadMessages} color="secondary">
                        <ListItemText primary={"Dialogs"} />
                    </Badge>
                </ListItem>
                <ListItem button key={"comments_nav_item"} disabled={disableElements} component={NavLink} to={'/comments'} activeClassName={classes.active}>
                    <ListItemText primary={"My comments"} />
                </ListItem>
                <ListItem button key={"settings_nav_item"} disabled={disableElements} component={NavLink} to={'/settings'} activeClassName={classes.active}>
                    <ListItemText primary={"Settings"} />
                </ListItem>
            </List>
        );

        const tabs = (
            <Fragment>
                <Tabs value={this.state.tabIndex} onChange={this.handleTabChange} aria-label="Navigation tabs">
                    <Tab className={classes.tab} label="Pages" {...this.generateTabProps(0)} />
                    <Tab className={classes.tab} label="Dialogs" {...this.generateTabProps(1)} />
                </Tabs>
                <TabPanel value={this.state.tabIndex} index={0}>
                    {navList}
                </TabPanel>
                <TabPanel value={this.state.tabIndex} index={1}>
                    <DialogsCreator/>
                    <DialogPreviews/>
                </TabPanel>
            </Fragment>
        );

        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <AccountsDropdown />
                <Divider />
                {isDialogPage ? tabs : navList}
            </div>
        );

        const container = window.document.body;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            edge="start"
                            className={classes.menuButton}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Split
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="Navigation links">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.open}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default withRouter(withStyles(styles, { withTheme: true })(Sidebar));
