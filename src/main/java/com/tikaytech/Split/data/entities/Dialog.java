package com.tikaytech.Split.data.entities;

import com.tikaytech.Split.data.WithId;

import java.io.Serializable;

public class Dialog implements Serializable, WithId<Long> {
    private long id;
    private String name;
    private String imageUrl;

    public Dialog() {
        this(0L, "Unknown Dialog", "./icon.png");
    }

    public Dialog(long id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
