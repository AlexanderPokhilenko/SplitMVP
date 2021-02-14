package com.tikaytech.Split;

import java.io.Serializable;

public class Account implements Serializable {
    private String username;
    private String imageUrl;
    private int id;

    public Account() {
        this(0, "Anonymous", "https://i.imgur.com/sicII7N.jpg");
    }

    public Account(int id, String username, String imageUrl) {
        this.id = id;
        this.username = username;
        this.imageUrl = imageUrl;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
