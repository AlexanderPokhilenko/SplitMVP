package com.tikaytech.Split.data;

import com.tikaytech.Split.data.entities.Account;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Accounts implements Serializable {
    private long selectedId;
    private List<Account> accounts;

    public Accounts() {
        this(0, new ArrayList<Account>(1) {{ new Account(); }});
    }

    public Accounts(long selectedId, List<Account> accounts) {
        this.selectedId = selectedId;
        this.accounts = accounts;
    }

    public long getSelectedId() {
        return selectedId;
    }

    public void setSelectedId(long selectedId) {
        this.selectedId = selectedId;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    public Account getSelected() {
        for (Account account : accounts) {
            if (account.getId() == selectedId) return account;
        }
        return new Account(0, "Multi-account", "./icon.png", 0);
    }
}
