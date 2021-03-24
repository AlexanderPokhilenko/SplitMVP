import { Component } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    withStyles
} from '@material-ui/core';
import Message from "../../data/Message";
import {inject, observer} from "mobx-react";
import AccountsStore from "../../stores/AccountsStore";
import {createStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";


const styles = (theme: Theme) =>
    createStyles({
        text: {
            whiteSpace: 'pre-wrap'
        },
        inline: {
            display: 'inline'
        },
        bold: {
            fontWeight: 'bold'
        },
        left: {
            alignSelf: "flex-start"
        },
        right: {
            alignSelf: "flex-end"
        }
    });

type StoreProps = {
    AccountsStore: AccountsStore;
};

interface Props extends StoreProps {
    message: Message;
    isDirect: boolean;
    isLeftAligned: boolean;
    classes: any;
}

@inject("AccountsStore")
@observer
class MessageItem extends Component<Props> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }

    render() {
        const accountsStore = this.props.AccountsStore;
        const message = this.props.message;
        const isDirect = this.props.isDirect;
        const isLeft = this.props.isLeftAligned;
        const author = accountsStore.getAccountById(message.authorId);

        return (
            <Card id={"msg" + message.id} className={clsx("message", isLeft ? this.props.classes.left : this.props.classes.right)}>
                {!isDirect && (
                    <CardHeader className="message-header"
                        avatar={<Avatar className="small-thumbnail" alt={author.username} src={author.imageUrl}/>}
                        title={<Typography className={this.props.classes.bold}>{author.username}</Typography>}
                    />
                )}
                <CardContent className="message-content">
                    <Typography component="span" className={clsx(this.props.classes.inline, this.props.classes.text, "text-break")}>
                        {message.text}
                    </Typography>
                    <Typography component="span" className={clsx(this.props.classes.inline, "message-date-time")} color="textSecondary">
                        {Message.getDateTimeStr(message.date)}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MessageItem);
