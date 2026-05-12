package com.backend.CineFlow.CineFlow.service;

import com.backend.CineFlow.CineFlow.dto.UsuarioProfileResponse;
import com.backend.CineFlow.CineFlow.model.Usuario;
import com.backend.CineFlow.CineFlow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear un nuevo usuario
    public Usuario crearUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        return usuarioRepository.save(usuario);
    }

    // Obtener todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Obtener usuario por ID
    public Optional<Usuario> obtenerPorId(long id) {
        return usuarioRepository.findById(id);
    }

    // Obtener usuario por correo
    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    // Login por correo y contrasena
    public Optional<Usuario> autenticar(String correo, String contrasena) {
        return usuarioRepository.findByCorreoAndContrasena(correo, contrasena);
    }

    // Convertir entidad a perfil seguro (sin contrasena)
    public UsuarioProfileResponse toProfile(Usuario usuario) {
        return new UsuarioProfileResponse(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getApellidoUsuario(),
                usuario.getCorreo(),
                usuario.getFechaNacimiento(),
                usuario.getMetodoPago()
        );
    }

    // Actualizar usuario
    @SuppressWarnings("null")
    public Usuario actualizarUsuario(long id, Usuario usuarioActualizado) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        
        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();
            
            // Actualizar campos
            if (usuarioActualizado.getNombreUsuario() != null) {
                usuario.setNombreUsuario(usuarioActualizado.getNombreUsuario());
            }
            if (usuarioActualizado.getApellidoUsuario() != null) {
                usuario.setApellidoUsuario(usuarioActualizado.getApellidoUsuario());
            }
            if (usuarioActualizado.getCorreo() != null) {
                usuario.setCorreo(usuarioActualizado.getCorreo());
            }
            if (usuarioActualizado.getContrasena() != null) {
                usuario.setContrasena(usuarioActualizado.getContrasena());
            }
            if (usuarioActualizado.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
            }
            if (usuarioActualizado.getMetodoPago() != null) {
                usuario.setMetodoPago(usuarioActualizado.getMetodoPago());
            }
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            return usuarioGuardado;
        }
        
        throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
    }

    // Eliminar usuario por ID
    public void eliminarUsuario(long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // Verificar si existe un usuario por correo
    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }
}
