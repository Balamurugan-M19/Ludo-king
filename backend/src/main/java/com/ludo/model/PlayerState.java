package com.ludo.model;

import java.util.ArrayList;
import java.util.List;

public class PlayerState {
    private Long playerId;
    private String color; // RED, GREEN, YELLOW, BLUE
    private List<Token> tokens;
    private boolean hasFinished;

    public PlayerState() {
        this.tokens = new ArrayList<>();
    }

    public PlayerState(Long playerId, String color) {
        this.playerId = playerId;
        this.color = color;
        this.tokens = new ArrayList<>();
        // Initialize 4 tokens in base
        for (int i = 0; i < 4; i++) {
            this.tokens.add(new Token(i, -1, false));
        }
        this.hasFinished = false;
    }

    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<Token> getTokens() { return tokens; }
    public void setTokens(List<Token> tokens) { this.tokens = tokens; }

    public boolean isHasFinished() { return hasFinished; }
    public void setHasFinished(boolean hasFinished) { this.hasFinished = hasFinished; }
}
