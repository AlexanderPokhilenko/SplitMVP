using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Split.BLL.Services;
using System.Threading.Tasks;
using Split.BLL.Models;

namespace Split.Hubs
{
    [Authorize]
    public class DialogsHub : Hub<DialogsHub.IClient>
    {
        private readonly DialogsService _dialogsService;
        private readonly AccountsService _accountsService;

        public DialogsHub(DialogsService dialogsService, AccountsService accountsService)
        {
            _dialogsService = dialogsService;
            _accountsService = accountsService;
        }

        private static string GetGroupNameFromDialogId(long dialogId) => "Dialog_" + dialogId;

        private Task SendInvitationsToDialogSubscription(DialogInfo dialog, long creatorId) =>
            SendInvitationsToDialogSubscription(creatorId, dialog.Id, dialog.MembersIds);

        private async Task SendInvitationsToDialogSubscription(long creatorId, long dialogId, IEnumerable<long> membersIds)
        {
            foreach (var memberId in membersIds)
            {
                if(memberId == creatorId) continue;
                var userId = _accountsService.GetMultiAccountIdByAccountId(memberId);
                await Clients.User(userId.ToString()).Invited(dialogId);
            }
        }

        private IEnumerable<string> GetDialogGroupNames()
        {
            var id = long.Parse(Context.UserIdentifier);
            var dialogsIds = _dialogsService.GetDialogsIds(id);
            foreach (var dialogId in dialogsIds) yield return GetGroupNameFromDialogId(dialogId);
        }

        public override async Task OnConnectedAsync()
        {
            var id = long.Parse(Context.UserIdentifier);
            await Clients.Caller.DialogsRequested(_dialogsService.GetPreviewsForMultiAccount(id));
            foreach (var groupName in GetDialogGroupNames()) await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var newest = _dialogsService.GetNewestMessages(id);
            if(newest.Count > 0)
            {
                //await Clients.Caller.NewestMessagesRequested(_dialogsService.GetNewestMessages(id));
                //errors with IDictionary; problems with messages
                foreach (var (dialogId, message) in newest) await Clients.Caller.MessagesRequested(dialogId, _dialogsService.GetDialogMessages(dialogId, 0, long.MaxValue));
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            foreach (var groupName in GetDialogGroupNames()) await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SubscribeToDialog(long dialogId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupNameFromDialogId(dialogId));
            await Clients.Caller.DialogUpdated(_dialogsService.GetGroupDialog(dialogId));
        }

        public async Task CreateDirectChat(long currentAccountId, long interlocutorAccountId)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_accountsService.HasAccount(id, currentAccountId)) return;
            if(_accountsService.HasAccount(id, interlocutorAccountId)) return;
            var dialog = _dialogsService.CreateDirectChat(id, currentAccountId, interlocutorAccountId);

            await SendInvitationsToDialogSubscription(dialog, id);
            var groupName = GetGroupNameFromDialogId(dialog.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).DialogUpdated(dialog);
        }

        public async Task CreateGroupChat(long accountId, string name, string imageUrl)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_accountsService.HasAccount(id, accountId)) return;

            var dialog = _dialogsService.CreateGroupChat(id, accountId, name, imageUrl);
            var groupName = GetGroupNameFromDialogId(dialog.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).DialogUpdated(dialog);
        }

        public async Task InviteToChat(long accountId, long dialogId)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_dialogsService.HasMemberOfDialog(id, dialogId)) return;
            
            _dialogsService.AddMemberToDialog(accountId, dialogId);
            var membersIds = _dialogsService.GetDialogMembersIds(dialogId);
            await SendInvitationsToDialogSubscription(id, dialogId, membersIds);
            var groupName = GetGroupNameFromDialogId(dialogId);
            await Clients.Group(groupName).DialogUpdated(_dialogsService.GetGroupDialog(dialogId));
        }

        public async Task LeaveChat(long accountId, long dialogId)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_accountsService.HasAccount(id, accountId)) return;

            _dialogsService.RemoveMemberFromDialog(accountId, dialogId);
            var groupName = GetGroupNameFromDialogId(dialogId);
            await Clients.Group(groupName).DialogUpdated(_dialogsService.GetGroupDialog(dialogId));
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public Task RequestMessages(long dialogId/*, long fromId=0, long toId=long.MaxValue*/)
        {
            const long fromId = 0, toId = long.MaxValue;
            var id = long.Parse(Context.UserIdentifier);
            if (!_dialogsService.HasMemberOfDialog(id, dialogId)) return Task.CompletedTask;

            return Clients.Caller.MessagesRequested(dialogId,
                _dialogsService.GetDialogMessages(dialogId, fromId, toId));
        }

        public async Task SendMessage(long accountId, long dialogId, string text)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_dialogsService.IsCorrectMemberOfDialog(id, accountId, dialogId)) return;

            var message = _dialogsService.SendMessage(accountId, dialogId, text);
            await Clients.User(Context.UserIdentifier).MessageRead(dialogId, message.Id);
            await Clients.Group(GetGroupNameFromDialogId(dialogId)).MessageReceived(dialogId, message);
        }

        public Task ReadMessage(long accountId, long dialogId, long messageId)
        {
            var id = long.Parse(Context.UserIdentifier);
            if (!_dialogsService.IsCorrectMemberOfDialog(id, accountId, dialogId)) return Task.CompletedTask;

            var readId = _dialogsService.ReadMessage(accountId, dialogId, messageId);
            return Clients.User(Context.UserIdentifier).MessageRead(dialogId, readId);
        }

        public interface IClient
        {
            Task MessageReceived(long dialogId, MessageInfo message);
            Task Invited(long dialogId);
            Task DialogUpdated(DialogInfo dialog);
            Task MessagesRequested(long dialogId, IEnumerable<MessageInfo> messages);
            Task NewestMessagesRequested(IDictionary<long, MessageInfo> messages);
            Task DialogsRequested(IEnumerable<DialogInfo> dialogs);
            Task MessageRead(long dialogId, long messageId);
        }
    }
}
