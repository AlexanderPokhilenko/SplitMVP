package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Account;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface AccountsJpaRepository extends JpaRepository<Long, Account> {
    List<Account> getByMultiAccountId(long multiAccountId);
    List<Account> getInterlocutors(long dialogId);
    Account getDirectInterlocutor(long dialogId, long multiAccountId);
    Account getFirstMemberOfDialog(long dialogId, long multiAccountId);
}
