import { Message } from './message';
import { Account } from './account';

export class Dialog {
  constructor(public id: number,
              public interlocutors: Account[],
              public messages: Message[],
              public name?: string,
              public pictureSrc?: string,
              public lastReadMessageId: number = 0) {
    if (lastReadMessageId < 0) { this.lastReadMessageId = messages[messages.length - 1].id; }
  }
  public get isDirect(): boolean {
    return this.interlocutors.length <= 2;
  }
}
