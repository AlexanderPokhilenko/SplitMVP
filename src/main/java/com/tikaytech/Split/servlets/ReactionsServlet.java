package com.tikaytech.Split.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "reactionsServlet", value = "/react")
public class ReactionsServlet extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //Can't read data as parameters if type='PUT', so use headers
        String text = request.getHeader("reaction");
        int id = request.getIntHeader("id");

        PrintWriter out = response.getWriter();
        out.println("You reacted with '" + text + "' to message with id =" + id);
    }
}
