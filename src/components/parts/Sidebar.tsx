import { Component } from 'react';
import { inject, observer } from 'mobx-react';
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
import { NavLink } from 'react-router-dom';
import AccountsStore from '../../stores/AccountsStore';
import AccountsDropdown from "./AccountsDropdown";

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
            padding: theme.spacing(3),
            paddingTop: 0
        },
        active: {
            color: theme.palette.primary.dark,
            "& [class*='MuiListItemText']": {
                fontWeight: "bold"
            }
        }
    });

type StoreProps = {
    AccountsStore: AccountsStore;
};

interface Props extends StoreProps {
    classes: any;
    theme: any;
}

interface State {
    mobileOpen: boolean
}

@inject("AccountsStore")
@observer
class Sidebar extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }
    render() {
        const { classes, theme } = this.props;

        const handleDrawerToggle = () => {
            this.setState({mobileOpen: !this.state.mobileOpen});
        };

        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <AccountsDropdown />
                <Divider />
                <List>
                    {[{text: 'Main', link: '/'}, {text: 'Dialogs', link: '/dialogs'},
                        {text: 'My comments', link: '/comments'}, {text: 'Settings', link: '/settings'}].map((pair, index) => (
                        <ListItem button key={pair.text} component={NavLink} to={pair.link} exact={index===0} activeClassName={classes.active}>
                            <ListItemText primary={pair.text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        const container = window.document.body;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Split
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={handleDrawerToggle}
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

export default withStyles(styles, { withTheme: true })(Sidebar);
