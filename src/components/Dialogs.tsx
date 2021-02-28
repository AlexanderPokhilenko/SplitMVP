import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import {inject, observer} from "mobx-react";
import DialogsStore from "../stores/DialogsStore";

type StoreProps = {
    DialogsStore: DialogsStore;
};

interface RouteProps {
    id?: string;
}

interface Props extends StoreProps {
}

type CurrentProps = RouteComponentProps<RouteProps> & Props;

@inject("DialogsStore")
@observer
export default class Dialogs extends Component<CurrentProps> {
    static defaultProps = {} as StoreProps;

    constructor(props: CurrentProps) {
        super(props);
        this.state = { ...this.state };
    }

    render() {
        const id = this.props.match.params.id;
        return (<h1>Dialogs component works! Id: {id}</h1>);
    }
}
