package com.backend.CineFlow.CineFlow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {
    
    private long id;
    @NotNull
    @NonNull
    private String numeroTicket;
    private long idUsuario;
    private long comboId;
    private ComboDTO combo;
    private int cantidad;
    private String estado;
    private double precioTotal;
    @NotNull
    @NonNull
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaEntrega;
    private String observaciones;
}
