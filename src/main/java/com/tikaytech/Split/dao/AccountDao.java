package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Account;

import javax.ejb.Remote;
import java.util.List;
import java.util.Optional;

@Remote
public interface AccountDao extends Dao<Long, Account> {
    List<Account> getByMultiAccountId(long multiAccountId);
    List<Account> getInterlocutors(long dialogId);
    Optional<Account> getDirectInterlocutor(long dialogId, long multiAccountId);
    Optional<Account> getFirstMemberOfDialog(long dialogId, long multiAccountId);
}
