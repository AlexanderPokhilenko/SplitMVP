package com.tikaytech.Split;

import java.io.Serializable;

public class Accounts implements Serializable {
    private int selectedId;
    private Account[] array;

    public Accounts() {
        this(0, new Account[] {new Account()});
    }

    public Accounts(int selectedId, Account[] accounts) {
        this.selectedId = selectedId;
        array = accounts;
    }

    public int getSelectedId() {
        return selectedId;
    }

    public void setSelectedId(int selectedId) {
        this.selectedId = selectedId;
    }

    public Account[] getArray() {
        return array;
    }

    public void setArray(Account[] array) {
        this.array = array;
    }

    public Account getSelected() {
        for (Account account : array) {
            if (account.getId() == selectedId) return account;
        }
        return new Account(0, "Multi-account", "./icon.png");
    }
}
