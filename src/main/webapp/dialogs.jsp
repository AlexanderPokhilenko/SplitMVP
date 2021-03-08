<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%--@elvariable id="previews" type="java.util.List<com.tikaytech.Split.data.DialogPreview>"--%>
<%--@elvariable id="currentPreview" type="com.tikaytech.Split.data.DialogPreview"--%>
<%--@elvariable id="interlocutors" type="java.util.List<com.tikaytech.Split.data.entities.Account>"--%>
<%--@elvariable id="messages" type="java.util.List<com.tikaytech.Split.data.entities.Message>"--%>
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
                <a href="./dialogs" class="list-group-item list-group-item-action bg-light">Dialogs</a>
                <a href="./index.jsp" class="list-group-item list-group-item-action bg-light">My comments</a>
                <a href="./settings.html" class="list-group-item list-group-item-action bg-light">Settings</a>
            </div>
            <!-- Dialogs -->
            <div class="tab-pane fade show active" id="nav-dialogs" role="tabpanel" aria-labelledby="nav-dialogs-tab">
                <c:forEach var="preview" items="${previews}">
                    <div class="d-flex flex-row justify-content-between p-1 border border-secondary position-relative">
                        <!-- Profile picture -->
                        <div class="image mr-2"><img src="${preview.pictureSrc}" class="thumbnail rounded-circle" alt="Interlocutor's profile picture"/></div>
                        <div class="d-flex flex-column flex-fill justify-content-between  overflow-auto">
                            <div class="d-flex flex-row">
                                <!-- Username -->
                                <span class="flex-fill text-cut font-weight-bold">
                                    <c:out value="${preview.name}"/>
                                </span>
                                <span class="float-right">
                                    <c:out value="${preview.dateTimeStr}"/>
                                </span>
                            </div>
                            <span class="flex-fill text-cut">
                                <c:choose>
                                    <c:when test="${cookie.accountId.value == preview.lastAuthor.id}">
                                        <strong>You:</strong>
                                    </c:when>
                                    <c:when test="${!(interlocutors.size() == 1)}">
                                        <strong><c:out value="${preview.lastAuthor.username}"/>:</strong>
                                    </c:when>
                                    <c:otherwise>
                                        <strong><c:out value="${preview.lastAuthor.username}"/>:</strong>
                                    </c:otherwise>
                                </c:choose>
                                <c:out value="${preview.text}"/>
                            </span>
                        </div>
                        <a href="./dialogs?id=${preview.id}" class="stretched-link"></a>
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
        <c:choose>
            <c:when test="${interlocutors == null}">
                <h3 class="text-center">Choose dialog to start</h3>
            </c:when>
            <c:otherwise>
                <div class="container flex-fill h-100 position-relative">
                    <div class="row position-absolute w-100 h-100">
                        <div class="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 border border-dark p-0 d-flex flex-column h-100">
                            <!-- Dialog header -->
                            <div class="d-flex flex-row justify-content-between p-1 border border-dark bg-light">
                                <!-- Dialog picture -->
                                <div class="image mr-2"><img src="${currentPreview.pictureSrc}" class="thumbnail rounded-circle" alt="Current interlocutor's profile picture"/></div>
                                <!-- Name -->
                                <span class="flex-fill align-self-center font-weight-bold">
                                    <c:out value="${currentPreview.name}"/>
                                </span>
                                <c:if test="${!currentPreview.direct}">
                                    <!-- Members -->
                                    <button type="button" class="btn dropdown-toggle fit-cell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-placement="right"></button>
                                    <div class="dropdown-menu block-container dropdown-menu-right">
                                        <c:forEach var="interlocutor" items="${interlocutors}">
                                        <div class="dropdown-item d-flex flex-row justify-content-between mt-2 px-2 position-relative">
                                            <div class="image mr-3">
                                                <img src="${interlocutor.imageUrl}" class="small-thumbnail rounded-circle" alt="Account picture"/>
                                            </div>
                                            <span class="flex-fill align-self-center ${interlocutor.id == cookie.accountId.value ? "font-weight-bold" : ""}"><c:out value="${interlocutor.username}"/></span>
                                        </div>
                                        </c:forEach>
                                    </div>
                                </c:if>
                            </div>
                            <!-- Dialog container -->
                            <div id="messages-container" class="d-flex flex-column p-1 border border-dark border-bottom-0 overflow-auto flex-fill">
                                <!-- Messages -->
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
                                        <c:if test="${!currentPreview.direct}">
                                                <span class="text-break d-block">
                                                    <%--@elvariable id="messageAuthor" type="com.tikaytech.Split.data.entities.Account"--%>
                                                    <c:set var="messageAuthor" value="${interlocutors.stream().filter(a -> a.id == message.authorId).findFirst().get()}" />
                                                    <img class="small-thumbnail rounded-circle" alt="Author profile picture" src="${messageAuthor.imageUrl}">
                                                    <strong><c:out value="${messageAuthor.username}"/></strong>
                                                </span>
                                        </c:if>
                                        <span class="text-break">
                                            <c:out value="${message.text}"/>
                                        </span>
                                        <span class="float-right" title="${fullDate}">
                                            <fmt:formatDate value="${message.date}" pattern="HH:mm"/>
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
