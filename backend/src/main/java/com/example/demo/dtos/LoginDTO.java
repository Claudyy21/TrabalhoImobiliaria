package com.example.demo.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank String email,
        @JsonAlias("password") @NotBlank String senha) {
}
