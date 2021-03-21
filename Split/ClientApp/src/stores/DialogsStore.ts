import Dialog from '../data/Dialog';
import Message from '../data/Message';
import AccountsStore from './AccountsStore';
import RootStore from "./RootStore";
import { action, computed, makeObservable, observable, ObservableMap } from "mobx";

export default class DialogsStore {
    @observable private readonly dialogs: ObservableMap<number, Dialog>;
    public readonly unknownDialog: Dialog;
    private readonly accountsStore: AccountsStore;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        this.unknownDialog = new Dialog(-1, [], [], "Unknown dialog");
        this.accountsStore = rootStore.accountsStore;
        const dialogs = [ // temporary
            new Dialog(1,
            [this.accountsStore.getAccountById(1), this.accountsStore.getAccountById(4)],
            [
                new Message(1, 'Some text.', 1, new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)),
                new Message(2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 4, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7))
            ]),
            new Dialog(2,
            [this.accountsStore.getAccountById(1), this.accountsStore.getAccountById(5)],
            [
                new Message(1, 'Hi!', 1, new Date(Date.now() - 1000 * 60 * 60 * 24)),
                new Message(2, 'Hello!', 5, new Date(Date.now() - 1000 * 60 * 60))
            ]),
            new Dialog(3,
                [this.accountsStore.getAccountById(1), this.accountsStore.getAccountById(2),
                    this.accountsStore.getAccountById(3), this.accountsStore.getAccountById(4), this.accountsStore.getAccountById(5)],
                [
                    new Message(1, 'Good day!', 1, new Date(Date.now() - 1000 * 60 * 10)),
                    new Message(2, 'Hi!', 2, new Date(Date.now() - 1000 * 60 * 9)),
                    new Message(3, 'Hello there!', 3, new Date(Date.now() - 1000 * 60 * 8)),
                    new Message(4, 'Hello!', 4, new Date(Date.now() - 1000 * 60 * 7)),
                    new Message(5, 'Greetings!', 5, new Date(Date.now() - 1000 * 60 * 6))
                ],
                'General chat',
                'https://i.imgur.com/tGUXjPO.jpeg')
        ];
        this.dialogs = observable.map();
        dialogs.forEach(dialog => this.dialogs.set(dialog.id, dialog));
    }

    @action sendMessageFromDraft(dialogId: number): void {
        const dialog = this.dialogs.get(dialogId) ?? this.unknownDialog;
        const text = dialog.draftText;
        if (text === null || text === undefined || text.trim() === '') { return; }
        const messages = dialog.messages;
        const nextMessageId = messages[messages.length - 1].id + 1;
        const selectedId = this.accountsStore.selectedAccount.id;
        const accounts = this.accountsStore.userAccounts;
        const accountId = selectedId !== 0 && dialog.interlocutors.find(acc => acc.id === selectedId) ? selectedId :
            dialog.interlocutors.find(acc => accounts.find(a => a.id === acc.id))?.id ?? 0;
        dialog.messages.push(new Message(nextMessageId, text, accountId));
        dialog.lastReadMessageId = nextMessageId;
        dialog.draftText = "";
    }

    @action markDialogAsRead(id: number): void {
        const dialog = this.getDialogById(id);
        dialog.lastReadMessageId = dialog.messages[dialog.messages.length - 1].id;
    }

    @action updateDialogDraft(id: number, text: string): void {
        const dialog = this.getDialogById(id);
        dialog.draftText = text ?? "";
    }

    getDialogById(id: number): Dialog {
        return this.dialogs.get(id) ?? this.unknownDialog;
    }

    @computed get allDialogs(): Dialog[] {
        return Array.from(this.dialogs.values());
    }
}
