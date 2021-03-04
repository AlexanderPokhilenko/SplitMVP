import { Component } from "react";
import { Avatar, MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Account from "../../data/Account";

interface Props {
    account: Account;
    specialClassName?: string;
    onClick: (id: number) => void;
}

export default class AccountDropdownItem extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = { ...this.state };
    }

    handleClick = () => {
        this.props.onClick(this.props.account.id);
    }

    render() {
        const account = this.props.account;
        return (
            <MenuItem onClick={this.handleClick} className={this.props.specialClassName}>
                <Avatar className="small-thumbnail " alt={account.username} src={account.imageUrl} />
                <ListItemText primary={account.username} />
            </MenuItem>
        );
    }
}
