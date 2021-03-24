import {ChangeEvent, Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {inject, observer} from "mobx-react";
import AccountsStore from '../../stores/AccountsStore';
import Account from "../../data/Account";
import {Avatar} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";

type StoreProps = {
    AccountsStore: AccountsStore;
};

interface DefaultProps extends StoreProps {
    useOnlyUserAccounts: boolean;
}

interface Props extends DefaultProps {
    label: string;
    action?: (newAccount: Account | null) => void;
}
interface State {
    open: boolean;
}

@inject("AccountsStore")
@observer
export default class AccountsSearcher extends Component<Props, State> {
    static defaultProps = {useOnlyUserAccounts: false} as DefaultProps;

    constructor(props: Props) {
        super(props);
        this.state = { ...this.state, open: false };
    }

    handleChange = (event: ChangeEvent<{}>, newValue: Account | null) => {
        this.props.action?.(newValue);
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({open: false});
    }

    render() {
        const open = this.state.open;
        const {label, AccountsStore: accountsStore, useOnlyUserAccounts} = this.props;
        const accounts = useOnlyUserAccounts ? accountsStore.userAccounts : accountsStore.allKnownAccounts;

        return (
            <Autocomplete options={accounts} getOptionLabel={account => account.username}
                          onChange={this.handleChange}
                          open={open} onOpen={this.handleOpen} onClose={this.handleClose}
                          renderInput={params => (
                              <TextField {...params} label={label} variant="outlined" />
                          )}
                          renderOption={account => (
                              <Fragment>
                                  <Avatar className="small-thumbnail " alt={account.username} src={account.imageUrl} />
                                  <ListItemText primary={account.username} />
                              </Fragment>
                          )}
            />
        );
    }
}
