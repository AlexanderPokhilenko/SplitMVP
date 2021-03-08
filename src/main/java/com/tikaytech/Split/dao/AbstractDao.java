package com.tikaytech.Split.dao;

import com.tikaytech.Split.DbConnectionFactory;
import com.tikaytech.Split.data.WithId;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

public abstract class AbstractDao<K, E extends WithId<K>> implements Dao<K, E>  {
    protected final String tableName;
    protected final String keyColumnName;
    protected final String[] columnsNames;
    protected final String selectSql;
    protected final String selectAllSql;
    protected final String insertSql;
    protected final String updateSql;
    protected final String deleteSql;

    public AbstractDao(String tableName, String keyColumnName, String[] columnsNames) {
        this.tableName = tableName;
        this.keyColumnName = keyColumnName;
        this.columnsNames = columnsNames;

        String columns = String.join(", ", columnsNames);
        String questions = String.join(", ", Collections.nCopies(columnsNames.length, "?"));

        selectAllSql = "SELECT " + columns + " FROM " + tableName;
        selectSql = selectAllSql + " WHERE " + keyColumnName + "=?";
        insertSql = "INSERT INTO " + tableName + "(" + columns + ") VALUES (" + questions + ")";
        updateSql = "UPDATE " + tableName + " SET " + Arrays.stream(columnsNames).map(c -> c + "=?")
                .collect(Collectors.joining(", ")) + " WHERE " + keyColumnName + "=?";
        deleteSql = "DELETE FROM " + tableName + " WHERE " + keyColumnName + "=?";
    }

    protected abstract E createEntity(ResultSet resultSet) throws SQLException;
    protected abstract void prepareStatementByEntity(E entity, PreparedStatement statement) throws SQLException;

    @Override
    public Optional<E> get(K key) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectSql);
            ps.setObject(1, key);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return Optional.ofNullable(createEntity(rs));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<E> getAll() {
        List<E> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectAllSql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                list.add(createEntity(rs));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    @Override
    public boolean create(E entity) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(insertSql);
            prepareStatementByEntity(entity, ps);
            ps.setNull(1, Types.NULL);
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            if(rs.next()){
                //noinspection unchecked
                entity.setId((K)rs.getObject(1));
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean update(E entity) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(updateSql);
            prepareStatementByEntity(entity, ps);
            ps.setObject(columnsNames.length, entity.getId());
            return ps.execute();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(K key) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(deleteSql);
            ps.setObject(1, key);
            return ps.execute();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
