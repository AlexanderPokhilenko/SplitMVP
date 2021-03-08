package com.tikaytech.Split.services.impl;

import com.tikaytech.Split.dao.AccountDao;
import com.tikaytech.Split.data.Accounts;
import com.tikaytech.Split.data.entities.Account;
import com.tikaytech.Split.services.AccountsService;

import java.util.List;

public class AccountsServiceImpl implements AccountsService {
    private final AccountDao accountDao;

    public AccountsServiceImpl(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @Override
    public Accounts getByMultiAccountId(long id) {
        List<Account> accountsList = accountDao.getByMultiAccountId(id);
        return new Accounts(0, accountsList);
    }
}
