package com.example.demo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.LoginDTO;
import com.example.demo.dtos.TokenDTO;
import com.example.demo.dtos.UserDTO;
import com.example.demo.models.UserModel;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtService;
import com.example.demo.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/auth", "/public"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
                          UserRepository userRepository, UserService userService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO dto) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.senha()));

            UserModel user = userRepository.findByEmail(auth.getName()).orElseThrow();
            String role = user.getTipo() == null ? "USER" : user.getTipo().trim().toUpperCase();

            String token = jwtService.gerarToken(user.getEmail(), role);
            return ResponseEntity.ok(new TokenDTO(token, "Bearer", user.getNome(), role));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).build();
        }
    }

    /** Cadastro publico. O tipo/role enviado e gravado em maiusculo (ex.: admin -> ADMIN). */
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getSenha() == null || dto.getSenha().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (userService.emailEmUso(dto.getEmail(), null)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        userService.insert(dto);
        return ResponseEntity.ok().build();
    }
}
