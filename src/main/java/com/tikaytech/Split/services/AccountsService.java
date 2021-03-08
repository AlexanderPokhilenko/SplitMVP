package com.tikaytech.Split.services;

import com.tikaytech.Split.data.Accounts;

import javax.ejb.Remote;

@Remote
public interface AccountsService {
    Accounts getByMultiAccountId(long id);
}
