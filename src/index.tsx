import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react";
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Sidebar from "./components/parts/Sidebar";
import News from "./components/News";
import Dialogs from "./components/Dialogs";
import Comments from "./components/Comments";
import Sign from "./components/Sign";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import RootStore from "./stores/RootStore";

const rootStore = new RootStore();

const stores = {
    RootStore: rootStore,
    AccountsStore: rootStore.accountsStore,
    DialogsStore: rootStore.dialogsStore,
    DialogsPreviewsStore: rootStore.dialogsPreviewsStore
};

ReactDOM.render(
    <Provider {...stores}>
        <BrowserRouter>
            <Sidebar>
                <Switch>
                    <Route exact path="/" component={News} />
                    <Route path="/dialogs/:id(\d+)?" component={Dialogs} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/comments" component={Comments} />
                    <Route path="/sign" component={Sign} />
                    <Route component={NotFound} />
                </Switch>
            </Sidebar>
        </BrowserRouter>
    </Provider>
    ,
  document.getElementById('root')
);

reportWebVitals();
