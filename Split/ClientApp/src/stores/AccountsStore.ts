import { action, computed, observable, ObservableMap, IObservableArray, get, set, makeObservable } from 'mobx';
import Account from "../data/Account";
import RootStore from "./RootStore";

export default class AccountsStore {
    readonly multiAccount: Account;
    private readonly unknownAccount: Account;
    @observable private _isAuthorized = false;
    @observable private accountsWereRequested: boolean;
    @observable private selected: Account;
    @observable private readonly accounts: IObservableArray<Account>;
    @observable private readonly allAccounts: ObservableMap<number, Account>;

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        rootStore.authorizeService.isAuthenticated().then(a => this.authorize(Boolean(a)));
        rootStore.authorizeService.subscribe(() => this.authorize(rootStore.authorizeService._isAuthenticated));
        this.accountsWereRequested = false;
        this.multiAccount = new Account(0, 'Multi-account');
        this.unknownAccount = new Account(-1, 'Unknown Account');
        this.selected = this.multiAccount;
        this.accounts = observable.array();
        this.allAccounts = observable.map();
        this.accounts.forEach(account => this.allAccounts.set(account.id, account));
    }

    @action async signOut(url: string): Promise<void> {
        await this.rootStore.authorizeService.signOut({returnUrl: url});
    }

    @action private authorize(auth: boolean): void {
        this._isAuthorized = auth;
    }

    @computed get hasNoAccounts(): boolean {
        return this.accountsWereRequested && this.accounts.length === 0;
    }

    @computed get isAuthorized(): boolean {
        return this._isAuthorized;
    }

    @action private addAccountToAll(account: Account): void {
        set(this.allAccounts, account.id, account);
    }

    getAccountById(id: number): Account {
        return get(this.allAccounts, id) ?? this.unknownAccount;
    }

    @computed get allKnownAccounts(): Account[] {
        return Array.from(this.allAccounts.values());
    }

    @computed get userAccounts(): Account[] {
        return this.accounts;
    }

    @action async createAccount(username: string, imageUrl: string): Promise<void> {
        return this.rootStore.accountsConnection.createAccount(username, imageUrl);
    }

    @action addAccounts(accounts: Account[]): void {
        accounts.map(account => this.addAccount(account));
        this.accountsWereRequested = true;
    }

    @action addOtherAccounts(accounts: Account[]): void {
        accounts.map(account => this.addAccountToAll(account));
    }

    @action addAccount(account: Account): void {
        const foundAccount = this.accounts.find(a => a.id === account.id);
        if(foundAccount) {
            this.accounts.spliceWithArray(this.accounts.indexOf(foundAccount), 1, [foundAccount]);
        }
        else {
            this.accounts.push(account);
        }
        this.addAccountToAll(account);
    }

    @computed get selectedAccount(): Account {
        return this.selected;
    }

    @action selectAccount(id: number): void {
        this.selected = this.accounts.find(account => account.id === id) ?? this.multiAccount;
    }
}
