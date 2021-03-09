package com.tikaytech.Split.filters;

import com.tikaytech.Split.CookiesTools;
import com.tikaytech.Split.data.Accounts;
import com.tikaytech.Split.services.AccountsService;

import javax.ejb.EJB;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter(filterName = "accountsFilter", value = {"/*"})
public class AccountsFilter implements Filter {
    @EJB
    private AccountsService accountsService;
/*
    public void init(FilterConfig config) throws ServletException {
    }

    public void destroy() {
    }
*/
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        long multiAccountId = CookiesTools.getMultiAccountId((HttpServletRequest) request);
        long selectedId = CookiesTools.getSelectedAccountId((HttpServletRequest) request);

        Accounts accounts = accountsService.getByMultiAccountId(multiAccountId);
        accounts.setSelectedId(selectedId);
        request.setAttribute("accounts", accounts);
        chain.doFilter(request, response);
    }
}
