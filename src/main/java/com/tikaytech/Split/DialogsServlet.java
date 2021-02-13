package com.tikaytech.Split;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "dialogsServlet", value = "/dialogs")
public class DialogsServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String id = request.getParameter("id");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>You opened dialog with id "+ id + "</h1>");
        out.println("<a href='./dialogs.jsp'>Go back</a>");
        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String text = request.getParameter("text");
        String id = request.getParameter("id");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>You sent to dialog with id "+ id + ":</h1>");
        out.println("<p>" + text + "</p>");
        out.println("<a href='./dialogs.jsp'>Go back</a>");
        out.println("</body></html>");
    }
}
