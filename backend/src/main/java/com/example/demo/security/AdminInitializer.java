package com.example.demo.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.models.UserModel;
import com.example.demo.repositories.UserRepository;

/** Garante que exista um ADMIN com senha para conseguir cadastrar os demais usuarios. */
@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    @Value("${app.admin.nome}")
    private String nome;
    @Value("${app.admin.email}")
    private String email;
    @Value("${app.admin.senha}")
    private String senha;

    public AdminInitializer(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        UserModel admin = repository.findByEmail(email).orElse(null);

        if (admin == null) {
            admin = new UserModel();
            admin.setNome(nome);
            admin.setEmail(email);
            admin.setTipo("ADMIN");
            admin.setSenha(encoder.encode(senha));
            repository.save(admin);
        } else if (admin.getSenha() == null || admin.getSenha().isBlank()) {
            admin.setSenha(encoder.encode(senha));
            repository.save(admin);
        }
    }
}
