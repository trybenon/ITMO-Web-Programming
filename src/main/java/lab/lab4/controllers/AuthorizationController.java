package lab.lab4.controllers;

import jakarta.persistence.EntityExistsException;
import lab.lab4.model.AuthResponse;
import lab.lab4.model.LoginRequest;
import lab.lab4.model.User;
import lab.lab4.security.JwtCore;
import lab.lab4.security.TokenFilter;
import lab.lab4.servises.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // Хорошая практика группировать
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorizationController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtCore jwtCore;
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationController.class);
    @Autowired
    public AuthorizationController(UserService userService,
                                   PasswordEncoder passwordEncoder,
                                   AuthenticationManager authenticationManager,
                                   JwtCore jwtCore) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtCore = jwtCore;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registration(@RequestBody LoginRequest loginReq) {
        try {

            User user = new User(loginReq.getLogin(), passwordEncoder.encode(loginReq.getPassword()));
            userService.createNewUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginReq) {

        logger.info("Попытка входа пользователя: {}", loginReq.getLogin());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginReq.getLogin(), loginReq.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtCore.generateToken(authentication);

            logger.info("Токен успешно создан для: {}", loginReq.getLogin());
            return ResponseEntity.ok(new AuthResponse(jwt, loginReq.getLogin()));

        } catch (BadCredentialsException e) {
            logger.warn("Неверный пароль для: {}", loginReq.getLogin());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect login or password");

        } catch (Exception e) {

            logger.error("Критическая ошибка при входе", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error: " + e.getMessage());
        }
    }
}