import { Component, MouseEvent } from 'react';
import { inject, observer } from 'mobx-react';
import AccountsStore from '../../stores/AccountsStore';
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import { Avatar, Button, Menu, MenuItem, ListItemIcon } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
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
}

@inject("AccountsStore")
@observer
class AccountsDropdown extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }

    handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        this.setState({anchorEl: event.currentTarget});
    }

    handleClose = () => {
        this.setState({anchorEl: null});
    }

    logOut = () => {
        this.handleClose();
        //window.location.reload();
    }

    selectAccount = (id: number) => {
        this.props.AccountsStore.selectAccount(id);
        this.setState({anchorEl: null});
    }

    private accountIsSelected(account: Account): boolean {
        const selectedAccount = this.props.AccountsStore.getSelected();
        return account === selectedAccount;
    }

    private getSelectedClassName(account: Account): string {
        return this.accountIsSelected(account) ? this.props.classes.selected : "";
    }

    render() {
        const accountsStore = this.props.AccountsStore;
        const multiAccount = accountsStore.multiAccount;
        const selectedAccount = accountsStore.getSelected();
        const menuId = "accounts_menu";
        const keyPrefix = "user_account_";

        return (
            <div>
                <Button aria-controls={menuId} aria-haspopup="true" onClick={this.handleClick} className={this.props.classes.selected}>
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
                    onClose={this.handleClose}
                >
                    <AccountDropdownItem key={"multi_account_item"} account={multiAccount} onClick={this.selectAccount} specialClassName={this.getSelectedClassName(multiAccount)}/>
                    <Divider />
                    {accountsStore.getAccounts().map(account =>
                        <AccountDropdownItem key={keyPrefix + account.id} account={account} onClick={this.selectAccount} specialClassName={this.getSelectedClassName(account)}/>)}
                    <Divider />
                    <MenuItem button key={"log_out_item"} onClick={this.logOut} component={Link} to={"/sign"}>Log Out</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AccountsDropdown);
