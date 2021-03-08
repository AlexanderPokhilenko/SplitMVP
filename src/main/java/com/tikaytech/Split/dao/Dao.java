package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.WithId;

import java.util.List;
import java.util.Optional;

public interface Dao<K, E extends WithId<K>> {
    Optional<E> get(K key);

    List<E> getAll();

    boolean create(E entity);

    boolean update(E entity);

    boolean delete(K key);
}
