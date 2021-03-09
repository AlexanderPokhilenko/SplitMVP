package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.AccountJpaRepository;
import com.tikaytech.Split.data.entities.Account;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Stateless
public class AccountJpaRepositoryImpl extends AbstractJpaRepository<Long, Account> implements AccountJpaRepository {
    @Override
    protected Class<Account> getEntityType() { return Account.class; }

    @Override
    public List<Account> getByMultiAccountId(long multiAccountId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Account> list =  em.createNamedQuery("Account.getByMultiAccountId", Account.class)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public List<Account> getInterlocutors(long dialogId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Account> list = em.createNamedQuery("Account.selectByDialogIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public Optional<Account> getDirectInterlocutor(long dialogId, long multiAccountId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        Account account = em.createNamedQuery("Account.selectByDialogIdExceptMultiAccountIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .setParameter("multiAccountId", multiAccountId)
                .getSingleResult();
        em.getTransaction().commit();
        em.close();
        return Optional.ofNullable(account);
    }

    @Override
    public Optional<Account> getFirstMemberOfDialog(long dialogId, long multiAccountId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Account> list = em.createNamedQuery("Account.selectByDialogIdAndMultiAccountIdSql", Account.class)
                .setParameter("dialogId", dialogId)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        if(list.size() == 0) return Optional.empty();
        return Optional.ofNullable(list.get(0));
    }
}
