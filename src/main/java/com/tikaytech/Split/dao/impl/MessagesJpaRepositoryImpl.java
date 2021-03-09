package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.MessagesJpaRepository;
import com.tikaytech.Split.data.entities.Message;

import javax.ejb.*;
import java.util.List;

@TransactionManagement(TransactionManagementType.CONTAINER)
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
@Stateless(name = "MessagesJpaRepository")
public class MessagesJpaRepositoryImpl extends AbstractJpaRepository<Long, Message> implements MessagesJpaRepository {
    @Override
    protected Class<Message> getEntityType() { return Message.class; }

    @Override
    public List<Message> getByDialogId(long dialogId) {
        return entityManager.createNamedQuery("Message.selectByDialogIdSql", Message.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
    }

    @Override
    public Message getLast(long dialogId) {
        List<Message> list = entityManager.createNamedQuery("Message.selectByDialogIdOrderedDescByDateSql", Message.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
        if(list.size() == 0) return null;
        return list.get(0);
    }
}
