package lab.lab4.controllers;

import jakarta.annotation.PostConstruct;
import lab.lab4.model.Point;
import lab.lab4.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lab.lab4.servises.StorageService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {

    private StorageService storageService;

    @Autowired
    public Controller(StorageService storageService){
        this.storageService = storageService;
    }

    @GetMapping("/allResults")
    public ResponseEntity<List<Result>> getAllResults(){
        return ResponseEntity.ok(storageService.findAllResults());
    }

    @PostMapping("/sendPoint")
    public Result addResult(@RequestBody Point point){
        return storageService.saveResult(point);
    }

}
