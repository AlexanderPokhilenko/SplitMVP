package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Dialog;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface DialogJpaRepository extends JpaRepository<Long, Dialog> {
    List<Dialog> getByAccountId(long accountId);
    List<Dialog> getByMultiAccountId(long multiAccountId);
    boolean isMemberOfDialog(long accountId, long dialogId);
}
