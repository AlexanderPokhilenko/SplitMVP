<%@ page import="com.tikaytech.Split.Account" %>
<%@ page import="com.tikaytech.Split.Accounts" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<div class="d-flex flex-row justify-content-between mt-2 p-1">
    <%
        Accounts accounts = (Accounts) request.getAttribute("accounts");
        Account selected = accounts.getSelected();
    %>
    <!-- Profile picture -->
    <div class="image mr-2"><img src="<%out.print(selected.getImageUrl());%>" class="thumbnail rounded-circle" alt="Profile picture"/></div>
    <!-- Username -->
    <span class="flex-fill align-self-center font-weight-bold"><%out.print(selected.getUsername());%></span>
    <!-- Dropdown button -->
    <button type="button" class="btn dropdown-toggle fit-cell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-placement="right"></button>
    <div class="dropdown-menu block-container">
        <a href="./accounts?id=0&redirect=<%out.print(request.getRequestURI());%>" class="dropdown-item <%if(selected.getId() == 0) out.print("font-weight-bold");%>" data-toggle="tooltip" data-placement="right" title="Operate from multi-account">Multi-account</a>
        <div class="dropdown-divider"></div>
        <!-- Accounts part -->
        <%
        for (Account account : accounts.getArray()) {
            out.println("<div class=\"dropdown-item d-flex flex-row justify-content-between mt-2 px-2 position-relative\">");
            out.println("<div class=\"image mr-3\"><img src=\"" + account.getImageUrl() + "\" class=\"small-thumbnail rounded-circle\" alt=\"Account picture\"/></div>");
            out.print("<span class=\"flex-fill align-self-center ");
            if(account.getId() == accounts.getSelectedId()) out.print("font-weight-bold");
            out.println("\">" + account.getUsername() + "</span>");
            out.println("<a href=\"./accounts?id=" + account.getId() + "&redirect=" + request.getRequestURI() + "\" class=\"stretched-link\"></a>");
            out.println("</div>");
        }
        %>
        <!-- /Accounts part -->
        <div class="dropdown-divider"></div>
        <a id="logOut" href="./signIn.html" class="dropdown-item" data-toggle="tooltip" data-placement="right" title="Sign out of multi-account">Log Out</a>
    </div>
</div>