package com.tikaytech.Split;

import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter(filterName = "accountsFilter", value = {"/*"})
public class AccountsFilter implements Filter {
    private Account[] stubAccounts; // temporary

    public void init(FilterConfig config) throws ServletException {
        stubAccounts = new Account[] {
                new Account(1, "First Username", "https://i.imgur.com/sicII7N.jpg"),
                new Account(2, "Second Username", "https://i.imgur.com/3tgjufY.jpg"),
                new Account(3, "Third Username", "https://i.imgur.com/WfdkN3o.jpg")
        } ;
    }

    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest req = (HttpServletRequest) request;
        Cookie accountIdCookie = null;
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("accountId")) {
                    accountIdCookie = cookie;
                    break;
                }
            }
        }
        long selectedId = (accountIdCookie != null) ? Long.parseLong(accountIdCookie.getValue()) : 0L;

        Accounts accounts = new Accounts(selectedId, stubAccounts);
        request.setAttribute("accounts", accounts);
        chain.doFilter(request, response);
    }
}
