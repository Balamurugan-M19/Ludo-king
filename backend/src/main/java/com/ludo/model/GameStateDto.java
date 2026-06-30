package com.ludo.model;

import java.util.ArrayList;
import java.util.List;

public class GameStateDto {
    private String roomCode;
    private List<PlayerState> players;
    private int turnIndex; // 0 to players.size() - 1
    private Integer diceValue; // Null if waiting to roll
    private boolean isDiceRolled;
    private String message; // Optional message for game log

    public GameStateDto() {
        this.players = new ArrayList<>();
    }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public List<PlayerState> getPlayers() { return players; }
    public void setPlayers(List<PlayerState> players) { this.players = players; }

    public int getTurnIndex() { return turnIndex; }
    public void setTurnIndex(int turnIndex) { this.turnIndex = turnIndex; }

    public Integer getDiceValue() { return diceValue; }
    public void setDiceValue(Integer diceValue) { this.diceValue = diceValue; }

    public boolean isDiceRolled() { return isDiceRolled; }
    public void setDiceRolled(boolean isDiceRolled) { this.isDiceRolled = isDiceRolled; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
