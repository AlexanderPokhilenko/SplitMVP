package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.DialogsJpaRepository;
import com.tikaytech.Split.data.entities.Dialog;

import javax.ejb.*;
import java.util.List;

@TransactionManagement(TransactionManagementType.CONTAINER)
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
@Stateless(name = "DialogsJpaRepository")
public class DialogsJpaRepositoryImpl extends AbstractJpaRepository<Long, Dialog> implements DialogsJpaRepository {
    @Override
    protected Class<Dialog> getEntityType() { return Dialog.class; }

    @Override
    public List<Dialog> getByAccountId(long accountId) {
        return entityManager.createNamedQuery("Dialog.selectByAccountIdSql", Dialog.class)
                .setParameter("accountId", accountId)
                .getResultList();
    }

    @Override
    public List<Dialog> getByMultiAccountId(long multiAccountId) {
        return entityManager.createNamedQuery("Dialog.selectByMultiAccountIdSql", Dialog.class)
                .setParameter("multiAccountId", multiAccountId)
                .getResultList();
    }

    @Override
    public boolean isMemberOfDialog(long accountId, long dialogId) {
        return entityManager.createNamedQuery("DialogMember.isMemberOfDialogSql", Boolean.class)
                .setParameter("accountId", accountId)
                .setParameter("dialogId", dialogId)
                .getSingleResult();
    }
}
