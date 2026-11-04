package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.UserDTO;
import com.example.demo.models.UserModel;
import com.example.demo.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserModel> getAllUsers() {
        return repository.findAll();
    }

    public UserModel find(Integer id) {
        Optional<UserModel> user = repository.findById(id);
        return user.orElse(null);
    }

    public boolean emailEmUso(String email, Integer idIgnorado) {
        return repository.findByEmail(email)
                .map(u -> !u.getId().equals(idIgnorado))
                .orElse(false);
    }

    public UserModel insert(UserDTO dto) {
        UserModel user = new UserModel();

        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setTipo(normalizarTipo(dto.getTipo()));
        user.setSenha(passwordEncoder.encode(dto.getSenha()));

        return repository.save(user);
    }

    public UserModel update(UserDTO dto) {
        UserModel user = find(dto.getId());

        if (user == null) {
            return null;
        }

        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setTipo(normalizarTipo(dto.getTipo()));

        // so troca a senha se uma nova for enviada
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            user.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        return repository.save(user);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    private String normalizarTipo(String tipo) {
        return (tipo == null || tipo.isBlank()) ? "USER" : tipo.trim().toUpperCase();
    }
}
