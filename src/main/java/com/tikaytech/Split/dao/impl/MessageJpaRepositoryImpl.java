package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.dao.AbstractJpaRepository;
import com.tikaytech.Split.dao.MessageJpaRepository;
import com.tikaytech.Split.data.entities.Message;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Stateless
public class MessageJpaRepositoryImpl extends AbstractJpaRepository<Long, Message> implements MessageJpaRepository {
    @Override
    protected Class<Message> getEntityType() { return Message.class; }

    @Override
    public List<Message> getByDialogId(long dialogId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Message> list = em.createNamedQuery("Message.selectByDialogIdSql", Message.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public Optional<Message> getLast(long dialogId) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<Message> list = em.createNamedQuery("Message.selectByDialogIdOrderedDescByDateSql", Message.class)
                .setParameter("dialogId", dialogId)
                .getResultList();
        em.getTransaction().commit();
        em.close();
        if(list.size() == 0) return Optional.empty();
        return Optional.ofNullable(list.get(0));
    }
}
