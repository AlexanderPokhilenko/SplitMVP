import Message from "./Message";
import Account from "./Account";

export default class Dialog {
  constructor(
    public id: number,
    public interlocutors: Account[],
    public messages: Message[],
    public name?: string,
    public pictureSrc?: string,
    public lastReadMessageId: number = 0,
    public draftText: string | null = null
  ) {
    if (lastReadMessageId < 0) {
      this.lastReadMessageId = messages[messages.length - 1].id;
    }
  }
  public get isDirect(): boolean {
    return this.interlocutors.length <= 2;
  }
}