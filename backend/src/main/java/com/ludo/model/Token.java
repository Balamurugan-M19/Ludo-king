package com.ludo.model;

public class Token {
    private int id; // 0, 1, 2, 3
    private int position; // -1 means in base, 0-51 main path, 100+ home stretch
    private boolean isHome; // true if token reached final home

    public Token() {}

    public Token(int id, int position, boolean isHome) {
        this.id = id;
        this.position = position;
        this.isHome = isHome;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public boolean isHome() { return isHome; }
    public void setHome(boolean isHome) { this.isHome = isHome; }
}
