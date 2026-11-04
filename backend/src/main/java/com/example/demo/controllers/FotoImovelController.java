package com.example.demo.controllers;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.models.FotoImovelModel;
import com.example.demo.services.FotoImovelService;

@RestController 
@RequestMapping ("/fotos")


public class FotoImovelController {
    @Autowired 
    private FotoImovelService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )

    public ResponseEntity<FotoImovelModel> salvar(
        @RequestParam ("arquivo") MultipartFile arquivo, 
        @RequestParam ("imovelId") Integer imovelId
    )
    {   
        try {
            if(arquivo.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            FotoImovelModel fotoImovelModel = service.salvar(arquivo, imovelId);
            return ResponseEntity.status(200).body(fotoImovelModel);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<FotoImovelModel>> listarPorImovel(@PathVariable Integer imovelId) {
        return ResponseEntity.ok(service.listarPorImovel(imovelId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FotoImovelModel> buscar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.buscar(id));
        } catch (Exception e) {
            System.out.println("Foto não encontrada: " + e.toString());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotoImovelModel> atualizar(
        @PathVariable Integer id,
        @RequestParam(value = "ordem", required = false) Integer ordem,
        @RequestParam(value = "arquivo", required = false) MultipartFile arquivo
    ) {
        try {
            return ResponseEntity.ok(service.atualizar(id, ordem, arquivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/capa")
    public ResponseEntity<FotoImovelModel> definirCapa(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.definirCapa(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        try {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
