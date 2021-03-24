using Split.BLL.Models;
using Split.DAL;
using Split.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Split.BLL.Services
{
    public class DialogsService
    {
        private readonly ApplicationContext _context;

        public DialogsService(ApplicationContext context)
        {
            _context = context;
        }

        public bool HasMemberOfDialog(long multiAccountId, long dialogId)
        {
            return _context.DialogMembers.Include(m => m.Account).Any(m =>
                m.DialogId == dialogId && m.Account.MultiAccountId == multiAccountId);
        }

        public bool IsCorrectMemberOfDialog(long multiAccountId, long accountId, long dialogId)
        {
            return _context.DialogMembers.Include(m => m.Account).Any(m =>
                m.DialogId == dialogId && m.AccountId == accountId && m.Account.MultiAccountId == multiAccountId);
        }

        public long[] GetDialogsIds(long multiAccountId)
        {
            return _context.DialogMembers.Include(m => m.Account).Where(m => m.Account.MultiAccountId == multiAccountId)
                .Select(m => m.DialogId).ToArray();
        }

        public long[] GetDialogMembersIds(long dialogId)
        {
            return _context.DialogMembers.Where(m => m.DialogId == dialogId).Select(m => m.AccountId).ToArray();
        }

        public Dictionary<long, MessageInfo> GetNewestMessages(long multiAccountId)
        {
            return _context.DialogMembers.Include(m => m.Account)
                .Include(m => m.Dialog)
                .ThenInclude(d => d.Messages)
                .Where(m => m.Account.MultiAccountId == multiAccountId)
                .Select(m => m.Dialog)
                .Select(d => d.Messages)
                .Select(g => g.OrderByDescending(m => m.Id).FirstOrDefault())
                .Where(m => m != null)
                .ToDictionary(m => m.DialogId, m => new MessageInfo(m.Id, m.Text, m.Date, m.AuthorId));
        }

        public MessageInfo[] GetDialogMessages(long dialogId, long from, long to)
        {
            return _context.Messages.Where(m => m.DialogId == dialogId)
                .Where(m => m.Id >= from && m.Id < to)
                .OrderBy(m => m.Id)
                .Select(m => new MessageInfo(m.Id,
                    m.Text,
                    m.Date,
                    m.AuthorId))
                .ToArray();
        }

        public DialogInfo GetGroupDialog(long dialogId)
        {
            var dialog = _context.Dialogs.Find(dialogId);
            return new DialogInfo(dialogId, dialog.Name, dialog.ImageUrl, -1, GetDialogMembersIds(dialogId));
        }

        public DialogInfo CreateDirectChat(long multiAccountId, long currentAccountId, long interlocutorAccountId)
        {
            var dialog = new Dialog
            {
                Name = null, ImageUrl = null, Membership = new []
                {
                    new DialogMember {AccountId = currentAccountId},
                    new DialogMember {AccountId = interlocutorAccountId}
                }
            };
            _context.Dialogs.Add(dialog);
            _context.SaveChanges();
            return GetPreviewFromDialog(dialog, multiAccountId, _context);
        }

        public DialogInfo CreateGroupChat(long multiAccountId, long accountId, string name, string imageUrl)
        {
            var dialog = new Dialog
            {
                Name = name,
                ImageUrl = imageUrl,
                Membership = new[]
                {
                    new DialogMember {AccountId = accountId}
                }
            };
            _context.Dialogs.Add(dialog);
            _context.SaveChanges();
            return GetPreviewFromDialog(dialog, multiAccountId, _context);
        }

        public long GetLastMessageId(long dialogId)
        {
            return _context.Dialogs.Include(d => d.Messages).FirstOrDefault(d => d.Id == dialogId)?.Messages.LastOrDefault()?.Id ?? 0;
        }

        public void AddMemberToDialog(long accountId, long dialogId)
        {
            //if(_context.DialogMembers.Any(m => m.AccountId == accountId && m.DialogId == m.DialogId)) return;
            _context.DialogMembers.Add(new DialogMember{DialogId = dialogId, AccountId = accountId, LastReadMessageId = GetLastMessageId(dialogId)});
            _context.SaveChanges();
        }

        public void RemoveMemberFromDialog(long accountId, long dialogId)
        {
            var membership = _context.DialogMembers.FirstOrDefault(m => m.AccountId == accountId && m.DialogId == dialogId);
            if(membership == null) return;

            _context.DialogMembers.Remove(membership);
            _context.SaveChanges();
        }

        private static DialogInfo GetPreviewFromDialog(Dialog dialog, long multiAccountId, ApplicationContext context)
        {
            long lastReadMessageId;
            long[] membersIds;
            if (dialog.Membership?.All(m => m.Account != null) ?? false)
            {
                lastReadMessageId = dialog.Membership.FirstOrDefault(m => m.Account.MultiAccountId == multiAccountId)
                                        ?.LastReadMessageId ?? 0;
                membersIds = dialog.Membership.Select(m => m.AccountId).ToArray();
            }
            else
            {
                lastReadMessageId = context.DialogMembers.Include(m => m.Account)
                                        .FirstOrDefault(m => m.DialogId == dialog.Id && m.Account.MultiAccountId == multiAccountId)
                                        ?.LastReadMessageId ?? 0;
                membersIds = context.DialogMembers.Where(m => m.DialogId == dialog.Id).Select(m => m.AccountId).ToArray();
            }

            return new DialogInfo(dialog.Id, dialog.Name, dialog.ImageUrl, lastReadMessageId, membersIds);
        }

        public DialogInfo[] GetPreviewsForMultiAccount(long multiAccountId)
        {
            return _context.Accounts.Include(a => a.Membership)
                .ThenInclude(m => m.Dialog)
                .Where(a => a.MultiAccountId == multiAccountId)
                .SelectMany(a => a.Membership)
                .Select(m => m.Dialog)
                .Select(d => GetPreviewFromDialog(d,
                    multiAccountId, _context))
                .ToArray();
        }

        public MessageInfo SendMessage(long accountId, long dialogId, string text)
        {
            var message = new Message
            {
                Text = text,
                Date = DateTime.UtcNow,
                DialogId = dialogId,
                AuthorId = accountId,
            };
            _context.Messages.Add(message);
            var membership = _context.DialogMembers
                .Include(m => m.LastReadMessage)
                .FirstOrDefault(m => m.AccountId == accountId && m.DialogId == dialogId);
            if (membership != null)
            {
                membership.LastReadMessage = message;
                _context.Update(membership);
            }
            _context.SaveChanges();

            return new MessageInfo(message.Id, message.Text, message.Date, message.AuthorId);
        }

        public long ReadMessage(long accountId, long dialogId, long messageId)
        {
            var membership = _context.DialogMembers.FirstOrDefault(m => m.AccountId == accountId && m.DialogId == dialogId);
            if(membership == null) return -1;

            membership.LastReadMessageId = messageId;
            _context.SaveChanges();
            return membership.LastReadMessageId;
        }
    }
}
