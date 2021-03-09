package com.tikaytech.Split.services.impl;

import com.tikaytech.Split.dao.AccountJpaRepository;
import com.tikaytech.Split.dao.DialogJpaRepository;
import com.tikaytech.Split.dao.MessageJpaRepository;
import com.tikaytech.Split.data.DialogPreview;
import com.tikaytech.Split.data.entities.Account;
import com.tikaytech.Split.data.entities.Dialog;
import com.tikaytech.Split.data.entities.Message;
import com.tikaytech.Split.services.DialogsService;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Stateless
public class DialogsServiceImpl implements DialogsService {
    @EJB
    private AccountJpaRepository accountDao;
    @EJB
    private DialogJpaRepository dialogDao;
    @EJB
    private MessageJpaRepository messageDao;
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yy");
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    @Override
    public List<Message> getDialogMessages(long dialogId) {
        return messageDao.getByDialogId(dialogId);
    }

    private DialogPreview getPreviewFromDialog(Dialog dialog, long multiAccountId) {
        boolean isDirect = dialog.getName() == null;
        Message lastMessage = messageDao.getLast(dialog.getId()).orElseGet(this::createStubMessage);
        Account lastAuthor = accountDao.get(lastMessage.getAuthorId()).orElseGet(this::createStubAccount);
        String previewName;
        String imageUrl;
        if (isDirect){
            Account interlocutor = accountDao.getDirectInterlocutor(dialog.getId(), multiAccountId).orElseGet(this::createStubAccount);
            previewName = interlocutor.getUsername();
            imageUrl = interlocutor.getImageUrl();
        } else {
            previewName = dialog.getName();
            imageUrl = dialog.getImageUrl();
        }

        return new DialogPreview(dialog.getId(),
                previewName,
                imageUrl,
                getDateTimeStr(lastMessage.getDate()),
                lastMessage.getText(),
                lastAuthor,
                isDirect);
    }

    @Override
    public Optional<DialogPreview> getPreviewByDialogId(long dialogId, long multiAccountId) {
        return dialogDao.get(dialogId).map((dialog) -> getPreviewFromDialog(dialog, multiAccountId));
    }

    private Account createStubAccount() {
        return new Account(-1, "Nobody", "./icon.png", 0);
    }

    private Message createStubMessage() {
        return new Message(-1, "No messages yet.", new Timestamp(new Date().getTime()), 0, 0);
    }

    private String getDateTimeStr(Timestamp dateTime) {
        LocalDate today = LocalDate.now();
        if(dateTime.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isEqual(today)){
            return timeFormat.format(dateTime);
        }
        else {
            return dateFormat.format(dateTime);
        }
    }

    private List<DialogPreview> getPreviewsFromDialogs(List<Dialog> dialogs, long multiAccountId) {
        ArrayList<DialogPreview> previews = new ArrayList<>(dialogs.size());
        for (Dialog dialog : dialogs) {
            previews.add(getPreviewFromDialog(dialog, multiAccountId));
        }

        return previews;
    }

    @Override
    public List<DialogPreview> getPreviewsForAccount(long accountId) {
        long multiAccountId = accountDao.get(accountId).orElseGet(this::createStubAccount).getMultiAccountId();
        List<Dialog> dialogs = dialogDao.getByAccountId(accountId);
        return getPreviewsFromDialogs(dialogs, multiAccountId);
    }

    @Override
    public List<DialogPreview> getPreviewsForMultiAccount(long multiAccountId) {
        List<Dialog> dialogs = dialogDao.getByMultiAccountId(multiAccountId);
        return getPreviewsFromDialogs(dialogs, multiAccountId);
    }

    @Override
    public boolean sendMessage(long accountId, long dialogId, String text) {
        Message message = new Message(0, text, new Timestamp(new Date().getTime()), dialogId, accountId);
        return messageDao.create(message);
    }

    @Override
    public boolean isMemberOfDialog(long accountId, long dialogId) {
        return dialogDao.isMemberOfDialog(accountId, dialogId);
    }

    @Override
    public List<Account> getInterlocutors(long dialogId) {
        return accountDao.getInterlocutors(dialogId);
    }

    @Override
    public Optional<Long> getIdOfFirstMemberOfDialog(long dialogId, long multiAccountId) {
        return accountDao.getFirstMemberOfDialog(dialogId, multiAccountId).map(Account::getId);
    }
}
