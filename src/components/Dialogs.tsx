import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

interface IdProps {
    id?: string
}

export default class Dialogs extends Component<RouteComponentProps<IdProps>> {
    render() {
        const id = this.props.match.params.id;
        return <h1>Dialogs component works! Id: {id}</h1>;
    }
}
