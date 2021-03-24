import { Component, Fragment } from "react";
import {
    Avatar, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem
} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccountsSearcher from "./AccountsSearcher";
import Account from "../../data/Account";
import {inject, observer} from "mobx-react";
import DialogsStore from "../../stores/DialogsStore";

type StoreProps = {
    DialogsStore: DialogsStore;
};

interface Props extends StoreProps {
    dialogId: number;
}

interface State {
    dialogIsOpen: boolean;
    dialogName: string;
    dialogUrl: string;
    selectedAccount: Account | null;
}

@inject("DialogsStore")
@observer
export default class AccountInvitationItem extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state, dialogIsOpen: false, selectedAccount: null };
    }

    handleDialogClick = () => {
        this.setState({dialogIsOpen: true});
    }

    handleDialogClose = () => {
        this.setState({dialogIsOpen: false});
    }

    handleAccountChange = (account: Account | null) => {
        this.setState({selectedAccount: account});
    }

    inviteNewMember = () => {
        const account = this.state.selectedAccount;
        if(!account) return;
        const dialogId = this.props.dialogId;
        this.props.DialogsStore.dialogsConnection.inviteToChat(account.id, dialogId)
            .then(() => this.setState({ dialogIsOpen: false, selectedAccount: null }));
    }

    render() {
        const dialogsStore = this.props.DialogsStore;
        const disabled = !dialogsStore.dialogsConnection.isConnected || !this.state.selectedAccount;
        const dialogIsOpen = this.state.dialogIsOpen;

        return (
            <Fragment>
                <MenuItem onClick={this.handleDialogClick}>
                    <Avatar className="small-thumbnail" alt="Invite icon"><PersonAddIcon/></Avatar>
                    <ListItemText primary="Invite"/>
                </MenuItem>
                <Dialog open={dialogIsOpen} onClose={this.handleDialogClose}>
                    <DialogTitle>Invite member</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To invite new member, please select account here.
                        </DialogContentText>
                        <AccountsSearcher label="New member" action={this.handleAccountChange}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">Cancel</Button>
                        <Button onClick={this.inviteNewMember} color="primary" disabled={disabled}>Invite</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}
