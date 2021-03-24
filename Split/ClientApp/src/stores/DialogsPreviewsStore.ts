import DialogsStore from './DialogsStore';
import DialogPreview from '../data/DialogPreview';
import AccountsStore from './AccountsStore';
import RootStore from "./RootStore";
import Dialog from '../data/Dialog';
import Account from "../data/Account";
import { computed, makeObservable } from "mobx";
import Message from '../data/Message';

export default class DialogsPreviewsStore {
    private readonly unknownInterlocutor: Account;
    private readonly accountsStore: AccountsStore;
    private readonly dialogsStore: DialogsStore;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        this.unknownInterlocutor = new Account(-2, "Unknown Interlocutor");
        this.accountsStore = rootStore.accountsStore;
        this.dialogsStore = rootStore.dialogsStore;
    }

    private static isNullOrWhitespace(str: string | null): boolean {
        return str === undefined || str === null || str.match(/^ *$/) !== null;
    }

    private getLastMessageDateTime(dialogId: number) : Date {
        const messages = this.dialogsStore.getMessagesById(dialogId);
        const messagesCount = messages.length;
        if(messagesCount > 0) {
            const lastMessage = messages[messagesCount - 1];
            const date = lastMessage.date;
            return date instanceof Date ? date : new Date(date);
        }
        else {
            return new Date(0);
        }
    }

    @computed get isAuthorized(): boolean {
        return this.accountsStore.isAuthorized;
    }

    @computed public get previews(): DialogPreview[] {
        const previews = [];
        const dialogs = this.dialogsStore.allDialogs
            .sort((d1, d2) =>
                this.getLastMessageDateTime(d2.id).getTime() - this.getLastMessageDateTime(d1.id).getTime());
        for (const dialog of dialogs) {
            const preview = this.getPreviewFromDialog(dialog);
            previews.push(preview);
        }

        return previews;
    }

    @computed public get totalUnreadMessages(): number {
        return this.previews.reduce((total, preview) => total + preview.unreadMessagesCount, 0);
    }

    public getPreviewFromDialog(dialog: Dialog): DialogPreview {
        const messages = this.dialogsStore.getMessagesById(dialog.id);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : new Message(0, "No messages yet...", -1);
        const lastAuthor = this.accountsStore.getAccountById(lastMessage.authorId);
        const dateTimeStr = Message.getDateTimeStr(lastMessage.date);
        const currentAccounts = this.accountsStore.userAccounts;
        const otherId = dialog.membersIds.find(id => !currentAccounts.find(a => a.id === id)) ?? -2;
        const otherInterlocutor = this.accountsStore.getAccountById(otherId) ?? this.unknownInterlocutor;
        const name = Dialog.checkIsDirect(dialog) ? otherInterlocutor.username : dialog.name!;
        const picture = Dialog.checkIsDirect(dialog) ? otherInterlocutor.imageUrl : dialog.imageUrl!;
        const draftText = this.dialogsStore.getDraftById(dialog.id);
        const isDraft = !DialogsPreviewsStore.isNullOrWhitespace(draftText);
        const text = isDraft ? draftText! : lastMessage.text;
        const unreadCount = messages.indexOf(lastMessage) - messages.indexOf(messages.find(m => m.id === dialog.lastReadMessageId) ?? lastMessage);
        return new DialogPreview(dialog.id, name, picture, dateTimeStr, text,
            lastAuthor, unreadCount, isDraft);
    }
}
