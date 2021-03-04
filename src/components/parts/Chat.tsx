import  '../../css/dialogs.css';
import  '../../css/containers.css';
import {Component, Fragment, MouseEvent, ChangeEvent} from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import { Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Menu,
    FormControl,
    OutlinedInput,
    InputAdornment,
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
import Account from "../../data/Account";
import MessageItem from "./MessageItem";

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
        </Fragment>);
    }

    private getFirstCurrentAccountUsername(dialog: Dialog): string {
        const selectedAccount = this.props.AccountsStore.selectedAccount;
        this.props.DialogsStore.getDialogById(this.props.dialogId);
        if (dialog.interlocutors.find(acc => acc === selectedAccount)) { return selectedAccount.username; }
        return dialog.interlocutors.find(acc => this.isCurrentAccount(acc.id))?.username ?? "";
    }

    private isCurrentAccount(id: number): boolean {
        const accounts = this.props.AccountsStore.userAccounts;
        return accounts.find(a => a.id === id) !== undefined;
    }

    private getSelectedClassName(account: Account): string {
        return this.isCurrentAccount(account.id) ? this.props.classes.selected : "";
    }

    private scrollToLastRead(): void {
        if (this.props.dialogId === undefined) { return; }
        const dialog = this.props.DialogsStore.getDialogById(this.props.dialogId);
        const lastReadMessage = document.getElementById('msg' + dialog.lastReadMessageId);
        if (lastReadMessage === null) { return; }
        lastReadMessage.scrollIntoView();
    }

    componentDidMount() {
        this.props.DialogsStore.markDialogAsRead(this.props.dialogId);
        this.scrollToLastRead();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if(this.props.dialogId !== prevProps.dialogId){
            this.props.DialogsStore.markDialogAsRead(this.props.dialogId);
            this.props.DialogsStore.updateDialogDraft(prevProps.dialogId, prevState.draft);
            const currentDialog = this.props.DialogsStore.getDialogById(this.props.dialogId);
            this.setState({draft: currentDialog?.draftText ?? ""});
        }
        this.scrollToLastRead();
    }

    render() {
        const id = this.props.dialogId;
        const dialogsStore = this.props.DialogsStore;
        const previewsStore = this.props.DialogsPreviewsStore;
        const dialog = dialogsStore.getDialogById(id);

        if(dialog === dialogsStore.unknownDialog) {
            return <Redirect to={"/dialogs"} />;
        }

        const preview = previewsStore.getPreviewFromDialog(dialog);
        const subheader = dialog.isDirect ?
            this.createSubheader("Direct messages to ", this.getFirstCurrentAccountUsername(dialog)) :
            this.createSubheader(dialog.interlocutors.length + " members including ", this.getFirstCurrentAccountUsername(dialog));

        const membersMenuId = "chat_members_menu";

        return (
            <Fragment>
                <div id="dialog-container" className="container">
                    <div id="inner-dialog-container" className="row">
                        <Card className="main-column">
                            <CardHeader
                                avatar={<Avatar className="thumbnail" alt={preview.name} src={preview.pictureSrc}/>}
                                title={<Typography className={this.props.classes.bold}>{preview.name}</Typography>}
                                subheader={subheader}
                                action={!dialog.isDirect && (
                                    <IconButton aria-label="members" aria-controls={membersMenuId} aria-haspopup="true" onClick={this.handleMenuClick}>
                                        <MoreVertIcon/>
                                    </IconButton>)}
                            />
                            {!dialog.isDirect && (
                                <Menu
                                    id={membersMenuId}
                                    anchorEl={this.state.menuAnchorEl}
                                    keepMounted
                                    open={Boolean(this.state.menuAnchorEl)}
                                    onClose={this.handleMenuClose}
                                >
                                    {dialog.interlocutors.map(account =>
                                        <AccountDropdownItem key={"member_" + account.id} account={account}  onClick={this.handleMenuClose} specialClassName={this.getSelectedClassName(account)}/>)}
                                </Menu>
                            )}
                            <CardContent id="messages-container">
                                {dialog.messages.map(msg => (
                                    <MessageItem key={"msg_" + msg.id} message={msg} isDirect={dialog.isDirect} isLeftAligned={this.isCurrentAccount(msg.authorId)}/>
                                ))}
                            </CardContent>
                            <CardActions disableSpacing>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput multiline rows={1} rowsMax={4} placeholder="Write message..."
                                                   value={this.state.draft ?? dialog.draftText ?? ""}
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
