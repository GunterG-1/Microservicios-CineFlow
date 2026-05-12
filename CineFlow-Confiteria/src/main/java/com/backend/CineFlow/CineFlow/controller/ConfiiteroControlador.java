package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.ComboDTO;
import com.backend.CineFlow.CineFlow.dto.PedidoDTO;
import com.backend.CineFlow.CineFlow.dto.VerificacionDTO;
import com.backend.CineFlow.CineFlow.service.ConfiiteroServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/confiteria")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConfiiteroControlador {
    
    private final ConfiiteroServicio confiiteroServicio;
    
    /**
     * GET /api/concessions/menu
     * Obtiene los combos disponibles para compra anticipada
     */
    @GetMapping("/menu")
    public ResponseEntity<List<ComboDTO>> obtenerMenu() {
        try {
            List<ComboDTO> combos = confiiteroServicio.obtenerMenu();
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/concessions/menu/disponibles
     * Obtiene solo los combos con disponibilidad
     */
    @GetMapping("/menu/disponibles")
    public ResponseEntity<List<ComboDTO>> obtenerCombosDisponibles() {
        try {
            List<ComboDTO> combos = confiiteroServicio.obtenerCombosDisponibles();
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/concessions/menu/{id}
     * Obtiene un combo específico por ID
     */
    @GetMapping("/menu/{id}")
    public ResponseEntity<?> obtenerComboPorId(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            ComboDTO combo = confiiteroServicio.obtenerComboPorId(id);
            return ResponseEntity.ok(combo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/concessions/orders
     * Crea un nuevo pedido
     */
    @PostMapping("/ordenar")
    public ResponseEntity<?> crearPedido(@RequestBody @NonNull PedidoDTO pedidoDTO) {
        try {
            Objects.requireNonNull(pedidoDTO, "pedidoDTO no puede ser null");
            PedidoDTO pedidoCreado = confiiteroServicio.crearPedido(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCreado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/concessions/orders/{id}
     * Obtiene los detalles de un pedido
     */
    @GetMapping("/order/{id}")
    public ResponseEntity<?> obtenerPedidoPorId(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            PedidoDTO pedido = confiiteroServicio.obtenerPedidoPorId(id);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * PATCH /api/concessions/orders/{id}/status
     * Actualiza el estado del pedido a "En Preparación" o "Entregado" en la barra
     */
    @PatchMapping("/order/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(
            @PathVariable @NonNull Long id,
            @RequestParam @NonNull String estado) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            Objects.requireNonNull(estado, "estado no puede ser null");
            PedidoDTO pedidoActualizado = confiiteroServicio.actualizarEstadoPedido(id, estado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/concessions/verify
     * Escaneo del ticket digital para asegurar la entrega correcta
     */
    @PostMapping("/verificar")
    public ResponseEntity<?> verificarTicket(@RequestParam @NonNull String numeroTicket) {
        try {
            Objects.requireNonNull(numeroTicket, "numeroTicket no puede ser null");
            VerificacionDTO verificacion = confiiteroServicio.verificarTicket(numeroTicket);
            return ResponseEntity.ok(verificacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/concessions/orders/usuario/{idUsuario}
     * Obtiene los pedidos de un usuario
     */
    @GetMapping("/order/usuario/{idUsuario}")
    public ResponseEntity<List<PedidoDTO>> obtenerPedidosPorUsuario(@PathVariable @NonNull Long idUsuario) {
        try {
            Objects.requireNonNull(idUsuario, "idUsuario no puede ser null");
            List<PedidoDTO> pedidos = confiiteroServicio.obtenerPedidosPorUsuario(idUsuario);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/concessions/orders/estado/{estado}
     * Obtiene los pedidos por estado
     */
    @GetMapping("/order/estado/{estado}")
    public ResponseEntity<?> obtenerPedidosPorEstado(@PathVariable @NonNull String estado) {
        try {
            Objects.requireNonNull(estado, "estado no puede ser null");
            List<PedidoDTO> pedidos = confiiteroServicio.obtenerPedidosPorEstado(estado);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/concessions/orders/{id}
     * Cancela un pedido
     */
    @DeleteMapping("/order/{id}")
    public ResponseEntity<?> cancelarPedido(@PathVariable @NonNull Long id) {
        try {
            Objects.requireNonNull(id, "id no puede ser null");
            PedidoDTO pedidoCancelado = confiiteroServicio.cancelarPedido(id);
            return ResponseEntity.ok(pedidoCancelado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/concessions/health
     * Verificar que el servicio está disponible
     */
    @GetMapping("/servicio")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("servicio", "Confitería");
        return ResponseEntity.ok(response);
    }
}
