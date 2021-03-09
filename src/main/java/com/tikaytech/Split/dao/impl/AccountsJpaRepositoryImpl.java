package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.AccountsJpaRepository;
import com.tikaytech.Split.data.entities.Account;

import javax.ejb.*;
import java.util.List;

@TransactionManagement(TransactionManagementType.CONTAINER)
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
@Stateless(name = "AccountsJpaRepository")
public class AccountsJpaRepositoryImpl extends AbstractJpaRepository<Long, Account> implements AccountsJpaRepository {
    @Override
    protected Class<Account> getEntityType() { return Account.class; }

    @Override
    public List<Account> getByMultiAccountId(long multiAccountId) {
        return entityManager.createNamedQuery("Account.getByMultiAccountId", Account.class)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
    }

    @Override
    public List<Account> getInterlocutors(long dialogId) {
        return entityManager.createNamedQuery("Account.selectByDialogIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
    }

    @Override
    public Account getDirectInterlocutor(long dialogId, long multiAccountId) {
        return entityManager.createNamedQuery("Account.selectByDialogIdExceptMultiAccountIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .setParameter("multiAccountId", multiAccountId)
                .getSingleResult();
    }

    @Override
    public Account getFirstMemberOfDialog(long dialogId, long multiAccountId) {
        List<Account> list = entityManager.createNamedQuery("Account.selectByDialogIdAndMultiAccountIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
        if(list.size() == 0) return null;
        return list.get(0);
    }
}
