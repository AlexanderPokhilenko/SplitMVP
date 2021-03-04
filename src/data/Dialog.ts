import Message from './Message';
import Account from './Account';

export default class Dialog {
    constructor(public id: number,
                public interlocutors: Account[],
                public messages: Message[],
                public name?: string,
                public pictureSrc?: string,
                public lastReadMessageId: number = 0,
                public draftText: string | null = null) {
        if (lastReadMessageId < 0) { this.lastReadMessageId = messages[messages.length - 1].id; }
    }
    public get isDirect(): boolean {
        return this.interlocutors.length <= 2 && this.name === undefined && this.pictureSrc === undefined;
    }

    public get lastMessageDateTime(): Date | null {
        const messagesCount = this.messages.length;
        if(messagesCount === 0) {
            return null;
        }
        else {
            return this.messages[messagesCount - 1].dateTime;
        }
    }
}

