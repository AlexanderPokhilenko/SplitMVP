package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.DbConnectionFactory;
import com.tikaytech.Split.dao.AbstractDao;
import com.tikaytech.Split.dao.DialogDao;
import com.tikaytech.Split.data.entities.Dialog;

import javax.ejb.Stateless;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DialogDaoImpl extends AbstractDao<Long, Dialog> implements DialogDao {
    protected final String selectByAccountIdSql;
    protected final String selectByMultiAccountIdSql;
    protected final String isMemberOfDialogSql;

    public DialogDaoImpl() {
        super("Dialogs",
                "id",
                new String[]{
                        "id",
                        "name",
                        "imageUrl"
                });

        selectByAccountIdSql = selectAllSql + " WHERE " + keyColumnName +
                " IN (SELECT dialogId FROM DialogsMembers WHERE accountId=?)";
        selectByMultiAccountIdSql = selectAllSql + " WHERE " + keyColumnName +
                " IN (SELECT dialogId FROM DialogsMembers WHERE accountId IN (SELECT id FROM Accounts WHERE multiAccountId=?))";
        isMemberOfDialogSql = "SELECT id FROM DialogsMembers WHERE accountId=? AND dialogId=?";
    }

    @Override
    protected Dialog createEntity(ResultSet resultSet) throws SQLException {
        return new Dialog(
                resultSet.getLong(1),
                resultSet.getString(2),
                resultSet.getString(3)
        );
    }

    @Override
    protected void prepareStatementByEntity(Dialog entity, PreparedStatement statement) throws SQLException {
        statement.setLong(1, entity.getId());
        statement.setString(2, entity.getName());
        statement.setString(3, entity.getImageUrl());
    }

    @Override
    public List<Dialog> getByAccountId(long accountId) {
        List<Dialog> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()) {
            PreparedStatement ps = connection.prepareStatement(selectByAccountIdSql);
            ps.setLong(1, accountId);
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
    public List<Dialog> getByMultiAccountId(long multiAccountId) {
        List<Dialog> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()) {
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
    public boolean isMemberOfDialog(long accountId, long dialogId) {
        try(Connection connection = DbConnectionFactory.getConnection()) {
            PreparedStatement ps = connection.prepareStatement(isMemberOfDialogSql);
            ps.setLong(1, accountId);
            ps.setLong(2, dialogId);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
