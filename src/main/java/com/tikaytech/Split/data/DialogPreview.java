package com.tikaytech.Split.data;

import com.tikaytech.Split.data.entities.Account;

import java.io.Serializable;

public class DialogPreview implements Serializable {
    private long id;
    private String name;
    private String pictureSrc;
    private String dateTimeStr;
    private String text;
    private Account lastAuthor;
    private boolean isDirect;

    public DialogPreview() {
        this(0L, "Unknown Dialog", "./icon.png", "00:00", "Error: empty preview.", new Account(), true);
    }

    public DialogPreview(long id, String name, String pictureSrc, String dateTimeStr, String text, Account lastAuthor, boolean isDirect) {
        this.id = id;
        this.name = name;
        this.pictureSrc = pictureSrc;
        this.dateTimeStr = dateTimeStr;
        this.text = text;
        this.lastAuthor = lastAuthor;
        this.isDirect = isDirect;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPictureSrc() {
        return pictureSrc;
    }

    public void setPictureSrc(String pictureSrc) {
        this.pictureSrc = pictureSrc;
    }

    public String getDateTimeStr() {
        return dateTimeStr;
    }

    public void setDateTimeStr(String dateTimeStr) {
        this.dateTimeStr = dateTimeStr;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Account getLastAuthor() {
        return lastAuthor;
    }

    public void setLastAuthor(Account lastAuthor) {
        this.lastAuthor = lastAuthor;
    }

    public boolean isDirect() { return isDirect; }

    public void setDirect(boolean direct) { isDirect = direct; }
}
