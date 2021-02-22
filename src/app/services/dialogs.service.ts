import { Injectable } from '@angular/core';
import { Dialog } from '../data/dialog';
import { Message } from '../data/message';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {
  public sidebarCallback: () => void;
  private readonly dialogs: {[id: number]: Dialog};
  constructor(private readonly accountsService: AccountsService) {
    this.dialogs = { // temporary
      1: new Dialog(1,
        [accountsService.getAccountById(1), accountsService.getAccountById(4)],
        [
          new Message(1, 'Some text.', 1, new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)),
          new Message(2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 4, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7))
        ]),
      2: new Dialog(2,
        [accountsService.getAccountById(1), accountsService.getAccountById(5)],
        [
          new Message(1, 'Hi!', 1, new Date(Date.now() - 1000 * 60 * 60 * 24)),
          new Message(2, 'Hello!', 5, new Date(Date.now() - 1000 * 60 * 60))
        ]),
      3: new Dialog(3,
        [accountsService.getAccountById(1), accountsService.getAccountById(2), accountsService.getAccountById(3),
          accountsService.getAccountById(4), accountsService.getAccountById(5)],
        [
          new Message(1, 'Good day!', 1, new Date(Date.now() - 1000 * 60 * 10)),
          new Message(2, 'Hi!', 2, new Date(Date.now() - 1000 * 60 * 9)),
          new Message(3, 'Hello there!', 3, new Date(Date.now() - 1000 * 60 * 8)),
          new Message(4, 'Hello!', 4, new Date(Date.now() - 1000 * 60 * 7)),
          new Message(5, 'Greetings!', 5, new Date(Date.now() - 1000 * 60 * 6))
        ],
        'General chat',
        'https://i.imgur.com/tGUXjPO.jpeg')
    };
  }
  sendMessage(dialogId: number, text: string): void {
    const dialog = this.dialogs[dialogId];
    const messages = dialog.messages;
    const nextMessageId = messages[messages.length - 1].id + 1;
    const selectedId = this.accountsService.getSelected().id;
    const accounts = this.accountsService.getAccounts();
    const accountId = selectedId !== 0 ? selectedId : dialog.interlocutors.find(acc => accounts.find(a => a.id === acc.id)).id;
    dialog.messages.push(new Message(nextMessageId, text, accountId));
    dialog.lastReadMessageId = nextMessageId;
    dialog.draftText = null;
    this.sidebarCallback();
  }
  markDialogAsRead(id: number): void {
    const dialog = this.getDialogById(id);
    dialog.lastReadMessageId = dialog.messages[dialog.messages.length - 1].id;
    this.sidebarCallback();
  }
  getDialogById(id: number): Dialog {
    return this.dialogs[id];
  }
  getDialogs(): Dialog[] {
    return Object.values(this.dialogs);
  }
}
