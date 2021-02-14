package com.tikaytech.Split;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "accountsServlet", value = "/accounts")
public class AccountsServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String id = request.getParameter("id");

        Cookie accountIdCookie = new Cookie("accountId", id);
        accountIdCookie.setMaxAge(-1);
        accountIdCookie.setValue(id);

        response.addCookie(accountIdCookie);

        String redirect = request.getParameter("redirect");
        response.sendRedirect(redirect);
    }
}
