package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "DialogsMembers")
@NamedQuery(
        name = "DialogMember.isMemberOfDialogSql",
        query = "SELECT CASE WHEN (COUNT (dm) > 0) THEN TRUE ELSE FALSE END FROM DialogMember dm WHERE dm.accountId = :accountId AND dm.dialogId = :dialogId"
)
public class DialogMember implements Serializable, WithId<Long> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "dialogId", nullable = false)
    private long dialogId;
    @Column(name = "accountId", nullable = false)
    private long accountId;
    @ManyToOne(fetch = FetchType.LAZY)
    private Dialog dialog;
    @ManyToOne(fetch = FetchType.LAZY)
    private Account account;

    public DialogMember() {
        this(0, 0, 0);
    }

    public DialogMember(long id, long dialogId, long accountId) {
        this.id = id;
        this.dialogId = dialogId;
        this.accountId = accountId;
    }

    @Override
    public Long getId() { return id; }

    @Override
    public void setId(Long id) { this.id = id; }

    public long getDialogId() { return dialogId; }

    public void setDialogId(long dialogId) { this.dialogId = dialogId; }

    public long getAccountId() { return accountId; }

    public void setAccountId(long authorId) { this.accountId = authorId; }

    public Dialog getDialog() { return dialog; }

    public void setDialog(Dialog dialog) { this.dialog = dialog; }

    public Account getAccount() { return account; }

    public void setAccount(Account account) { this.account = account; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DialogMember that = (DialogMember) o;
        return id == that.id && dialogId == that.dialogId && accountId == that.accountId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, dialogId, accountId);
    }
}
