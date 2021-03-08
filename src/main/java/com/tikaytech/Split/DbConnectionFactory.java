package com.tikaytech.Split;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbConnectionFactory {
    public static final String url = "jdbc:postgresql://localhost:5432/splitdb";
    public static final String user = "postgres";
    public static final String password = "split_temp_pwd";

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver").getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(url, user, password);
    }
}
