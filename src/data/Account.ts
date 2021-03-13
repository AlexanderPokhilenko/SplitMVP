export default class Account {
  constructor(
    public id: number,
    public username: string,
    public imageUrl: string = "/icon.png"
  ) {}
}

export const multiAccount = new Account(0, "Multi-account", "/icon.png");
