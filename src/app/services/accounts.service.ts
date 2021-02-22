import { Injectable } from '@angular/core';
import { Account } from '../data/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private readonly multiAccount: Account;
  private selected: Account;
  private readonly accounts: Account[];
  private readonly allAccounts: {[id: number]: Account};
  constructor() {
    this.multiAccount = new Account(0, 'Multi-account', '/assets/images/icon.png');
    this.selected = this.multiAccount;
    this.accounts = [ // temporary
      new Account(1, 'First Username', 'https://i.imgur.com/sicII7N.jpg'),
      new Account(2, 'Second Username', 'https://i.imgur.com/3tgjufY.jpg'),
      new Account(3, 'Third Username', 'https://i.imgur.com/WfdkN3o.jpg')
    ];
    this.allAccounts = this.accounts.reduce((dict, acc) => ({...dict, [acc.id]: acc}), {}); // temporary
    this.addAccountToAll(new Account(4, 'Interlocutor 1', 'https://i.imgur.com/CFpa3nK.jpg'));
    this.addAccountToAll(new Account(5, 'Interlocutor 2', 'https://i.imgur.com/fgrfeVu.jpg'));
  }
  private addAccountToAll(account: Account): void {
    this.allAccounts[account.id] = account;
  }
  getAccountById(id: number): Account {
    return this.allAccounts[id];
  }
  getAccounts(): Account[] {
    return this.accounts;
  }
  addAccount(username: string, imageUrl: string): void {
    this.accounts.push(new Account(this.accounts[this.accounts.length - 1].id, username, imageUrl));
  }
  getSelected(): Account {
    return this.selected;
  }
  selectAccount(id: number): void {
    this.selected = this.accounts.find(account => account.id === id) ?? this.multiAccount;
  }
}
