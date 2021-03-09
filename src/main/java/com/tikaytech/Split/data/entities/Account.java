package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "Accounts")
@NamedQueries(
        {
                @NamedQuery(
                        name = "Account.getByMultiAccountId",
                        query = "SELECT a FROM Account a where a.multiAccountId = :multiAccountId"
                ),
                @NamedQuery(
                        name = "Account.selectByDialogIdSql",
                        query = "SELECT a FROM Account a where a.id IN (SELECT dm.accountId FROM DialogMember dm WHERE dm.dialogId = :dialogId)"
                ),
                @NamedQuery(
                        name = "Account.selectByDialogIdExceptMultiAccountIdSql",
                        query = "SELECT a FROM Account a where a.id IN (SELECT dm.accountId FROM DialogMember dm WHERE dm.dialogId = :dialogId) " +
                                "AND a.multiAccountId <> :multiAccountId"
                ),
                @NamedQuery(
                        name = "Account.selectByDialogIdAndMultiAccountIdSql",
                        query = "SELECT a FROM Account a where a.id IN (SELECT dm.accountId FROM DialogMember dm WHERE dm.dialogId = :dialogId) " +
                                "AND a.multiAccountId = :multiAccountId ORDER BY a.id"
                )
        }
)
public class Account implements Serializable, WithId<Long> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "username", nullable = false)
    private String username;
    @Column(name = "imageUrl", nullable = true)
    private String imageUrl;
    @Column(name = "multiAccountId", nullable = false)
    private long multiAccountId;
    @OneToMany(mappedBy = "account")
    private Set<DialogMember> membership;
    @OneToMany(mappedBy = "author")
    private Set<Message> messages;

    public Account() {
        this(0, "Anonymous", "./icon.png", 0);
    }

    public Account(long id, String username, String imageUrl, long multiAccountId) {
        this.id = id;
        this.username = username;
        this.imageUrl = imageUrl;
        this.multiAccountId = multiAccountId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getMultiAccountId() { return multiAccountId; }

    public void setMultiAccountId(long multiAccountId) { this.multiAccountId = multiAccountId; }

    public Set<DialogMember> getMembership() { return membership; }

    public void setMembership(Set<DialogMember> membership) { this.membership = membership; }

    public Set<Message> getMessages() { return messages; }

    public void setMessages(Set<Message> messages) { this.messages = messages; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Account account = (Account) o;
        return id == account.id && multiAccountId == account.multiAccountId && username.equals(account.username) && Objects.equals(imageUrl, account.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, imageUrl, multiAccountId);
    }
}
