package com.tikaytech.Split;

import java.io.Serializable;

public class Account implements Serializable {
    private String username;
    private String imageUrl;
    private long id;

    public Account() {
        this(0, "Anonymous", "https://i.imgur.com/sicII7N.jpg");
    }

    public Account(long id, String username, String imageUrl) {
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
