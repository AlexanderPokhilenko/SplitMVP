package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.DbConnectionFactory;
import com.tikaytech.Split.dao.AbstractDao;
import com.tikaytech.Split.dao.AccountDao;
import com.tikaytech.Split.data.entities.Account;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AccountDaoImpl extends AbstractDao<Long, Account> implements AccountDao {
    protected final String selectByMultiAccountIdSql;
    protected final String selectByDialogIdSql;
    protected final String selectByDialogIdExceptMultiAccountIdSql;
    protected final String selectOneByDialogIdAndMultiAccountIdSql;

    public AccountDaoImpl() {
        super("Accounts",
                "id",
                new String[]{
                        "id",
                        "username",
                        "imageUrl",
                        "multiAccountId"
                });

        selectByMultiAccountIdSql = selectAllSql + " WHERE " + columnsNames[3] + "=?";
        selectByDialogIdSql = selectAllSql + " WHERE " + keyColumnName +
                " IN (SELECT accountId FROM DialogsMembers WHERE dialogId=?)";
        selectByDialogIdExceptMultiAccountIdSql = selectByDialogIdSql + " AND " + columnsNames[3] + "!=?";
        selectOneByDialogIdAndMultiAccountIdSql = selectByDialogIdSql + " AND " + columnsNames[3] + "=? ORDER BY " + keyColumnName + " LIMIT 1";
    }

    @Override
    protected Account createEntity(ResultSet resultSet) throws SQLException {
        return new Account(
                resultSet.getLong(1),
                resultSet.getString(2),
                resultSet.getString(3),
                resultSet.getLong(4)
        );
    }

    @Override
    protected void prepareStatementByEntity(Account entity, PreparedStatement statement) throws SQLException {
        statement.setLong(1, entity.getId());
        statement.setString(2, entity.getUsername());
        statement.setString(3, entity.getImageUrl());
        statement.setLong(4, entity.getMultiAccountId());
    }

    @Override
    public List<Account> getByMultiAccountId(long multiAccountId) {
        List<Account> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectByMultiAccountIdSql);
            ps.setLong(1, multiAccountId);
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
    public List<Account> getInterlocutors(long dialogId) {
        List<Account> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectByDialogIdSql);
            ps.setLong(1, dialogId);
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
    public Optional<Account> getDirectInterlocutor(long dialogId, long multiAccountId) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectByDialogIdExceptMultiAccountIdSql);
            ps.setLong(1, dialogId);
            ps.setLong(2, multiAccountId);
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
    public Optional<Account> getFirstMemberOfDialog(long dialogId, long multiAccountId) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectOneByDialogIdAndMultiAccountIdSql);
            ps.setLong(1, dialogId);
            ps.setLong(2, multiAccountId);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return Optional.ofNullable(createEntity(rs));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Optional.empty();
    }
}
