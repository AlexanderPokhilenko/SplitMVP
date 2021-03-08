package com.tikaytech.Split;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class CookiesTools {
    private static long getId(HttpServletRequest request, String name) {
        Cookie idCookie = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    idCookie = cookie;
                    break;
                }
            }
        }
        return  (idCookie != null) ? Long.parseLong(idCookie.getValue()) : 0L;
    }

    public static long getSelectedAccountId(HttpServletRequest request) {
        return getId(request, "accountId");
    }

    public static long getMultiAccountId(HttpServletRequest request) {
        return 1; //temporary hardcoded
        //return getId(request, "multiAccountId");
    }
}
