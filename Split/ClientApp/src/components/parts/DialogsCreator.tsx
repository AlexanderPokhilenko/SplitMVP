import React, {ChangeEvent, Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import {inject, observer} from "mobx-react";
import AccountsStore from '../../stores/AccountsStore';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Switch,
    Typography
} from "@material-ui/core";
import DialogsStore from "../../stores/DialogsStore";
import ListItemText from "@material-ui/core/ListItemText";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Account from "../../data/Account";
import AccountsSearcher from "./AccountsSearcher";

type StoreProps = {
    AccountsStore: AccountsStore;
    DialogsStore: DialogsStore;
};

interface Props extends StoreProps {
    action?: (id: number) => {};
}

interface State {
    dialogIsOpen: boolean;
    isDirect: boolean;
    dialogName: string;
    dialogUrl: string;
    selectedAccount: Account | null;
    selectedInterlocutor: Account | null;
}

@inject("AccountsStore", "DialogsStore")
@observer
export default class DialogsCreator extends Component<Props, State>  {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state, dialogIsOpen: false, isDirect: true, selectedAccount: null, selectedInterlocutor: null };
    }

    handleDialogClick = () => {
        this.setState({dialogIsOpen: true});
    }

    handleDialogClose = () => {
        this.setState({dialogIsOpen: false, dialogName: "", dialogUrl: "", selectedAccount: null, selectedInterlocutor: null});
    }

    handleDialogNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({dialogName: event.target.value.trim()});
    }

    handleDialogUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({dialogUrl: event.target.value.trim()});
    }

    handleDirectChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({isDirect: event.target.checked});
    }

    handleAccountChange = (account: Account | null) => {
        this.setState({selectedAccount: account});
    }

    handleInterlocutorChange = (account: Account | null) => {
        this.setState({selectedInterlocutor: account});
    }

    createNewDialog = () => {
        const {isDirect, selectedAccount, selectedInterlocutor, dialogName, dialogUrl} = this.state;
        const dialogsConnection = this.props.DialogsStore.dialogsConnection;
        if(selectedAccount === null) return;
        if(isDirect) {
            if(selectedInterlocutor === null) return;
            dialogsConnection.createDirectChat(selectedAccount.id, selectedInterlocutor.id).then(() => this.handleDialogClose());
        }
        else {
            dialogsConnection.createGroupChat(selectedAccount.id, dialogName, dialogUrl).then(() => this.handleDialogClose());
        }
    }

    render() {
        const {dialogIsOpen, isDirect} = this.state;

        return (
            <Fragment>
                <Button onClick={this.handleDialogClick} fullWidth>
                    <Avatar>
                        <GroupAddIcon/>
                    </Avatar>
                    <ListItemText primary="Create chat" />
                </Button>
                <Dialog open={dialogIsOpen} onClose={this.handleDialogClose}>
                    <DialogTitle>Create chat</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create new chat, please select interlocutors here.
                        </DialogContentText>
                        <Typography
                            component="span"
                            variant="subtitle1">
                            Group chat
                            <Switch checked={isDirect} onChange={this.handleDirectChange} />
                            Direct chat
                        </Typography>
                        {!isDirect && (
                            <Fragment>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="New Dialog Name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleDialogNameChange}
                                />
                                <TextField
                                    margin="dense"
                                    label="New Dialog Image URL"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleDialogUrlChange}
                                />
                            </Fragment>
                        )}
                    </DialogContent>
                    <AccountsSearcher label="Selected account" action={this.handleAccountChange} useOnlyUserAccounts />
                    {isDirect && <AccountsSearcher label="Interlocutor" action={this.handleInterlocutorChange} />}
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">Cancel</Button>
                        <Button onClick={this.createNewDialog} color="primary" disabled={!this.props.AccountsStore.isAuthorized}>Create</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}
