import Dialog from '../data/Dialog';
import Message from '../data/Message';
import AccountsStore from './AccountsStore';
import RootStore from "./RootStore";
import {action, computed, makeObservable, observable, ObservableMap} from "mobx";
import DialogsConnection from "../sockets/DialogsConnection";

export default class DialogsStore {
    @observable private readonly dialogs: ObservableMap<number, Dialog>;
    @observable private readonly drafts: ObservableMap<number, string>;
    @observable private readonly messages: ObservableMap<number, ObservableMap<number, Message>>;
    public readonly unknownDialog: Dialog;
    private readonly accountsStore: AccountsStore;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        this.accountsStore = rootStore.accountsStore;
        this.unknownDialog = new Dialog(-1, "Unknown dialog", this.accountsStore.multiAccount.imageUrl, [], 0);
        this.dialogs = observable.map();
        this.drafts = observable.map();
        this.messages = observable.map();
    }

    public get dialogsConnection() : DialogsConnection {
        return this.rootStore.dialogsConnection;
    }

    private getSelectedAccountIdFromDialog(dialog: Dialog) {
        const selectedId = this.accountsStore.selectedAccount.id;
        const accounts = this.accountsStore.userAccounts;
        return selectedId !== 0 && dialog.membersIds.find(id => id === selectedId) ? selectedId :
            dialog.membersIds.find(id => accounts.find(a => a.id === id)) ?? 0;
    }

    @action sendMessageFromDraft(dialogId: number): void {
        const dialog = this.dialogs.get(dialogId) ?? this.unknownDialog;
        const text = this.drafts.get(dialogId);
        if (text === null || text === undefined || text.trim() === '') { return; }
        const accountId = this.getSelectedAccountIdFromDialog(dialog);
        this.dialogsConnection.sendMessage(accountId, dialogId, text).then(() => this.updateDialogDraft(dialogId, ""));
    }

    @action markDialogAsRead(id: number): void {
        const dialog = this.getDialogById(id);
        const messages = this.messages.get(id) ?? observable.set();
        const lastMessageId = messages.size > 0 ? Array.from(messages).reduce((max, msg) => Math.max(max, msg.id), 0) : 0;
        const accountId = this.getSelectedAccountIdFromDialog(dialog);
        this.dialogsConnection.readMessage(accountId, id, lastMessageId);
    }

    @action updateDialogDraft(id: number, text: string): void {
        this.drafts.set(id, text);
    }

    @action addNewestMessages(messages: {[id: number]: Message}): void {
        for (const [dialogIdStr, message] of Object.entries(messages)) {
            const dialogId = Number(dialogIdStr);
            const currentMessages = this.messages.get(dialogId);
            if(currentMessages) {
                currentMessages.set(message.id, message);
            }
            else {
                const newMessages = observable.map();
                newMessages.set(message.id, message);
                this.messages.set(dialogId, newMessages);
            }
        }
    }

    @action addMessage(dialogId: number, message: Message): void {
        const messages = this.messages.get(dialogId);
        if(messages) {
            messages.set(message.id, message);
        }
        else {
            const newMessages = observable.map();
            newMessages.set(message.id, message);
            this.messages.set(dialogId, newMessages);
        }
    }

    @action addMessages(dialogId: number, messages: Message[]): void {
        const currentMessages = this.messages.get(dialogId);
        if(currentMessages) {
            messages.forEach(message => currentMessages.set(message.id, message));
        }
        else {
            const newMessages = observable.map();
            messages.forEach(message => newMessages.set(message.id, message));
            this.messages.set(dialogId, newMessages);
        }
    }

    @action updateDialog(dialog: Dialog): void {
        this.dialogs.set(dialog.id, dialog);
    }

    @action updateDialogs(dialogs: Dialog[]): void {
        dialogs.forEach(dialog => this.dialogs.set(dialog.id, dialog));
    }

    @action readMessage(dialogId: number, messageId: number): void {
        const dialog = this.dialogs.get(dialogId);
        if(!dialog) return;
        dialog.lastReadMessageId = messageId;
    }

    getMessagesById(id: number): Message[] {
        if(!this.messages.has(id)) this.dialogsConnection.requestMessages(id);
        return Array.from(this.messages.get(id)?.values() ?? []).sort((m1, m2) => m1.id - m2.id);
    }

    getDraftById(id: number): string {
        return this.drafts.get(id) ?? "";
    }

    getDialogById(id: number): Dialog {
        return this.dialogs.get(id) ?? this.unknownDialog;
    }

    @computed get allDialogs(): Dialog[] {
        return Array.from(this.dialogs.values());
    }
}
