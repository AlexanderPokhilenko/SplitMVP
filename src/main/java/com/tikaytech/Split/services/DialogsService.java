package com.tikaytech.Split.services;

import com.tikaytech.Split.data.DialogPreview;
import com.tikaytech.Split.data.entities.Account;
import com.tikaytech.Split.data.entities.Message;

import java.util.List;
import java.util.Optional;

public interface DialogsService {
    List<Message> getDialogMessages(long dialogId);
    Optional<DialogPreview> getPreviewByDialogId(long dialogId, long multiAccountId);
    List<DialogPreview> getPreviewsForAccount(long accountId);
    List<DialogPreview> getPreviewsForMultiAccount(long multiAccountId);
    boolean sendMessage(long accountId, long dialogId, String text);
    boolean isMemberOfDialog(long accountId, long dialogId);
    List<Account> getInterlocutors(long dialogId);
    Optional<Long> getIdOfFirstMemberOfDialog(long dialogId, long multiAccountId);
}
