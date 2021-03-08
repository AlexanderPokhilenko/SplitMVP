package com.tikaytech.Split.servlets;

import com.tikaytech.Split.CookiesTools;
import com.tikaytech.Split.dao.impl.AccountDaoImpl;
import com.tikaytech.Split.dao.impl.DialogDaoImpl;
import com.tikaytech.Split.dao.impl.MessageDaoImpl;
import com.tikaytech.Split.data.DialogPreview;
import com.tikaytech.Split.data.entities.Message;
import com.tikaytech.Split.services.DialogsService;
import com.tikaytech.Split.services.impl.DialogsServiceImpl;

import javax.ejb.EJB;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.*;

@WebServlet(name = "dialogsServlet", value = "/dialogs")
public class DialogsServlet extends HttpServlet {
    @EJB
    private DialogsService dialogsService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long accountId = CookiesTools.getSelectedAccountId(request);
        long multiAccountId = CookiesTools.getMultiAccountId(request);

        String dialogStrId = request.getParameter("id");
        try {
            long dialogId = Long.parseLong(dialogStrId);
            if(!dialogsService.isMemberOfDialog(accountId, dialogId)) {
                Optional<Long> optionalAccountId = dialogsService.getIdOfFirstMemberOfDialog(dialogId, multiAccountId);
                if(optionalAccountId.isPresent()) {
                    response.sendRedirect("./accounts?id=" + optionalAccountId.get() + "&redirect=./dialogs?id=" + dialogStrId);
                }
                else {
                    response.sendRedirect("./dialogs");
                }
                return;
            }

            request.setAttribute("messages", dialogsService.getDialogMessages(dialogId));
            request.setAttribute("interlocutors", dialogsService.getInterlocutors(dialogId));
            request.setAttribute("currentPreview", dialogsService.getPreviewByDialogId(dialogId, multiAccountId).get());
        }
        catch (NumberFormatException e){
            request.setAttribute("messages", null);
            request.setAttribute("interlocutors", null);
        }

        List<DialogPreview> previews = accountId != 0L ?
                dialogsService.getPreviewsForAccount(accountId) :
                dialogsService.getPreviewsForMultiAccount(CookiesTools.getMultiAccountId(request));
        request.setAttribute("previews", previews);

        getServletContext().getRequestDispatcher("/dialogs.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String text = request.getParameter("text");
        String id = request.getParameter("id");

        long dialogId = Long.parseLong(id);
        long accountId = CookiesTools.getSelectedAccountId(request);

        if(dialogsService.isMemberOfDialog(accountId, dialogId)) {
            dialogsService.sendMessage(accountId, dialogId, text);
        }

        response.sendRedirect("./dialogs?id=" + id);
    }
}
