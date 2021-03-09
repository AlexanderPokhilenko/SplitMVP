package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.DialogJpaRepository;
import com.tikaytech.Split.data.entities.Dialog;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import java.util.List;

@Stateless
public class DialogJpaRepositoryImpl extends AbstractJpaRepository<Long, Dialog> implements DialogJpaRepository {
    @Override
    protected Class<Dialog> getEntityType() { return Dialog.class; }

    @Override
    public List<Dialog> getByAccountId(long accountId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Dialog> list = em.createNamedQuery("Dialog.selectByAccountIdSql", Dialog.class)
                .setParameter("accountId", accountId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public List<Dialog> getByMultiAccountId(long multiAccountId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Dialog> list = em.createNamedQuery("Dialog.selectByMultiAccountIdSql", Dialog.class)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public boolean isMemberOfDialog(long accountId, long dialogId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        boolean isMember = em.createNamedQuery("DialogMember.isMemberOfDialogSql", Boolean.class)
                .setParameter("accountId", accountId)
                .setParameter("dialogId", dialogId)
                .getSingleResult();
        em.getTransaction().commit();
        em.close();
        return isMember;
    }
}
