import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountsService } from '../services/accounts.service';
import { DialogsService } from '../services/dialogs.service';
import { Dialog } from '../data/dialog';
import { DialogsPreviewsService } from '../services/dialogs-previews.service';
import { DialogPreview } from '../data/dialog-preview';
import { Account } from '../data/account';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css', '../css/thumbnails.css', '../css/containers.css']
})
export class DialogsComponent implements OnInit, AfterViewChecked {
  private id?: number;
  dialog?: Dialog;
  preview?: DialogPreview;
  private readonly idSubscription: Subscription;
  constructor(private readonly accountsService: AccountsService,
              private readonly dialogsService: DialogsService,
              private readonly previewsService: DialogsPreviewsService,
              private readonly activatedRoute: ActivatedRoute) {
    this.idSubscription = activatedRoute.params.subscribe(params => {
      this.id = params.id;
      if (this.id !== undefined){
        this.dialog = this.dialogsService.getDialogById(this.id);
        this.preview = this.previewsService.getPreviewFromDialog(this.dialog);
        this.dialogsService.markDialogAsRead(this.id);
      }
    });
  }

  ngOnInit(): void {
  }
  ngAfterViewChecked(): void {
    this.scrollToLastRead();
  }
  scrollToLastRead(): void {
    const lastReadMessage = document.getElementById('msg' + this.dialog.lastReadMessageId);
    if (lastReadMessage === null) { return; }
    lastReadMessage.scrollIntoView();
  }
  sendMessage(): void {
    this.dialogsService.sendMessage(this.id, this.dialog.draftText);
  }
  getFirstCurrentAccountUsername(): string {
    const selectedAccount = this.accountsService.getSelected();
    if (this.dialog.interlocutors.find(acc => acc === selectedAccount)) { return selectedAccount.username; }
    return this.dialog.interlocutors.find(acc => this.isCurrentAccount(acc.id)).username;
  }
  isCurrentAccount(id: number): boolean {
    const accounts = this.accountsService.getAccounts();
    return accounts.find(a => a.id === id) !== undefined;
  }
  getAccountById(id: number): Account {
    return this.accountsService.getAccountById(id);
  }
}
