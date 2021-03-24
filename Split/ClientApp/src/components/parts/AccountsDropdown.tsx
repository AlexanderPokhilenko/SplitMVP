import {ChangeEvent, Component, MouseEvent} from 'react';
import { inject, observer } from 'mobx-react';
import AccountsStore from '../../stores/AccountsStore';
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import {
    Avatar,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText, TextField, DialogActions
} from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddIcon from '@material-ui/icons/Add';
import AccountDropdownItem from "./AccountDropdownItem";
import Account from "../../data/Account";

const styles = () =>
    createStyles({
        selected: {
            textTransform: "none",
            width: "100%",
            "& [class*='MuiListItemText']": {
                fontWeight: "bold"
            },
            "& [class*='MuiListItemIcon']": {
                minWidth: 0
            }
        },
        fullWidth: {
            width: "100%"
        }
    });

type StoreProps = {
    AccountsStore: AccountsStore;
};

interface Props extends StoreProps {
    classes: any;
}

interface State {
    anchorEl: HTMLElement | null;
    dialogIsOpen: boolean;
    dialogName: string;
    dialogUrl: string;
}

@inject("AccountsStore")
@observer
class AccountsDropdown extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state, dialogIsOpen: false };
    }

    handleDialogNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({dialogName: event.target.value.trim()});
    }

    handleDialogUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({dialogUrl: event.target.value.trim()});
    }

    handleDialogClick = () => {
        this.setState({dialogIsOpen: true});
    }

    handleDialogClose = () => {
        this.setState({dialogIsOpen: false});
    }

    handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
        this.setState({anchorEl: event.currentTarget});
    }

    handleMenuClose = () => {
        this.setState({anchorEl: null});
    }

    logOut = () => {
        this.handleMenuClose();
        this.props.AccountsStore.signOut("/").then(() => window.location.replace("/"));
    }

    selectAccount = (id: number) => {
        this.props.AccountsStore.selectAccount(id);
        this.setState({anchorEl: null});
    }

    createNewAccount = () => {
        const {dialogName, dialogUrl} = this.state;
        this.props.AccountsStore.createAccount(dialogName, dialogUrl).then(this.handleDialogClose);
    }

    private accountIsSelected(account: Account): boolean {
        const selectedAccount = this.props.AccountsStore.selectedAccount;
        return account === selectedAccount;
    }

    private getSelectedClassName(account: Account): string {
        return this.accountIsSelected(account) ? this.props.classes.selected : "";
    }

    render() {
        const accountsStore = this.props.AccountsStore;

        if(!accountsStore.isAuthorized) {
            const pathPrefix = "/authentication/login";
            const disabled = window.location.pathname.startsWith(pathPrefix);
            return (
                <Button className={this.props.classes.fullWidth} disabled={disabled} variant="outlined"
                        href={pathPrefix + "?returnUrl=" + window.location.href}>Sign In</Button>
            );
        }

        const dialogIsOpen = this.state.dialogIsOpen || (accountsStore.isAuthorized && accountsStore.hasNoAccounts);

        const multiAccount = accountsStore.multiAccount;
        const selectedAccount = accountsStore.selectedAccount;
        const menuId = "accounts_menu";
        const keyPrefix = "user_account_";
        const disabled = !accountsStore.isAuthorized;

        return (
            <div>
                <Button aria-controls={menuId} aria-haspopup="true" onClick={this.handleMenuClick} className={this.props.classes.selected}>
                    <Avatar className="thumbnail" alt={selectedAccount.username} src={selectedAccount.imageUrl} />
                    <ListItemText primary={selectedAccount.username} />
                    <ListItemIcon>
                        <ArrowDropDownIcon fontSize="large" />
                    </ListItemIcon>
                </Button>
                <Menu
                    id={menuId}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
                >
                    <AccountDropdownItem key="multi_account_item" account={multiAccount} onClick={this.selectAccount} specialClassName={this.getSelectedClassName(multiAccount)}/>
                    <Divider />
                    {accountsStore.userAccounts.map(account =>
                        <AccountDropdownItem key={keyPrefix + account.id} account={account} onClick={this.selectAccount} specialClassName={this.getSelectedClassName(account)}/>)}
                    <MenuItem button key="add_account_item" onClick={this.handleDialogClick} disabled={disabled}>
                        <Avatar className="small-thumbnail" alt="Add icon"><AddIcon/></Avatar>
                        <ListItemText primary="Add account"/>
                    </MenuItem>
                    <Divider />
                    <MenuItem button key="log_out_item" onClick={this.logOut}>Log Out</MenuItem>
                </Menu>
                <Dialog open={dialogIsOpen} onClose={this.handleDialogClose}>
                    <DialogTitle>Create account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create new account, please enter the name of new account here and image url (optional).
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Account Name"
                            type="text"
                            fullWidth
                            onChange={this.handleDialogNameChange}
                        />
                        <TextField
                            margin="dense"
                            label="New Account Image URL"
                            type="text"
                            fullWidth
                            onChange={this.handleDialogUrlChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">Cancel</Button>
                        <Button onClick={this.createNewAccount} color="primary" disabled={disabled}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AccountsDropdown);
