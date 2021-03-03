package com.tikaytech.Split.servlets;

import com.tikaytech.Split.data.Account;
import com.tikaytech.Split.data.DialogPreview;
import com.tikaytech.Split.data.Message;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@WebServlet(name = "dialogsServlet", value = "/dialogs")
public class DialogsServlet extends HttpServlet {
    private Map<Long, ArrayList<Message>> dialogs; // temporary
    private Account[] interlocutors; // temporary
    private long nextMessageId; // temporary
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        dialogs = new LinkedHashMap<Long, ArrayList<Message>>(){{
            put(1L, new ArrayList<Message>(){{
                add(new Message(1L,
                        "Some text. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        Date.from(Instant.now().minus(45L, ChronoUnit.MINUTES)),
                        4L));
                add(new Message(2L,
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        Date.from(Instant.now().minus(30L, ChronoUnit.MINUTES)),
                        1L));
            }});
            put(2L, new ArrayList<Message>(){{
                add(new Message(3L,
                        "Lorem ipsum dolor sit amet?",
                        Date.from(Instant.now().minus(15L, ChronoUnit.MINUTES)),
                        5L));
            }});
        }};
        interlocutors = new Account[]{
                new Account(4L, "Interlocutor 1", "https://i.imgur.com/CFpa3nK.jpg"),
                new Account(5L, "Interlocutor 2", "https://i.imgur.com/fgrfeVu.jpg")
        };
        nextMessageId = 4L;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String id = request.getParameter("id");
        try {
            Long longId = Long.parseLong(id);
            if(dialogs.containsKey(longId)) {
                request.setAttribute("messages", dialogs.get(longId));
                request.setAttribute("interlocutor", interlocutors[(int)(longId - 1)]);
            }
        }
        catch (NumberFormatException e){
            request.setAttribute("messages", null);
        }

        DialogPreview[] previews = new DialogPreview[dialogs.size()];
        int i = 0;
        for (Map.Entry<Long, ArrayList<Message>> pair : dialogs.entrySet()) {
            Message lastMessage = pair.getValue().get(pair.getValue().size() - 1);

            DialogPreview preview = new DialogPreview( i+1,
                    lastMessage.getText(),
                    lastMessage.getDate(),
                    lastMessage.getAuthorId(),
                    interlocutors[i]);

            previews[i++] = preview;
        }
        request.setAttribute("previews", previews);

        getServletContext().getRequestDispatcher("/dialogs.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String text = request.getParameter("text");
        String id = request.getParameter("id");

        long accountId = 0L;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("accountId")) {
                    accountId =  Long.parseLong(cookie.getValue());
                    break;
                }
            }
        }

        Long longId = Long.parseLong(id);
        if(dialogs.containsKey(longId) && text != null && !text.trim().isEmpty()) {
            dialogs.get(longId).add(new Message(nextMessageId++, text, new Date(), accountId));
        }

        response.sendRedirect("./dialogs?id=" + id);
    }
}
