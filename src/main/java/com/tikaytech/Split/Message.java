package com.tikaytech.Split;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable {
    private long id;
    private String text;
    private Date date;
    private long authorId;
    //private String[] filesSrc;

    public Message() {
        this(0, "Error: empty message.", new Date(), 0/*, new String[0]*/);
    }

    /*
    public Message(long id, String text, Date date, long authorId) {
        this(id, text, date, authorId, new String[0]);
    }
    */

    public Message(long id, String text, Date date, long authorId/*, String[] filesSrc*/) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.authorId = authorId;
        //this.filesSrc = filesSrc;
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

    public long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(long authorId) {
        this.authorId = authorId;
    }

    /*
    public String[] getFilesSrc() {
        return filesSrc;
    }

    public void setFilesSrc(String[] filesSrc) {
        this.filesSrc = filesSrc;
    }
 */
}
