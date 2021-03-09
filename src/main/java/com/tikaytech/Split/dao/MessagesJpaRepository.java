package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Message;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface MessagesJpaRepository extends JpaRepository<Long, Message> {
    List<Message> getByDialogId(long dialogId);
    Message getLast(long dialogId);
}
