package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                    // sem token / token invalido -> 401 (usuario autenticado sem permissao -> 403)
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    // setStatus direto (o handler padrao usa sendError -> /error -> viraria 401)
                    .accessDeniedHandler((request, response, ex) ->
                            response.setStatus(HttpStatus.FORBIDDEN.value())))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/error").permitAll()

                    // ---- Login: todos, sem token ----
                    .requestMatchers(HttpMethod.POST, "/auth/login", "/public/login",
                            "/auth/register", "/public/register").permitAll()

                    // ---- Listar imoveis / um imovel: todos, sem token ----
                    .requestMatchers(HttpMethod.GET, "/imoveis", "/imoveis/*").permitAll()
                    // "Saber mais" (e-mail do interessado) tambem e publico
                    .requestMatchers(HttpMethod.POST, "/imoveis/sabermais/*").permitAll()

                    // ---- Alterar status do imovel: qualquer usuario autenticado ----
                    .requestMatchers(HttpMethod.PATCH, "/imoveis/*/status").authenticated()

                    // ---- Dados auxiliares usados na listagem publica (somente leitura) ----
                    .requestMatchers(HttpMethod.GET, "/fotos/**", "/bairros/**", "/tipos-imoveis/**").permitAll()

                    // ---- Cadastrar/alterar/remover imoveis (e seus dados auxiliares): ADMIN ----
                    .requestMatchers("/imoveis/**", "/fotos/**", "/bairros/**", "/tipos-imoveis/**").hasRole("ADMIN")

                    // ---- Cadastrar e gerenciar usuarios: ADMIN ----
                    .requestMatchers("/users/**").hasRole("ADMIN")

                    // endpoint de teste de e-mail: ADMIN
                    .requestMatchers("/email/**").hasRole("ADMIN")

                    // qualquer outra rota exige autenticacao
                    .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
