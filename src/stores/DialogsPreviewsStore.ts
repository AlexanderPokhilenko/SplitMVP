import DialogsStore from './DialogsStore';
import DialogPreview from '../data/DialogPreview';
import AccountsStore from './AccountsStore';
import RootStore from "./RootStore";
import Dialog from '../data/Dialog';
import Account from "../data/Account";
import { computed, makeObservable } from "mobx";

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

    @computed public get previews(): DialogPreview[] {
        const previews = [];
        const dialogs = this.dialogsStore.allDialogs
            .sort((d1, d2) =>
                (d2.lastMessageDateTime?.getTime() ?? 0) - (d1.lastMessageDateTime?.getTime() ?? 0));
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
        const lastMessage = dialog.messages[dialog.messages.length - 1];
        const lastAuthor = this.accountsStore.getAccountById(lastMessage.authorId);
        const dateTimeStr = lastMessage.dateTimeStr;
        const currentAccounts = this.accountsStore.userAccounts;
        const otherInterlocutor = dialog.interlocutors.find(acc => !currentAccounts.find(a => a.id === acc.id)) ?? this.unknownInterlocutor;
        const name = dialog.isDirect ? otherInterlocutor.username : dialog.name!;
        const picture = dialog.isDirect ? otherInterlocutor.imageUrl : dialog.pictureSrc!;
        const isDraft = !DialogsPreviewsStore.isNullOrWhitespace(dialog.draftText);
        const text = isDraft ? dialog.draftText! : lastMessage.text;
        return new DialogPreview(dialog.id, name, picture, dateTimeStr, text,
            lastAuthor, lastMessage.id - dialog.lastReadMessageId, isDraft);
    }
}
