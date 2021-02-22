import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogsService } from './dialogs.service';
import { DialogPreview } from '../data/dialog-preview';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class DialogsPreviewsService {

  constructor(private readonly accountsService: AccountsService,
              private readonly dialogsService: DialogsService,
              private readonly datePipe: DatePipe) { }
  public getPreviews(): DialogPreview[] {
    const previews = [];
    const dialogs = this.dialogsService.getDialogs();
    for (const dialog of dialogs) {
      const lastMessage = dialog.messages[dialog.messages.length - 1];
      const lastAuthor = this.accountsService.getAccountById(lastMessage.authorId);
      const dateTimeStr = this.getDateTimeStr(lastMessage.dateTime);
      const currentAccounts = this.accountsService.getAccounts();
      const otherInterlocutor = dialog.interlocutors.find(acc => !currentAccounts.find(a => a.id === acc.id));
      const name = dialog.isDirect ? otherInterlocutor.username : dialog.name;
      const picture = dialog.isDirect ? otherInterlocutor.imageUrl : dialog.pictureSrc;
      const preview = new DialogPreview(dialog.id, name, picture, dateTimeStr, lastMessage.text,
        lastAuthor, lastMessage.id - dialog.lastReadMessageId);
      previews.push(preview);
    }
    return previews;
  }
  private getDateTimeStr(dateTime: Date): string {
    const oneDayMs = 60 * 60 * 24 * 1000;
    const dayAgo = Date.now() - oneDayMs;
    const isOld = dayAgo >= dateTime.getTime();
    return isOld ? this.datePipe.transform(dateTime, 'dd.MM.yy') : this.datePipe.transform(dateTime, 'HH:mm');
  }
}
