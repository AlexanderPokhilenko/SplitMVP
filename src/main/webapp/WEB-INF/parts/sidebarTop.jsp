<%@ page import="com.tikaytech.Split.data.Account" %>
<%@ page import="com.tikaytech.Split.data.Accounts" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<div class="d-flex flex-row justify-content-between mt-2 p-1">
    <%
        Accounts accounts = (Accounts) request.getAttribute("accounts");
        Account selected = accounts.getSelected();
        Object redirectUrl = request.getAttribute("javax.servlet.forward.request_uri");
        if(redirectUrl == null) redirectUrl = request.getRequestURI();
    %>
    <!-- Profile picture -->
    <div class="image mr-2"><img src="<%=selected.getImageUrl()%>" class="thumbnail rounded-circle" alt="Profile picture"/></div>
    <!-- Username -->
    <span class="flex-fill align-self-center font-weight-bold"><%=selected.getUsername()%></span>
    <!-- Dropdown button -->
    <button type="button" class="btn dropdown-toggle fit-cell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-placement="right"></button>
    <div class="dropdown-menu block-container">
        <a href="./accounts?id=0&redirect=<%=redirectUrl%>" class="dropdown-item <%=selected.getId() == 0L ? "font-weight-bold" : ""%>" data-toggle="tooltip" data-placement="right" title="Operate from multi-account">Multi-account</a>
        <div class="dropdown-divider"></div>
        <!-- Accounts part -->
        <% for (Account account : accounts.getArray()) { %>
            <div class="dropdown-item d-flex flex-row justify-content-between mt-2 px-2 position-relative">
            <div class="image mr-3">
                <img src="<%=account.getImageUrl()%>" class="small-thumbnail rounded-circle" alt="Account picture"/>
            </div>
            <span class="flex-fill align-self-center <%=account.getId() == accounts.getSelectedId() ? "font-weight-bold" : ""%>"><%=account.getUsername()%></span>
            <a href="./accounts?id=<%=account.getId()%>&redirect=<%=redirectUrl%>" class="stretched-link"></a>
            </div>
        <% } %>
        <!-- /Accounts part -->
        <div class="dropdown-divider"></div>
        <a id="logOut" href="./signIn.html" class="dropdown-item" data-toggle="tooltip" data-placement="right" title="Sign out of multi-account">Log Out</a>
    </div>
</div>
