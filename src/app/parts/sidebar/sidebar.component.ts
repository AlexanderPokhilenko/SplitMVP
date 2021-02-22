import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../data/account';
import { DialogsPreviewsService } from '../../services/dialogs-previews.service';
import { DialogPreview } from '../../data/dialog-preview';
import {DialogsService} from '../../services/dialogs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../css/thumbnails.css']
})
export class SidebarComponent implements OnInit {
  accounts: Account[] = [];
  previews: DialogPreview[] = [];
  unreadMessagesCount = 0;
  selectedAccount: Account;
  constructor(private readonly accountsService: AccountsService,
              private readonly dialogsService: DialogsService,
              private readonly previewsService: DialogsPreviewsService,
              public readonly router: Router) {
    this.dialogsService.sidebarCallback = () => this.updateValues();
  }

  ngOnInit(): void {
    this.accounts = this.accountsService.getAccounts();
    this.updateValues();
  }
  changeAccount(id: number): void {
    this.accountsService.selectAccount(id);
    this.updateValues();
  }
  updateValues(): void {
    this.selectedAccount = this.accountsService.getSelected();
    this.previews = this.previewsService.getPreviews();
    this.unreadMessagesCount = this.previews.reduce((c, p) => c + p.unreadMessagesCount, 0);
  }
}
