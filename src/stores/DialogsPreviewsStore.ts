import DialogsStore from './DialogsStore';
import DialogPreview from '../data/DialogPreview';
import AccountsStore from './AccountsStore';
import RootStore from "./RootStore";
import Dialog from '../data/Dialog';
import Account from "../data/Account";
import { computed } from "mobx";

export default class DialogsPreviewsStore {
    private readonly unknownInterlocutor: Account;
    private readonly accountsStore: AccountsStore;
    private readonly dialogsStore: DialogsStore;
    private readonly dateFormatter: Intl.DateTimeFormat;
    private readonly timeFormatter: Intl.DateTimeFormat;

    constructor(private readonly rootStore: RootStore) {
        this.unknownInterlocutor = new Account(-2, "Unknown Interlocutor");
        this.accountsStore = rootStore.accountsStore;
        this.dialogsStore = rootStore.dialogsStore;
        this.dateFormatter = new Intl.DateTimeFormat('default', {dateStyle: "short"});
        this.timeFormatter = new Intl.DateTimeFormat('default', {timeStyle: "short"});
    }

    private static isNullOrWhitespace(str: string | null): boolean {
        return str === null || str.match(/^ *$/) !== null;
    }

    @computed public getPreviews(): DialogPreview[] {
        const previews = [];
        const dialogs = [...this.dialogsStore.getDialogs()]
            .sort((d1, d2) =>
                (d2.lastMessageDateTime?.getTime() ?? 0) - (d1.lastMessageDateTime?.getTime() ?? 0));
        for (const dialog of dialogs) {
            const preview = this.getPreviewFromDialog(dialog);
            previews.push(preview);
        }

        return previews;
    }

    @computed public getPreviewFromDialog(dialog: Dialog): DialogPreview {
        const lastMessage = dialog.messages[dialog.messages.length - 1];
        const lastAuthor = this.accountsStore.getAccountById(lastMessage.authorId);
        const dateTimeStr = this.getDateTimeStr(lastMessage.dateTime);
        const currentAccounts = this.accountsStore.getAccounts();
        const otherInterlocutor = dialog.interlocutors.find(acc => !currentAccounts.find(a => a.id === acc.id)) ?? this.unknownInterlocutor;
        const name = dialog.isDirect ? otherInterlocutor.username : dialog.name!;
        const picture = dialog.isDirect ? otherInterlocutor.imageUrl : dialog.pictureSrc!;
        const isDraft = !DialogsPreviewsStore.isNullOrWhitespace(dialog.draftText);
        const text = isDraft ? dialog.draftText! : lastMessage.text;
        return new DialogPreview(dialog.id, name, picture, dateTimeStr, text,
            lastAuthor, lastMessage.id - dialog.lastReadMessageId, isDraft);
    }

    private getDateTimeStr(dateTime: Date): string {
        const oneDayMs = 60 * 60 * 24 * 1000;
        const dayAgo = Date.now() - oneDayMs;
        const isOld = dayAgo >= dateTime.getTime();
        return isOld ? this.dateFormatter.format(dateTime) : this.timeFormatter.format(dateTime);
    }
}
