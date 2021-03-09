package com.tikaytech.Split.dao;

import com.tikaytech.Split.data.entities.Message;

import javax.ejb.Remote;
import java.util.List;
import java.util.Optional;

@Remote
public interface MessageJpaRepository extends JpaRepository<Long, Message> {
    List<Message> getByDialogId(long dialogId);
    Optional<Message> getLast(long dialogId);
}
