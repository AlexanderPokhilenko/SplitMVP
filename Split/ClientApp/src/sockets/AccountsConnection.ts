import AbstractConnection from "./AbstractConnection";
import RootStore from "../stores/RootStore";
import Account from "../data/Account";

export default class AccountsConnection extends AbstractConnection {
    constructor(private readonly rootStore: RootStore) {
        super("/hubs/accounts");

        this.connection.on("accountCreated", this.onAccountCreated);
        this.connection.on("userAccountsRequested", this.onUserAccountsRequested);
        this.connection.on("otherAccountsRequested", this.onOtherAccountsRequested);
    }

    async requestOtherAccounts(ids: number[]): Promise<void> {
        return this.connection.send("requestAccounts", ids);
    }

    async createAccount(username: string, imageUrl: string): Promise<void> {
        return this.connection.send("createAccount", username, imageUrl);
    }

    private onUserAccountsRequested = (accounts: Account[]): void => {
        this.rootStore.accountsStore.addAccounts(accounts);
    }

    private onOtherAccountsRequested = (accounts: Account[]): void => {
        this.rootStore.accountsStore.addOtherAccounts(accounts);
    }

    private onAccountCreated = (account: Account): void => {
        this.rootStore.accountsStore.addAccount(account);
    };
}
