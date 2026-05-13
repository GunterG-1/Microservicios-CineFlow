package com.backend.CineFlow.CineFlow.controller;

import com.backend.CineFlow.CineFlow.dto.ActualizarUsuarioDTO;
import com.backend.CineFlow.CineFlow.dto.LoginRequest;
import com.backend.CineFlow.CineFlow.dto.LoginResponse;
import com.backend.CineFlow.CineFlow.dto.RegistroDTO;
import com.backend.CineFlow.CineFlow.dto.UsuarioProfileResponse;
import com.backend.CineFlow.CineFlow.model.Usuario;
import com.backend.CineFlow.CineFlow.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET: Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        List<Usuario> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(usuarios);
    }

    // GET: Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable long id) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET: Obtener usuario por correo
    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> obtenerPorCorreo(@PathVariable String correo) {
        Optional<Usuario> usuario = usuarioService.obtenerPorCorreo(correo);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Register (crea usuario) - Nuevo método con DTO
    @PostMapping("/registrar")
    public ResponseEntity<?> register(@Valid @RequestBody RegistroDTO registroDTO) {
        try {
            Usuario usuarioCreado = usuarioService.registrarUsuario(registroDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.toProfile(usuarioCreado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // POST: Register (método antiguo para compatibilidad)
    @PostMapping("/registrar-completo")
    public ResponseEntity<UsuarioProfileResponse> registerCompleto(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.toProfile(usuarioCreado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST: Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuario = usuarioService.autenticar(request.getCorreo(), request.getContrasena());
        if (usuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Credenciales invalidas", null));
        }

        UsuarioProfileResponse profile = usuarioService.toProfile(usuario.get());
        return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", profile));
    }

    // GET: Perfil por correo
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioProfileResponse> profile(@RequestParam String correo) {
        Optional<Usuario> usuario = usuarioService.obtenerPorCorreo(correo);
        return usuario.map(value -> ResponseEntity.ok(usuarioService.toProfile(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT: Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable long id, @Valid @RequestBody Usuario usuarioActualizado) {
        try {
            Usuario usuario = usuarioService.actualizarUsuario(id, usuarioActualizado);
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Actualizar usuario con método de pago (nuevo método con DTO)
    @PutMapping("/{id}/actualizar")
    public ResponseEntity<?> actualizarUsuarioConMetodoPago(@PathVariable long id, @Valid @RequestBody ActualizarUsuarioDTO dto) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuarioDesdeDTO(id, dto);
            return ResponseEntity.ok(usuarioService.toProfile(usuarioActualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    // DELETE: Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: Verificar si existe un correo
    @GetMapping("/existe-correo/{correo}")
    public ResponseEntity<Boolean> existeCorreo(@PathVariable String correo) {
        boolean existe = usuarioService.existeCorreo(correo);
        return ResponseEntity.ok(existe);
    }

    private static class ErrorResponse {
        private final String message;

        private ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
