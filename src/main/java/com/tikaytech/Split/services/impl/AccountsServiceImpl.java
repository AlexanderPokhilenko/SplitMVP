package com.tikaytech.Split.services.impl;

import com.tikaytech.Split.dao.AccountsJpaRepository;
import com.tikaytech.Split.data.Accounts;
import com.tikaytech.Split.data.entities.Account;
import com.tikaytech.Split.services.AccountsService;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.List;

@Stateless(name = "AccountsService")
public class AccountsServiceImpl implements AccountsService {
    @EJB
    private AccountsJpaRepository accountDao;

    @Override
    public Accounts getByMultiAccountId(long id) {
        List<Account> accountsList = accountDao.getByMultiAccountId(id);
        return new Accounts(0, accountsList);
    }
}
