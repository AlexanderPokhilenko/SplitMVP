import '../../css/dialogs.css';
import '../../css/containers.css';
import {ChangeEvent, Component, Fragment, MouseEvent} from "react";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";
import {createStyles, Theme} from '@material-ui/core/styles';
import clsx from 'clsx';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    IconButton,
    InputAdornment,
    Menu,
    OutlinedInput,
    Typography,
    withStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import AccountsStore from "../../stores/AccountsStore";
import DialogsStore from "../../stores/DialogsStore";
import DialogsPreviewsStore from "../../stores/DialogsPreviewsStore";
import Dialog from "../../data/Dialog";
import AccountDropdownItem from "./AccountDropdownItem";
import MessageItem from "./MessageItem";
import Divider from "@material-ui/core/Divider";
import AccountInvitationItem from "./AccountInvitationItem";

const styles = (theme: Theme) =>
    createStyles({
        inline: {
            display: 'inline'
        },
        bold: {
            fontWeight: 'bold'
        },
        selected: {
            "& [class*='MuiListItemText']": {
                fontWeight: "bold"
            }
        }
    });

type StoreProps = {
    DialogsStore: DialogsStore;
    DialogsPreviewsStore: DialogsPreviewsStore;
    AccountsStore: AccountsStore;
};

interface Props extends StoreProps {
    dialogId: number;
    classes: any;
}

interface State {
    menuAnchorEl: HTMLElement | null;
    draft: string;
}

@inject("DialogsStore", "DialogsPreviewsStore", "AccountsStore")
@observer
class Chat extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state, draft: "" };
    }

    handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
        this.setState({menuAnchorEl: event.currentTarget});
    }

    handleMenuClose = () => {
        this.setState({menuAnchorEl: null});
    }

    handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({draft: event.target.value});
    }

    sendMessage = () => {
        this.props.DialogsStore.updateDialogDraft(this.props.dialogId, this.state.draft);
        this.props.DialogsStore.sendMessageFromDraft(this.props.dialogId);
        this.setState({draft: ""});
    }

    private createSubheader(firstPart: string, secondPart: string) {
        return (
            <Fragment>
                <Typography
                    component="span"
                    className={this.props.classes.inline}
                >
                    {firstPart}
                </Typography>
                <Typography
                    component="span"
                    className={clsx(this.props.classes.inline, this.props.classes.bold)}
                >
                    {secondPart}
                </Typography>
        </Fragment>
        );
    }

    private getFirstCurrentAccountUsername(dialog: Dialog): string {
        const accountsStore = this.props.AccountsStore;
        const selectedAccount = accountsStore.selectedAccount;
        this.props.DialogsStore.getDialogById(this.props.dialogId);
        if (dialog.membersIds.find(id => id === selectedAccount.id)) { return selectedAccount.username; }
        const currentAccountId = dialog.membersIds.find(id => this.isCurrentAccount(id));
        return accountsStore.getAccountById(currentAccountId ?? -1).username;
    }

    private isCurrentAccount(id: number): boolean {
        const accounts = this.props.AccountsStore.userAccounts;
        return accounts.find(a => a.id === id) !== undefined;
    }

    private getSelectedClassName(id: number): string {
        return this.isCurrentAccount(id) ? this.props.classes.selected : "";
    }

    private scrollToLastRead(): void {
        if (this.props.dialogId === undefined) { return; }
        const dialog = this.props.DialogsStore.getDialogById(this.props.dialogId);
        const lastReadMessage = document.getElementById('msg' + dialog.lastReadMessageId);
        if (lastReadMessage === null) { return; }
        lastReadMessage.scrollIntoView();
    }

    private tryMarkDialogAsRead() {
        const dialogsStore = this.props.DialogsStore;
        if(dialogsStore.dialogsConnection.isConnected) {
            dialogsStore.markDialogAsRead(this.props.dialogId);
        }
        else {
            dialogsStore.dialogsConnection.lastPromise.then(() => dialogsStore.markDialogAsRead(this.props.dialogId));
        }
    }

    private leaveDialog = (accountId: number) => {
        console.log("Leaving...");
        const {DialogsStore: dialogsStore, AccountsStore: accountsStore, dialogId} = this.props;
        dialogsStore.dialogsConnection.leaveChat(accountId, dialogId).then(() => {
            console.log("???");
            const membersIds = dialogsStore.getDialogById(dialogId).membersIds;
            const userAccounts = accountsStore.userAccounts;
            if(!membersIds.some(id => userAccounts.some(a => a.id === id))) {
                console.log("Go back");
                this.context.router.history.push("/dialogs");
            }
            console.log("Left!");
        });
    };

    componentDidMount() {
        this.tryMarkDialogAsRead();
        this.scrollToLastRead();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if(this.props.dialogId !== prevProps.dialogId) {
            this.tryMarkDialogAsRead();
            const dialogsStore = this.props.DialogsStore;
            dialogsStore.updateDialogDraft(prevProps.dialogId, prevState.draft);
            this.setState({draft: dialogsStore.getDraftById(this.props.dialogId)});
        }
        this.scrollToLastRead();
    }

    render() {
        const {
            dialogId: id,
            DialogsStore: dialogsStore,
            AccountsStore: accountsStore,
            DialogsPreviewsStore: previewsStore
        } = this.props;
        const dialog = dialogsStore.getDialogById(id);

        if(dialog === dialogsStore.unknownDialog) {
            return <Redirect to={"/dialogs"} />;
        }

        const isDirect = Dialog.checkIsDirect(dialog);

        const preview = previewsStore.getPreviewFromDialog(dialog);
        const subheader = isDirect ?
            this.createSubheader("Direct messages to ", this.getFirstCurrentAccountUsername(dialog)) :
            this.createSubheader(dialog.membersIds.length + " members including ", this.getFirstCurrentAccountUsername(dialog));

        const membersMenuId = "chat_members_menu";
        const draft = this.state.draft ?? dialogsStore.getDraftById(id) ?? "";
        const messages = dialogsStore.getMessagesById(id);

        return (
            <Fragment>
                <div id="dialog-container" className="container">
                    <div id="inner-dialog-container" className="row">
                        <Card className="main-column">
                            <CardHeader
                                avatar={<Avatar className="thumbnail" alt={preview.name} src={preview.pictureSrc}/>}
                                title={<Typography className={this.props.classes.bold}>{preview.name}</Typography>}
                                subheader={subheader}
                                action={!isDirect && (
                                    <IconButton aria-label="members" aria-controls={membersMenuId} aria-haspopup="true" onClick={this.handleMenuClick}>
                                        <MoreVertIcon/>
                                    </IconButton>)}
                            />
                            {!isDirect && (
                                <Menu
                                    id={membersMenuId}
                                    anchorEl={this.state.menuAnchorEl}
                                    keepMounted
                                    open={Boolean(this.state.menuAnchorEl)}
                                    onClose={this.handleMenuClose}
                                >
                                    {dialog.membersIds.map(accountId =>
                                        <AccountDropdownItem key={"member_" + accountId} account={accountsStore.getAccountById(accountId)}  onClick={this.isCurrentAccount(accountId) ? this.leaveDialog : this.handleMenuClose} specialClassName={this.getSelectedClassName(accountId)}/>)
                                    }
                                    <Divider />
                                    <AccountInvitationItem dialogId={dialog.id} key="invite_member"/>
                                </Menu>
                            )}
                            <CardContent id="messages-container">
                                {messages.map(msg => (
                                    <MessageItem key={"msg_" + msg.id} message={msg} isDirect={isDirect} isLeftAligned={!this.isCurrentAccount(msg.authorId)}/>
                                ))}
                            </CardContent>
                            <CardActions disableSpacing>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput multiline rows={1} rowsMax={4} placeholder="Write message..."
                                                   value={draft}
                                                   onChange={this.handleTextChange}
                                                   startAdornment={(
                                                       <InputAdornment position="start">
                                                           <IconButton
                                                               aria-label="Attach file"
                                                           >
                                                               <AttachFileIcon/>
                                                           </IconButton>
                                                       </InputAdornment>)}
                                                   endAdornment={(
                                                       <InputAdornment position="end">
                                                           <IconButton
                                                               aria-label="Send message"
                                                               onClick={this.sendMessage}
                                                           >
                                                               <SendIcon/>
                                                           </IconButton>
                                                       </InputAdornment>)}
                                    />
                                </FormControl>
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </Fragment>);
    }
}

export default withStyles(styles, { withTheme: true })(Chat);
