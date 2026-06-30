package com.ludo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ludo.model.*;
import com.ludo.repository.GameRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    @Autowired
    private GameRoomRepository roomRepository;

    private final ObjectMapper mapper = new ObjectMapper();
    
    // In-memory state of active games for real-time performance
    private final Map<String, GameStateDto> activeGames = new ConcurrentHashMap<>();
    
    // Safe squares on the 0-51 loop
    private final Set<Integer> safeSquares = Set.of(0, 8, 13, 21, 26, 34, 39, 47);

    public GameStateDto initializeGame(String roomCode, List<Player> players) {
        GameStateDto state = new GameStateDto();
        state.setRoomCode(roomCode);
        state.setTurnIndex(0);
        state.setDiceRolled(false);
        state.setDiceValue(null);
        state.setMessage("Game started! Red's turn.");
        
        List<PlayerState> playerStates = new ArrayList<>();
        // Ensure standard order: RED, GREEN, YELLOW, BLUE
        String[] colors = {"RED", "GREEN", "YELLOW", "BLUE"};
        
        for (String c : colors) {
            for (Player p : players) {
                if (p.getColor().equals(c)) {
                    playerStates.add(new PlayerState(p.getUser().getId(), c));
                    break;
                }
            }
        }
        
        state.setPlayers(playerStates);
        activeGames.put(roomCode, state);
        
        // Persist initial state
        try {
            Optional<GameRoom> roomOpt = roomRepository.findByRoomCode(roomCode);
            if (roomOpt.isPresent()) {
                GameRoom room = roomOpt.get();
                room.setGameStateJson(mapper.writeValueAsString(state));
                room.setStatus("PLAYING");
                roomRepository.save(room);
            }
        } catch (JsonProcessingException ignored) {}
        
        return state;
    }

    public GameStateDto syncPlayers(String roomCode, List<Player> players) {
        GameStateDto state = activeGames.get(roomCode);
        if (state == null) {
            return initializeGame(roomCode, players);
        }
        
        // Only update players if they are missing
        for (Player p : players) {
            boolean exists = state.getPlayers().stream().anyMatch(ps -> ps.getPlayerId().equals(p.getUser().getId()));
            if (!exists) {
                state.getPlayers().add(new PlayerState(p.getUser().getId(), p.getColor()));
                state.setMessage(p.getUser().getUsername() + " joined the game!");
            }
        }
        return state;
    }

    public GameStateDto getGameState(String roomCode) {
        return activeGames.get(roomCode);
    }

    public GameStateDto rollDice(String roomCode, Long playerId) {
        GameStateDto state = activeGames.get(roomCode);
        if (state == null) return null;

        PlayerState currentPlayer = state.getPlayers().get(state.getTurnIndex());
        if (!currentPlayer.getPlayerId().equals(playerId)) {
            return state; // Not this player's turn
        }
        if (state.isDiceRolled()) {
            return state; // Already rolled
        }

        int roll = (int) (Math.random() * 6) + 1;

        state.setDiceValue(roll);
        state.setDiceRolled(true);
        state.setMessage(currentPlayer.getColor() + " rolled a " + roll);
        
        // If no possible moves (all in base and roll != 6), pass turn automatically
        boolean canMove = false;
        for (Token t : currentPlayer.getTokens()) {
            if (!t.isHome()) {
                if (t.getPosition() != -1 || roll == 6) {
                    canMove = true;
                    break;
                }
            }
        }
        
        if (!canMove) {
            state.setMessage(currentPlayer.getColor() + " rolled a " + roll + " but has no valid moves.");
            // Do not pass turn immediately! Let the frontend see the roll, 
            // then the frontend will send a PASS_TURN action after a delay.
        }

        return state;
    }

    public GameStateDto handlePassTurn(String roomCode, Long playerId) {
        GameStateDto state = activeGames.get(roomCode);
        if (state == null) return null;

        PlayerState currentPlayer = state.getPlayers().get(state.getTurnIndex());
        if (!currentPlayer.getPlayerId().equals(playerId)) {
            return state;
        }

        passTurn(state);
        return state;
    }

    public GameStateDto moveToken(String roomCode, Long playerId, int pieceIndex) {
        GameStateDto state = activeGames.get(roomCode);
        if (state == null || !state.isDiceRolled()) return state;

        PlayerState currentPlayer = state.getPlayers().get(state.getTurnIndex());
        if (!currentPlayer.getPlayerId().equals(playerId)) return state;

        Token token = currentPlayer.getTokens().get(pieceIndex);
        if (token.isHome()) return state; // Already finished
        
        int roll = state.getDiceValue();
        int currentPos = token.getPosition();
        String color = currentPlayer.getColor();
        
        int startIndex = getStartIndex(color);
        int entryToHomeStretch = getEntryToHomeStretch(color);
        int homeStretchBase = getHomeStretchBase(color);

        if (currentPos == -1) {
            if (roll != 6) return state; // Must roll 6 to exit base
            token.setPosition(startIndex);
            state.setMessage(color + " moved a token out of base!");
            // Turn does not pass after a 6
            state.setDiceRolled(false);
            state.setDiceValue(null);
            return state;
        }

        // Calculate new position
        int newPos = currentPos;
        boolean enteredHomeStretch = currentPos >= 100;
        
        for (int i = 0; i < roll; i++) {
            if (!enteredHomeStretch) {
                if (newPos == entryToHomeStretch) {
                    enteredHomeStretch = true;
                    newPos = homeStretchBase;
                } else {
                    newPos = (newPos + 1) % 52;
                }
            } else {
                newPos++;
            }
        }

        // Check if overshoot home
        int finalHome = homeStretchBase + 5;
        if (newPos > finalHome) {
            state.setMessage("Cannot move, need exact roll to enter home.");
            return state; // Invalid move
        }

        // Check capture
        boolean captured = false;
        if (newPos < 100 && !safeSquares.contains(newPos)) {
            for (PlayerState p : state.getPlayers()) {
                if (!p.getColor().equals(color)) {
                    for (Token t : p.getTokens()) {
                        if (t.getPosition() == newPos) {
                            t.setPosition(-1);
                            captured = true;
                        }
                    }
                }
            }
        }

        token.setPosition(newPos);
        
        if (newPos == finalHome) {
            token.setHome(true);
            state.setMessage(color + " token reached HOME!");
            // Check if player won
            boolean allHome = currentPlayer.getTokens().stream().allMatch(Token::isHome);
            if (allHome) {
                currentPlayer.setHasFinished(true);
                state.setMessage(color + " HAS WON!");
            }
        } else if (captured) {
            state.setMessage(color + " captured an opponent!");
        } else {
            state.setMessage(color + " moved a token.");
        }

        // Passing turn logic
        if (roll == 6 || captured || newPos == finalHome) {
            state.setDiceRolled(false);
            state.setDiceValue(null);
        } else {
            passTurn(state);
        }

        return state;
    }
    
    private void passTurn(GameStateDto state) {
        int next = state.getTurnIndex();
        int loop = 0;
        do {
            next = (next + 1) % state.getPlayers().size();
            loop++;
        } while (state.getPlayers().get(next).isHasFinished() && loop < 4);
        
        state.setTurnIndex(next);
        state.setDiceRolled(false);
        state.setDiceValue(null);
    }

    private int getStartIndex(String color) {
        return switch (color) {
            case "RED" -> 0;
            case "GREEN" -> 13;
            case "YELLOW" -> 26;
            case "BLUE" -> 39;
            default -> 0;
        };
    }

    private int getEntryToHomeStretch(String color) {
        return switch (color) {
            case "RED" -> 50;
            case "GREEN" -> 11;
            case "YELLOW" -> 24;
            case "BLUE" -> 37;
            default -> 0;
        };
    }

    private int getHomeStretchBase(String color) {
        return switch (color) {
            case "RED" -> 100;
            case "GREEN" -> 200;
            case "YELLOW" -> 300;
            case "BLUE" -> 400;
            default -> 0;
        };
    }

    public GameStateDto handleChat(String roomCode, Long playerId, String chatMessage) {
        GameStateDto state = activeGames.get(roomCode);
        if (state == null) return null;

        PlayerState sender = state.getPlayers().stream()
                .filter(p -> p.getPlayerId().equals(playerId))
                .findFirst().orElse(null);

        if (sender != null && chatMessage != null && !chatMessage.trim().isEmpty()) {
            state.setMessage("[CHAT] " + sender.getColor() + ": " + chatMessage.trim());
        }

        return state;
    }
}
