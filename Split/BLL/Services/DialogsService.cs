using Split.BLL.Models;
using Split.DAL;
using Split.DAL.Models;
using System;
using System.Linq;

namespace Split.BLL.Services
{
    public class DialogsService
    {
        private readonly ApplicationContext _context;

        public DialogsService(ApplicationContext context)
        {
            _context = context;
        }

        public MessageInfo[] GetDialogMessages(long dialogId)
        {
            return _context.Messages.Where(m => m.DialogId == dialogId)
                .Select(m => new MessageInfo(m.Id,
                    m.Text,
                    m.Date,
                    m.AuthorId))
                .ToArray();
        }

        private static DialogInfo GetPreviewFromDialog(Dialog dialog, long multiAccountId)
        {
            var isDirect = dialog.Name == null;
            string previewName;
            string imageUrl;
            if (isDirect)
            {
                var interlocutor = dialog.Membership.Select(m => m.Account)
                    .FirstOrDefault(a => a.MultiAccountId != multiAccountId);
                if(interlocutor != null)
                {
                    previewName = interlocutor.Username;
                    imageUrl = interlocutor.ImageUrl;
                }
                else
                {
                    var stubAccInfo = new AccountInfo();
                    previewName = stubAccInfo.Username;
                    imageUrl = stubAccInfo.ImageUrl;
                }
            }
            else
            {
                previewName = dialog.Name;
                imageUrl = dialog.ImageUrl;
            }

            return new DialogInfo(dialog.Id, previewName, imageUrl, isDirect);
        }

        public DialogInfo GetPreviewByDialogId(long dialogId, long multiAccountId)
        {
            var dialog = _context.Dialogs.Find(dialogId);
            return dialog == null ? new DialogInfo() : GetPreviewFromDialog(dialog, multiAccountId);
        }

        public DialogInfo[] GetPreviewsForAccount(long accountId)
        {
            var account = _context.Accounts.Find(accountId);
            if(account == null) return new DialogInfo[0];
            var multiAccountId = account.MultiAccountId;
            return account.Membership.Select(m => m.Dialog)
                .Select(d => GetPreviewFromDialog(d,
                    multiAccountId))
                .ToArray();
        }

        public DialogInfo[] GetPreviewsForMultiAccount(long multiAccountId)
        {
            var multiAccount = _context.MultiAccounts.Find(multiAccountId);
            if(multiAccount == null) return new DialogInfo[0];
            return multiAccount.Accounts.SelectMany(a => a.Membership)
                .Select(m => m.Dialog)
                .Select(d => GetPreviewFromDialog(d,
                    multiAccountId))
                .ToArray();
        }

        public void SendMessage(long accountId, long dialogId, string text)
        {
            var message = new Message
            {
                Text = text,
                Date = DateTime.Now,
                DialogId = dialogId,
                AuthorId = accountId,
            };
            _context.Messages.Add(message);
            _context.SaveChanges();
        }

        public bool IsMemberOfDialog(long accountId, long dialogId)
        {
            return _context.DialogMembers.Any(m => m.AccountId == accountId && m.DialogId == dialogId);
        }

        public AccountInfo[] GetInterlocutors(long dialogId)
        {
            return _context.Dialogs.Find(dialogId)
                ?.Membership.Select(m => m.Account)
                .Select(a => new AccountInfo(a.Id,
                    a.Username,
                    a.ImageUrl))
                .ToArray() ?? new AccountInfo[0];
        }

        public long GetIdOfFirstMemberOfDialog(long dialogId, long multiAccountId)
        {
            return _context.Dialogs.Find(dialogId)
                       ?.Membership.Select(m => m.Account)
                       .FirstOrDefault(a => a.MultiAccountId == multiAccountId)
                       ?.Id ??
                   -1;
        }
    }
}
