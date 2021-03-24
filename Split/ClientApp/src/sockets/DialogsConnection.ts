import AbstractConnection from "./AbstractConnection";
import RootStore from "../stores/RootStore";
import DialogsStore from "../stores/DialogsStore";
import Message from "../data/Message";
import Dialog from "../data/Dialog";

export default class DialogsConnection extends AbstractConnection {
    private readonly dialogsStore: DialogsStore;

    constructor(rootStore: RootStore) {
        super("/hubs/dialogs");
        this.dialogsStore = rootStore.dialogsStore;

        this.connection.on("messageReceived", this.onMessageReceived);
        this.connection.on("invited", this.onInvited);
        this.connection.on("dialogUpdated", this.onDialogUpdated);
        this.connection.on("messagesRequested", this.onMessagesRequested);
        this.connection.on("dialogsRequested", this.onDialogsRequested);
        this.connection.on("newestMessagesRequested", this.onNewestMessagesRequested);
        this.connection.on("messageRead", this.onMessageRead);
    }

    private async subscribeToDialog(dialogId: number): Promise<void> {
        return this.connection.send("subscribeToDialog", dialogId);
    }

    async createDirectChat(currentAccountId: number, interlocutorAccountId: number): Promise<void> {
        return this.connection.send("createDirectChat", currentAccountId, interlocutorAccountId);
    }

    async createGroupChat(accountId: number, name: string, imageUrl: string): Promise<void> {
        return this.connection.send("createGroupChat", accountId, name, imageUrl);
    }

    async inviteToChat(accountId: number, dialogId: number): Promise<void> {
        return this.connection.send("inviteToChat", accountId, dialogId);
    }

    async leaveChat(accountId: number, dialogId: number): Promise<void> {
        return this.connection.send("leaveChat", accountId, dialogId);
    }

    async requestMessages(dialogId: number/*, fromId: number, toId: number*/): Promise<void> {
        return this.connection.send("requestMessages", dialogId/*, fromId, toId*/);
    }

    async sendMessage(accountId: number, dialogId: number, text: string): Promise<void> {
        return this.connection.send("sendMessage", accountId, dialogId, text);
    }

    async readMessage(accountId: number, dialogId: number, messageId: number): Promise<void> {
        return this.connection.send("readMessage", accountId, dialogId, messageId);
    }

    private onMessageReceived = (dialogId: number, message: Message): void => {
        this.dialogsStore.addMessage(dialogId, message);
    };

    private onInvited = (dialogId: number): void => {
        this.subscribeToDialog(dialogId);
    };

    private onDialogUpdated = (dialog: Dialog): void => {
        this.dialogsStore.updateDialog(dialog);
    };

    private onMessagesRequested = (dialogId: number, messages: Message[]): void => {
        this.dialogsStore.addMessages(dialogId, messages);
    };

    private onDialogsRequested = (dialogs: Dialog[]): void => {
        this.dialogsStore.updateDialogs(dialogs);
    };

    private onNewestMessagesRequested = (messages: {[id: number]: Message}): void => {
        this.dialogsStore.addNewestMessages(messages);
    }

    private onMessageRead = (dialogId: number, messageId: number): void => {
        this.dialogsStore.readMessage(dialogId, messageId);
    };
}
