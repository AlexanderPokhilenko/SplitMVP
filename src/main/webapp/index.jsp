<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:mainWrapper>
    <jsp:attribute name="sidebarElements">
      <jsp:include page="WEB-INF/parts/sidebarTop.jsp"/>
      <a href="./index.jsp" class="list-group-item list-group-item-action bg-light">Main</a>
      <a href="dialogs.jsp" class="list-group-item list-group-item-action bg-light">Dialogs <span class="badge badge-danger" id="newDialogsSpan">5</span></a>
      <a href="./index.jsp" class="list-group-item list-group-item-action bg-light">My comments <span class="badge badge-danger" id="newAnswersSpan">3</span></a>
      <a href="./settings.html" class="list-group-item list-group-item-action bg-light">Settings</a>
    </jsp:attribute>

    <jsp:attribute name="scripts">
        <script src="./js/posts.js"></script>
    </jsp:attribute>

    <jsp:body>
        <div class="container position-relative">
            <div class="row position-absolute w-100">
                <div class="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 pb-4">
                    <!-- Posts -->
                    <div class="message mt-4 text-justify float-left" data-message-id="1">
                        <!-- Header -->
                        <div class="d-flex flex-row justify-content-between p-1">
                            <span class="flex-fill align-self-center">
                                <img src="https://i.imgur.com/yTFUilP.jpg" class="small-thumbnail rounded-circle" alt="Group's profile picture">
                                <strong>Group name</strong>, posted by
                                <img src="https://i.imgur.com/CFpa3nK.jpg" class="small-thumbnail rounded-circle" alt="Author's profile picture">
                                <strong>Author's Username</strong> <em>1 hour ago</em>
                            </span>
                        </div>
                        <!-- Content -->
                        <div class="px-2">
                            <p>Some text. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <!-- Tags -->
                        <div class="mt-3">
                            <!-- Whitelist -->
                            <div>
                                <span class="tag tag-whitelist tag-matched">Tag 1</span>
                                <span class="tag tag-whitelist tag-matched">Tag 2</span>
                                <span class="tag tag-whitelist">Tag 3</span>
                                <span class="tag tag-lightgraylist">Tag 4</span>
                                <span class="tag tag-lightgraylist">Tag 5</span>
                                <button type="button" class="btn btn-add-white-tag btn-outline-dark btn-small-circle">➕</button>
                            </div>
                            <!-- Blacklist -->
                            <div>
                                <span class="tag tag-blacklist tag-matched">Tag 6</span>
                                <span class="tag tag-blacklist">Tag 7</span>
                                <span class="tag tag-darkgraylist">Tag 8</span>
                                <span class="tag tag-darkgraylist">Tag 9</span>
                                <button type="button" class="btn btn-add-black-tag btn-outline-dark btn-small-circle">➕</button>
                            </div>
                        </div>
                        <!-- Bottom -->
                        <div class="d-flex flex-row justify-content-start p-1">
                            <button type="button" class="btn btn-like align-self-center py-0">🡅</button>
                            <span class="align-self-center">React</span>
                            <button type="button" class="btn btn-dislike align-self-center py-0">🡇</button>
                            <button type="button" class="btn btn-comment align-self-center py-0">🗨 Comment</button>
                        </div>
                    </div>


                    <div class="message mt-4 text-justify float-left" data-message-id="2">
                        <!-- Header -->
                        <div class="d-flex flex-row justify-content-between p-1">
                            <span class="flex-fill align-self-center">
                                <img src="https://i.imgur.com/yMH7GKz.png" class="small-thumbnail rounded-circle" alt="Group's profile picture">
                                <strong>Group name 2</strong>, posted by
                                <img src="https://i.imgur.com/CFpa3nK.jpg" class="small-thumbnail rounded-circle" alt="Author's profile picture">
                                <strong>Author's Username</strong> <em>2 hours ago</em>
                            </span>
                        </div>
                        <!-- Content -->
                        <div class="px-2">
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus numquam assumenda hic aliquam vero sequi velit molestias doloremque molestiae dicta?</p>
                            <img src="https://i.imgur.com/5fBj8A0.jpg" class="rounded mx-auto d-block mw-100" alt="Attached image">
                        </div>
                        <!-- Tags -->
                        <div class="mt-3">
                            <!-- Whitelist -->
                            <div>
                                <span class="tag tag-whitelist tag-matched">Tag 1</span>
                                <span class="tag tag-whitelist tag-matched">Tag 2</span>
                                <span class="tag tag-whitelist">Tag 3</span>
                                <span class="tag tag-lightgraylist">Tag 4</span>
                                <span class="tag tag-lightgraylist">Tag 5</span>
                                <button type="button" class="btn btn-add-white-tag btn-outline-dark btn-small-circle">➕</button>
                            </div>
                            <!-- Blacklist -->
                            <div>
                                <span class="tag tag-blacklist tag-matched">Tag 6</span>
                                <span class="tag tag-blacklist">Tag 7</span>
                                <span class="tag tag-darkgraylist">Tag 8</span>
                                <span class="tag tag-darkgraylist">Tag 9</span>
                                <button type="button" class="btn btn-add-black-tag btn-outline-dark btn-small-circle">➕</button>
                            </div>
                        </div>
                        <!-- Bottom -->
                        <div class="d-flex flex-row justify-content-start p-1">
                            <button type="button" class="btn btn-like align-self-center py-0">🡅</button>
                            <span class="align-self-center">React</span>
                            <button type="button" class="btn btn-dislike align-self-center py-0">🡇</button>
                            <button type="button" class="btn btn-comment align-self-center py-0">🗨 Comment</button>
                        </div>
                    </div>


                    <div class="message mt-4 text-justify float-left"  data-message-id="3">
                        <!-- Header -->
                        <div class="d-flex flex-row justify-content-between p-1">
                            <span class="flex-fill align-self-center">
                                <img src="https://i.imgur.com/v6x88XE.jpg" class="small-thumbnail rounded-circle" alt="Group's profile picture">
                                <strong>Group name 3</strong>, posted by
                                <img src="https://i.imgur.com/CFpa3nK.jpg" class="small-thumbnail rounded-circle" alt="Author's profile picture">
                                <strong>Author's Username</strong> <em>5 hours ago</em>
                            </span>
                        </div>
                        <!-- Content -->
                        <div class="d-flex flex-row justify-content-between px-2">
                            <span class="flex-fill align-self-center">This post contain inappropriate tags. Your settings are configured to warn you about it.</span>
                            <button type="button" class="btn align-self-center font-weight-bold">View</button>
                        </div>
                        <!-- Tags -->
                        <div class="mt-3">
                            <!-- Whitelist -->
                            <div>
                                <span class="tag tag-whitelist tag-inappropriate">Tag 10</span>
                                <span class="tag tag-whitelist tag-matched">Tag 11</span>
                                <span class="tag tag-whitelist">Tag 3</span>
                                <span class="tag tag-lightgraylist">Tag 4</span>
                            </div>
                            <!-- Blacklist -->
                            <div>
                                <span class="tag tag-blacklist tag-matched">Tag 6</span>
                                <span class="tag tag-blacklist tag-inappropriate">Tag 12</span>
                                <span class="tag tag-darkgraylist">Tag 8</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </jsp:body>
</t:mainWrapper>