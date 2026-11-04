package com.example.demo.dtos;

import jakarta.validation.constraints.NotBlank;

public record StatusDTO(@NotBlank String status) {
}
