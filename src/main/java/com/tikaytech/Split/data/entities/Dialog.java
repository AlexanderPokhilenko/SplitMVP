package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "Dialogs")
@NamedQueries(
        {
                @NamedQuery(
                        name = "Dialog.selectByAccountIdSql",
                        query = "SELECT d FROM Dialog d WHERE d.id IN (SELECT dm.dialogId FROM DialogMember dm WHERE dm.accountId = :accountId)"
                ),
                @NamedQuery(
                        name = "Dialog.selectByMultiAccountIdSql",
                        query = "SELECT d FROM Dialog d WHERE d.id IN (SELECT dm.dialogId FROM DialogMember dm WHERE dm.accountId IN " +
                                "(SELECT a.id FROM Account a WHERE a.multiAccountId = :multiAccountId))"
                )
        }
)
public class Dialog implements Serializable, WithId<Long> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "name", nullable = true)
    private String name;
    @Column(name = "imageUrl", nullable = true)
    private String imageUrl;
    @OneToMany(mappedBy = "dialog")
    private Set<DialogMember> membership;
    @OneToMany(mappedBy = "dialog")
    private Set<Message> messages;

    public Dialog() {
        this(0L, "Unknown Dialog", "./icon.png");
    }

    public Dialog(long id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<DialogMember> getMembership() { return membership; }

    public void setMembership(Set<DialogMember> membership) { this.membership = membership; }

    public Set<Message> getMessages() { return messages; }

    public void setMessages(Set<Message> messages) { this.messages = messages; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dialog dialog = (Dialog) o;
        return id == dialog.id && Objects.equals(name, dialog.name) && Objects.equals(imageUrl, dialog.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, imageUrl);
    }
}
