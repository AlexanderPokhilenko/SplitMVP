package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import java.io.Serializable;

public class Account implements Serializable, WithId<Long> {
    private long id;
    private String username;
    private String imageUrl;
    private long multiAccountId;

    public Account() {
        this(0, "Anonymous", "./icon.png", 0);
    }

    public Account(long id, String username, String imageUrl, long multiAccountId) {
        this.id = id;
        this.username = username;
        this.imageUrl = imageUrl;
        this.multiAccountId = multiAccountId;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getMultiAccountId() { return multiAccountId; }

    public void setMultiAccountId(long multiAccountId) { this.multiAccountId = multiAccountId; }
}
