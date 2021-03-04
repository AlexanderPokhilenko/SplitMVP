import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Chat from "./parts/Chat";

interface RouteProps {
    id?: string;
}

export default class Dialogs extends Component<RouteComponentProps<RouteProps>> {

    constructor(props: RouteComponentProps<RouteProps>) {
        super(props);
        this.state = { ...this.state };
    }

    render() {
        const id = this.props.match.params.id;
        return (id === undefined
                ? <h1 className="text-center">Choose dialog to start</h1>
                : <Chat dialogId={+id}/>
                );
    }
}
