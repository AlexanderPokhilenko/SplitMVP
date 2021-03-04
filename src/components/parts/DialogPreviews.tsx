import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { List } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import DialogPreviewItem from "./DialogPreviewItem";
import DialogsPreviewsStore from "../../stores/DialogsPreviewsStore";

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
    DialogsPreviewsStore: DialogsPreviewsStore;
};

interface Props extends StoreProps {
    classes: any;
}

interface State {

}

@inject("DialogsPreviewsStore")
@observer
class DialogPreviews extends Component<Props, State> {
    static defaultProps = {} as StoreProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }

    render() {
        const previewsStore = this.props.DialogsPreviewsStore;
        const previews = previewsStore.previews;
        const keyPrefix = "dialog_preview_";

        return (
            <List>
                {previews.map(preview => (
                    <DialogPreviewItem key={keyPrefix + preview.id} preview={preview}/>
                ))}
            </List>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DialogPreviews);
