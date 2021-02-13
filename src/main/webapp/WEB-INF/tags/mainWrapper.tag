<%@tag description="Overall Page Template" pageEncoding="UTF-8"%>
<%@attribute name="styles" fragment="true" required="false" %>
<%@attribute name="scripts" fragment="true" required="false" %>
<%@attribute name="sidebarElements" fragment="true" required="true" %>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Split</title>
        <link rel="icon" href="favicon.ico">

        <!-- Styles -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" />
        <link rel="stylesheet" href="./css/site.css">
        <jsp:invoke fragment="styles"/>

        <!-- Important JS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" crossorigin="anonymous" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" crossorigin="anonymous" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o"></script>
    </head>

    <body>
    <div class="d-flex" id="wrapper">
        <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading "><a class="text-decoration-none text-reset h3" href="./">Split</a></div>
            <div class="list-group list-group-flush">
                <jsp:invoke fragment="sidebarElements"/>
            </div>
        </div>

        <div id="page-content-wrapper" class="d-flex flex-column">
            <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <button class="btn btn-primary" id="menu-toggle">Menu</button>
                <script>$("#menu-toggle").click(function (e) { e.preventDefault(); $("#wrapper").toggleClass("toggled"); });</script>
            </nav>

            <!-- Content part -->
            <div class="container-fluid overflow-auto flex-grow-1 p-0">
                <jsp:doBody/>
            </div>
        </div>
    </div>
    <!-- Scripts -->
    <jsp:invoke fragment="scripts"/>
    </body>
</html>
