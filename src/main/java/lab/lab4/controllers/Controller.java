package lab.lab4.controllers;

import jakarta.annotation.PostConstruct;
import lab.lab4.model.Point;
import lab.lab4.model.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lab.lab4.servises.StorageService;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:" +
        "5173")
@RestController
@RequestMapping("/api")
public class Controller {
    private static final Logger logger = LoggerFactory.getLogger(Controller.class);
    private StorageService storageService;

    @Autowired
    public Controller(StorageService storageService){
        this.storageService = storageService;
    }

    @GetMapping("/allResults")
    public ResponseEntity<List<Result>> getAllResults(Principal principal){
        return ResponseEntity.ok(storageService.findAllResults(principal.getName()));
    }

    @PostMapping("/sendPoint")
    public Result addResult(@RequestBody Point point, Principal principal){
        return storageService.saveResult(point, principal.getName());
    }

}
