package com.tikaytech.Split.dao.impl;

import com.tikaytech.Split.DbConnectionFactory;
import com.tikaytech.Split.dao.AbstractDao;
import com.tikaytech.Split.dao.MessageDao;
import com.tikaytech.Split.data.entities.Message;

import javax.ejb.Stateless;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Stateless
public class MessageDaoImpl extends AbstractDao<Long, Message> implements MessageDao {
    protected final String selectByDialogIdSql;
    protected final String selectLastInDialogSql;

    public MessageDaoImpl() {
        super("Messages",
                "id",
                new String[]{
                        "id",
                        "text",
                        "date",
                        "dialogId",
                        "authorId"
                });

        selectByDialogIdSql = selectAllSql + " WHERE " + columnsNames[3] + "=?";
        selectLastInDialogSql = selectByDialogIdSql + " ORDER BY " + columnsNames[2] + " DESC LIMIT 1";
    }

    @Override
    protected Message createEntity(ResultSet resultSet) throws SQLException {
        return new Message(
                resultSet.getLong(1),
                resultSet.getString(2),
                resultSet.getTimestamp(3),
                resultSet.getLong(4),
                resultSet.getLong(5)
        );
    }

    @Override
    protected void prepareStatementByEntity(Message entity, PreparedStatement statement) throws SQLException {
        statement.setLong(1, entity.getId());
        statement.setString(2, entity.getText());
        statement.setTimestamp(3, entity.getDate());
        statement.setLong(4, entity.getDialogId());
        statement.setLong(5, entity.getAuthorId());
    }

    @Override
    public List<Message> getByDialogId(long dialogId) {
        List<Message> list = new ArrayList<>();
        try(Connection connection = DbConnectionFactory.getConnection()) {
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
    public Optional<Message> getLast(long dialogId) {
        try(Connection connection = DbConnectionFactory.getConnection()){
            PreparedStatement ps = connection.prepareStatement(selectLastInDialogSql);
            ps.setLong(1, dialogId);
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
