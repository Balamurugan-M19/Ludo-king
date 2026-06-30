package com.ludo.model;

public class GameAction {
    private String type; // "ROLL_DICE", "MOVE_PIECE", "START_GAME"
    private String roomCode;
    private Long playerId;
    private Integer pieceIndex; // 0, 1, 2, 3 for the 4 pieces a player has
    private String chatMessage;

    public GameAction() {}

    public GameAction(String type, String roomCode, Long playerId, Integer pieceIndex) {
        this.type = type;
        this.roomCode = roomCode;
        this.playerId = playerId;
        this.pieceIndex = pieceIndex;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public Integer getPieceIndex() { return pieceIndex; }
    public void setPieceIndex(Integer pieceIndex) { this.pieceIndex = pieceIndex; }

    public String getChatMessage() { return chatMessage; }
    public void setChatMessage(String chatMessage) { this.chatMessage = chatMessage; }
}
