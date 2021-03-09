package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.WithId;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import java.io.Serializable;
import java.util.*;

@TransactionAttribute(TransactionAttributeType.REQUIRED)
public abstract class AbstractJpaRepository<K, E extends WithId<K> & Serializable> implements JpaRepository<K, E> {
    @PersistenceContext(name = "default", type = PersistenceContextType.TRANSACTION)
    protected EntityManager entityManager;

    protected abstract Class<E> getEntityType();

    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    @Override
    public E get(K key) {
        return entityManager.find(getEntityType(), key);
    }

    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    @Override
    public List<E> getAll() {
        return entityManager.createQuery("select e from " + getEntityType().getName() + " e", getEntityType()).getResultList();
    }

    @Override
    public boolean create(E entity) {
        entityManager.persist(entity);
        return true;
    }

    @Override
    public boolean update(E entity) {
        entityManager.merge(entity);
        return true;
    }

    @Override
    public boolean delete(K key) {
        entityManager.remove(entityManager.find(getEntityType(), key));
        return true;
    }
}
