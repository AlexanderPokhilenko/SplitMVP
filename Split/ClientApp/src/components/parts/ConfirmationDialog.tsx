import {Component} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";

interface Props {
    title: string;
    text: string;
    onConfirmed: () => void;
    onAborted: () => void;
    open: boolean;
}

export default class ConfirmationDialog extends Component<Props>  {
    render() {
        const {title, text, open} = this.props;

        return (
            <Dialog open={open} onClose={this.props.onAborted}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{text}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onAborted} color="primary">No</Button>
                    <Button onClick={this.props.onConfirmed} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
