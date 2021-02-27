import {action, computed, observable, ObservableMap, IObservableArray, get, set} from 'mobx';
import Account from "../data/Account";

export default class AccountsStore {
    readonly multiAccount: Account;
    private readonly unknownAccount: Account;
    @observable private selected: Account;
    @observable private readonly accounts: IObservableArray<Account>;
    @observable private allAccounts: ObservableMap<number, Account>;
    constructor() {
        this.multiAccount = new Account(0, 'Multi-account', '/images/icon.png');
        this.unknownAccount = new Account(-1, 'Unknown Account', '/images/icon.png');
        this.selected = this.multiAccount;
        this.accounts = observable([ // temporary
            new Account(1, 'First Username', 'https://i.imgur.com/sicII7N.jpg'),
            new Account(2, 'Second Username', 'https://i.imgur.com/3tgjufY.jpg'),
            new Account(3, 'Third Username', 'https://i.imgur.com/WfdkN3o.jpg')
        ]);
        this.allAccounts = observable.map(this.accounts.reduce((dict, acc) => ({...dict, [acc.id]: acc}), {})); // temporary
        this.addAccountToAll(new Account(4, 'Interlocutor 1', 'https://i.imgur.com/CFpa3nK.jpg'));
        this.addAccountToAll(new Account(5, 'Interlocutor 2', 'https://i.imgur.com/fgrfeVu.jpg'));
    }
    @action private addAccountToAll(account: Account): void {
        set(this.allAccounts, account.id, account);
    }
    @computed getAccountById(id: number): Account {
        return get(this.allAccounts, id) ?? this.unknownAccount;
    }
    @computed getAccounts(): Account[] {
        return this.accounts;
    }
    @action addAccount(username: string, imageUrl: string): void {
        this.accounts.push(new Account(this.accounts[this.accounts.length - 1].id, username, imageUrl));
    }
    @computed getSelected(): Account {
        return this.selected;
    }
    @action selectAccount(id: number): void {
        this.selected = this.accounts.find(account => account.id === id) ?? this.multiAccount;
    }
}
