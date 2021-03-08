package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

public class Message implements Serializable, WithId<Long> {
    private long id;
    private String text;
    private Timestamp date;
    private long dialogId;
    private long authorId;

    public Message() {
        this(0, "Error: empty message.", new Timestamp(new Date().getTime()), 0, 0);
    }

    public Message(long id, String text, Timestamp date, long dialogId, long authorId) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.dialogId = dialogId;
        this.authorId = authorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public long getDialogId() { return dialogId; }

    public void setDialogId(long dialogId) { this.dialogId = dialogId; }

    public long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(long authorId) {
        this.authorId = authorId;
    }
}
