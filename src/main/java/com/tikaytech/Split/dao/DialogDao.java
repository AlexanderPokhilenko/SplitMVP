package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Dialog;

import java.util.List;

public interface DialogDao extends Dao<Long, Dialog> {
    List<Dialog> getByAccountId(long accountId);
    List<Dialog> getByMultiAccountId(long multiAccountId);
    boolean isMemberOfDialog(long accountId, long dialogId);
}
