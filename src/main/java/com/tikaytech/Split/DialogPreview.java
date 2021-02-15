package com.tikaytech.Split;

import java.io.Serializable;
import java.util.Date;

public class DialogPreview implements Serializable {
    private long id;
    private String text;
    private Date date;
    private long lastSenderId;
    private Account interlocutor;

    public DialogPreview() {
        this(0, "Error: empty preview.", new Date(), 0, new Account());
    }

    public DialogPreview(long id, String text, Date date, long lastSenderId, Account interlocutor) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.lastSenderId = lastSenderId;
        this.interlocutor = interlocutor;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public long getLastSenderId() {
        return lastSenderId;
    }

    public void setLastSenderId(long lastSenderId) {
        this.lastSenderId = lastSenderId;
    }

    public Account getInterlocutor() {
        return interlocutor;
    }

    public void setInterlocutor(Account interlocutor) {
        this.interlocutor = interlocutor;
    }
}
