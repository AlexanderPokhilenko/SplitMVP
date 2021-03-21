import { Component, Fragment } from "react";
import {
    Avatar,
    ListItem,
    Typography,
    ListItemText,
    createStyles,
    Theme,
    withStyles,
    Box,
    Badge
} from "@material-ui/core";
import DialogPreview from "../../data/DialogPreview";
import {NavLink} from "react-router-dom";
import clsx from 'clsx';

const styles = (theme: Theme) =>
    createStyles({
        inline: {
            display: 'inline'
        },
        flexFill: {
            flex: '1 1 auto!important',
            minWidth: 0
        },
        bold: {
            fontWeight: 'bold'
        },
        right: {
            float: 'right'
        },
        unsetOverflow: {
            overflow: 'unset'
        }
    });


interface Props {
    preview: DialogPreview;
    classes: any;
}

interface State {
    //anchorEl: HTMLElement | null;
}

class DialogPreviewItem extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }

    render() {
        const preview = this.props.preview;
        const header = (
            <Box display="flex">
                <Typography
                    component="span"
                    variant="subtitle1"
                    className={clsx(this.props.classes.inline, this.props.classes.bold, this.props.classes.flexFill)}
                    color="textPrimary"
                >
                    {preview.name}
                </Typography>
                <Typography
                    component="span"
                    variant="body1"
                    className={clsx(this.props.classes.inline, this.props.classes.right, this.props.classes.unsetOverflow)}
                    color="textSecondary"
                >
                    {preview.dateTimeStr}
                </Typography>
            </Box>);

        const content = (
            <Fragment>
                <Typography
                    component="span"
                    variant="body2"
                    className={this.props.classes.inline}
                    color="textPrimary"
                >
                    {preview.isDraft ? "Draft" : preview.shortUsername}:
                </Typography>
                {preview.text}
            </Fragment>);

        return (
            <ListItem alignItems="flex-start" button component={NavLink} to={"/dialogs/" + preview.id} exact activeClassName="Mui-selected">
                <Avatar className="thumbnail " alt={preview.name} src={preview.pictureSrc} />
                <Badge className={this.props.classes.flexFill} badgeContent={preview.unreadMessagesCount} color="secondary" overlap="circle" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <ListItemText className="text-cut" primary={header} secondary={content}/>
                </Badge>
            </ListItem>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DialogPreviewItem);
