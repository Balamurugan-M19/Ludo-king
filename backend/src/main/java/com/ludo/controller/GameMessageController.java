package com.ludo.controller;

import com.ludo.model.GameAction;
import com.ludo.model.GameStateDto;
import com.ludo.model.GameRoom;
import com.ludo.repository.GameRoomRepository;
import com.ludo.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class GameMessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameService gameService;
    
    @Autowired
    private GameRoomRepository roomRepository;

    @MessageMapping("/game/{roomId}/action")
    public void handleGameAction(@DestinationVariable String roomId, @Payload GameAction action) {
        GameStateDto state = null;

        if ("JOIN_ROOM".equals(action.getType())) {
            Optional<GameRoom> roomOpt = roomRepository.findByRoomCode(roomId);
            if (roomOpt.isPresent()) {
                state = gameService.syncPlayers(roomId, roomOpt.get().getPlayers());
            }
        } else {
            state = gameService.getGameState(roomId);
            if (state != null) {
                if ("ROLL_DICE".equals(action.getType())) {
                    state = gameService.rollDice(roomId, action.getPlayerId());
                } else if ("MOVE_PIECE".equals(action.getType())) {
                    state = gameService.moveToken(roomId, action.getPlayerId(), action.getPieceIndex());
                } else if ("CHAT_MESSAGE".equals(action.getType())) {
                    state = gameService.handleChat(roomId, action.getPlayerId(), action.getChatMessage());
                } else if ("PASS_TURN".equals(action.getType())) {
                    state = gameService.handlePassTurn(roomId, action.getPlayerId());
                }
            }
        }
        
        if (state != null) {
            // Broadcast the updated state
            messagingTemplate.convertAndSend("/topic/game/" + roomId, state);
        }
    }
}
