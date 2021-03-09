package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "Messages")
@NamedQueries(
        {
                @NamedQuery(
                        name = "Message.selectByDialogIdSql",
                        query = "SELECT m FROM Message m WHERE m.dialogId = :dialogId"
                ),
                @NamedQuery(
                        name = "Message.selectByDialogIdOrderedDescByDateSql",
                        query = "SELECT m FROM Message m WHERE m.dialogId = :dialogId ORDER BY m.date DESC"
                )
        }
)
public class Message implements Serializable, WithId<Long> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "text", nullable = false)
    private String text;
    @Column(name = "date", nullable = false)
    //@Temporal(TemporalType.TIMESTAMP)
    private Timestamp date;
    @Column(name = "dialogId", nullable = false)
    private long dialogId;
    @Column(name = "authorId", nullable = false)
    private long authorId;
    @ManyToOne(fetch = FetchType.LAZY)
    private Dialog dialog;
    @ManyToOne(fetch = FetchType.LAZY)
    private Account author;

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

    public Dialog getDialog() { return dialog; }

    public void setDialog(Dialog dialog) { this.dialog = dialog; }

    public Account getAuthor() { return author; }

    public void setAuthor(Account author) { this.author = author; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return id == message.id && dialogId == message.dialogId && authorId == message.authorId && text.equals(message.text) && date.equals(message.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, text, date, dialogId, authorId);
    }
}
