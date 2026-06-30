package com.ludo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private GameRoom gameRoom;

    @Column(nullable = false)
    private String color; // RED, GREEN, YELLOW, BLUE

    private boolean isHost;

    public Player() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public GameRoom getGameRoom() { return gameRoom; }
    public void setGameRoom(GameRoom gameRoom) { this.gameRoom = gameRoom; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public boolean isHost() { return isHost; }
    public void setHost(boolean host) { isHost = host; }
}
