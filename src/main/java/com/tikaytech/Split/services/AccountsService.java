package com.tikaytech.Split.services;

import com.tikaytech.Split.data.Accounts;

public interface AccountsService {
    Accounts getByMultiAccountId(long id);
}
