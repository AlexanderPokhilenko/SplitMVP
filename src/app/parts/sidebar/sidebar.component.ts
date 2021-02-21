import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../data/account';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../css/thumbnails.css'],
  providers: [AccountsService]
})
export class SidebarComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: Account;
  constructor(private accountsService: AccountsService, public router: Router) { }

  ngOnInit(): void {
    this.accounts = this.accountsService.getAccounts();
    this.selectedAccount = this.accountsService.getSelected();
  }
  changeAccount(id: number): void {
    this.accountsService.selectAccount(id);
    this.selectedAccount = this.accountsService.getSelected();
  }
}
