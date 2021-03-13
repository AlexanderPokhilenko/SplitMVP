import Account from "./Account";

export default class DialogPreview {
  constructor(
    public id: number,
    public name: string,
    public pictureSrc: string,
    public dateTimeStr: string,
    public text: string,
    public lastAuthor: Account,
    public unreadMessagesCount: number,
    public isDraft: boolean = false
  ) {}
  public isCurrentAccount(accountId: number): boolean {
    return this.lastAuthor.id === accountId;
  }
  public get shortUsername(): string {
    const username = this.lastAuthor.username;
    const indexOfSpace = username.indexOf(" ");
    return indexOfSpace > 0 ? username.substr(0, indexOfSpace) : username;
  }
}
