import { Injectable } from '@angular/core';
import { Account } from '../data/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private readonly multiAccount: Account;
  private selected: Account;
  private readonly accounts: Account[];
  constructor() {
    this.multiAccount = new Account(0, 'Multi-account', '/assets/images/icon.png');
    this.selected = this.multiAccount;
    this.accounts = [ // temporary
      new Account(1, 'First Username', 'https://i.imgur.com/sicII7N.jpg'),
      new Account(2, 'Second Username', 'https://i.imgur.com/3tgjufY.jpg'),
      new Account(3, 'Third Username', 'https://i.imgur.com/WfdkN3o.jpg')
    ];
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
