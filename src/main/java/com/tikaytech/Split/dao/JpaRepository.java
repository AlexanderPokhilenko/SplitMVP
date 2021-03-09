package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.WithId;

import java.io.Serializable;
import java.util.List;

public interface JpaRepository<K, E extends WithId<K> & Serializable> {
    E get(K key);
    List<E> getAll();
    boolean create(E entity);
    boolean update(E entity);
    boolean delete(K key);
}
