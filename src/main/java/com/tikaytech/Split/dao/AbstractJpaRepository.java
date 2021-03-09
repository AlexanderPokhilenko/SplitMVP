package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.WithId;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.*;

public abstract class AbstractJpaRepository<K, E extends WithId<K>> implements JpaRepository<K, E> {
    protected static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("default");

    protected static EntityManager createEntityManager() {
        return entityManagerFactory.createEntityManager();
    }

    protected abstract Class<E> getEntityType();

    @Override
    public Optional<E> get(K key) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        E entity = em.find(getEntityType(), key);
        em.getTransaction().commit();
        em.close();
        return Optional.ofNullable(entity);
    }

    @Override
    public List<E> getAll() {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        List<E> list = em.createQuery("select e from " + getEntityType().getName() + " e", getEntityType()).getResultList();
        em.getTransaction().commit();
        em.close();
        return list;
    }

    @Override
    public boolean create(E entity) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        em.persist(entity);
        em.getTransaction().commit();
        em.close();
        return true;
    }

    @Override
    public boolean update(E entity) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        em.merge(entity);
        em.getTransaction().commit();
        em.close();
        return true;
    }

    @Override
    public boolean delete(K key) {
        EntityManager em = createEntityManager();
        em.getTransaction().begin();
        em.remove(em.find(getEntityType(), key));
        em.getTransaction().commit();
        em.close();
        return true;
    }
}
