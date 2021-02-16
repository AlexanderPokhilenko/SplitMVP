<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<t:mainWrapper>
    <jsp:attribute name="sidebarElements">
        <jsp:include page="WEB-INF/parts/sidebarTop.jsp"/>
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <a class="nav-item nav-link" id="nav-pages-tab" data-toggle="tab" href="#nav-pages" role="tab" aria-controls="nav-pages" aria-selected="true">Pages</a>
                <a class="nav-item nav-link active" id="nav-dialogs-tab" data-toggle="tab" href="#nav-dialogs" role="tab" aria-controls="nav-dialogs" aria-selected="false">Dialogs</a>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <!-- Pages -->
            <div class="tab-pane fade" id="nav-pages" role="tabpanel" aria-labelledby="nav-pages-tab">
                <a href="./index.jsp" class="list-group-item list-group-item-action bg-light">Main</a>
                <a href="./dialogs" class="list-group-item list-group-item-action bg-light">Dialogs <span class="badge badge-danger" id="newDialogsSpan">5</span></a>
                <a href="./index.jsp" class="list-group-item list-group-item-action bg-light">My comments <span class="badge badge-danger" id="newAnswersSpan">3</span></a>
                <a href="./settings.html" class="list-group-item list-group-item-action bg-light">Settings</a>
            </div>
            <!-- Dialogs -->
            <div class="tab-pane fade show active" id="nav-dialogs" role="tabpanel" aria-labelledby="nav-dialogs-tab">
                    <%--@elvariable id="previews" type="com.tikaytech.Split.DialogPreview[]"--%>
                <c:forEach var="preview" items="${previews}">
                    <div class="d-flex flex-row justify-content-between p-1 border border-secondary position-relative">
                        <!-- Profile picture -->
                        <div class="image mr-2"><img src="${preview.interlocutor.imageUrl}" class="thumbnail rounded-circle" alt="Interlocutor's profile picture"/></div>
                        <div class="d-flex flex-column flex-fill justify-content-between  overflow-auto">
                            <div>
                                <!-- Username -->
                                <span class="flex-fill text-cut font-weight-bold">
                                    <c:out value="${preview.interlocutor.username}"/>
                                </span>
                                <fmt:formatDate value="${preview.date}" pattern="hh:mm:ss dd.MM.yyyy" var="fullDate"/>
                                <span class="float-right">
                                    <fmt:formatDate value="${preview.date}" pattern="hh:mm"/>
                                </span>
                            </div>
                            <span class="flex-fill text-cut">
                                <c:if test="${cookie.accountId.value == preview.lastSenderId}"> <strong>You:</strong> </c:if>
                                <c:out value="${preview.text}"/>
                            </span>
                        </div>
                        <a href="./dialogs?id=${preview.id}" class="stretched-link" title="Sent at: ${fullDate}"></a>
                    </div>
                </c:forEach>
            </div>
        </div>
    </jsp:attribute>

    <jsp:attribute name="styles">
        <link rel="stylesheet" href="./css/dialogs.css">
    </jsp:attribute>

    <jsp:attribute name="scripts">
        <script>$(document).ready(function() { $("#messages-container").animate({ scrollTop: $("#messages-container").prop("scrollHeight") }, 500); });</script>
    </jsp:attribute>

    <jsp:body>
        <%--@elvariable id="interlocutor" type="com.tikaytech.Split.Account"--%>
        <c:choose>
            <c:when test="${interlocutor == null}">
                <h3 class="text-center">Choose dialog to start</h3>
            </c:when>
            <c:otherwise>
                <div class="container flex-fill h-100 position-relative">
                    <div class="row position-absolute w-100 h-100">
                        <div class="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 border border-dark p-0 d-flex flex-column h-100">
                            <!-- Dialog header -->
                            <div class="d-flex flex-row justify-content-between p-1 border border-dark bg-light">
                                <!-- Profile picture -->
                                <div class="image mr-2"><img src="${interlocutor.imageUrl}" class="thumbnail rounded-circle" alt="Current interlocutor's profile picture"/></div>
                                <!-- Username -->
                                <span class="flex-fill align-self-center font-weight-bold">
                                    <c:out value="${interlocutor.username}"/>
                                </span>
                            </div>
                            <!-- Dialog container -->
                            <div id="messages-container" class="d-flex flex-column p-1 border border-dark border-bottom-0 overflow-auto flex-fill">
                                <!-- Messages -->
                                    <%--@elvariable id="messages" type="java.util.ArrayList<com.tikaytech.Split.Message>"--%>
                                <c:forEach var="message" items="${messages}">
                                    <c:choose>
                                        <c:when test="${message.authorId == cookie.accountId.value}">
                                            <c:set var="messageAlign" value="align-self-end"/>
                                        </c:when>
                                        <c:otherwise>
                                            <c:set var="messageAlign" value="align-self-start"/>
                                        </c:otherwise>
                                    </c:choose>
                                    <fmt:formatDate value="${message.date}" pattern="hh:mm:ss dd.MM.yyyy" var="fullDate"/>
                                    <div class="w-75 p-2 my-1 rounded border border-dark ${messageAlign}">
                                        <span class="text-break">
                                            <c:out value="${message.text}"/>
                                        </span>
                                        <span class="float-right" title="${fullDate}">
                                            <fmt:formatDate value="${message.date}" pattern="hh:mm"/>
                                        </span>
                                    </div>
                                </c:forEach>
                            </div>
                            <!-- Input -->
                            <form action="./dialogs" method="post">
                                <input type="hidden" name="id" value="${param["id"]}">
                                <div class="input-group h-5">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-secondary" type="button" title="Attach file.">📎</button>
                                    </div>
                                    <textarea class="message-area form-control h-100" placeholder="Write message..." name="text"></textarea>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="submit" title="Send message.">➤</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </c:otherwise>
        </c:choose>
    </jsp:body>
</t:mainWrapper>
