package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Message;

import java.util.List;
import java.util.Optional;

public interface MessageDao extends Dao<Long, Message> {
    List<Message> getByDialogId(long dialogId);
    Optional<Message> getLast(long dialogId);
}
