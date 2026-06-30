package com.ludo.controller;

import com.ludo.model.GameRoom;
import com.ludo.model.Player;
import com.ludo.model.User;
import com.ludo.repository.GameRoomRepository;
import com.ludo.repository.PlayerRepository;
import com.ludo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private GameRoomRepository gameRoomRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PlayerRepository playerRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestParam Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");
        
        GameRoom room = new GameRoom();
        room.setRoomCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        room.setStatus("WAITING");
        
        // Initial empty board state (just an example, could be a JSON object)
        room.setGameStateJson("{}"); 
        
        GameRoom savedRoom = gameRoomRepository.save(room);
        
        Player host = new Player();
        host.setUser(userOpt.get());
        host.setGameRoom(savedRoom);
        host.setColor("RED"); // Default first player color
        host.setHost(true);
        playerRepository.save(host);
        
        return ResponseEntity.ok(gameRoomRepository.findById(savedRoom.getId()).get());
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@RequestParam String roomCode, @RequestParam Long userId) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) return ResponseEntity.badRequest().body("Room not found");
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");
        
        GameRoom room = roomOpt.get();
        if (room.getPlayers().size() >= 4) {
            return ResponseEntity.badRequest().body("Room is full");
        }
        
        // Check if user is already in the room
        boolean alreadyInRoom = room.getPlayers().stream().anyMatch(p -> p.getUser().getId().equals(userId));
        if (alreadyInRoom) {
            return ResponseEntity.ok(room);
        }

        String[] colors = {"RED", "GREEN", "YELLOW", "BLUE"};
        String assignedColor = colors[room.getPlayers().size()];

        Player newPlayer = new Player();
        newPlayer.setUser(userOpt.get());
        newPlayer.setGameRoom(room);
        newPlayer.setColor(assignedColor);
        newPlayer.setHost(false);
        playerRepository.save(newPlayer);
        
        return ResponseEntity.ok(gameRoomRepository.findById(room.getId()).get());
    }
}
