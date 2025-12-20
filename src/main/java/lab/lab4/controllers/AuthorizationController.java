package lab.lab4.controllers;

import lab.lab4.model.User;
import lab.lab4.servises.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthorizationController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
     public  AuthorizationController(UserService userService, PasswordEncoder passwordEncoder) {
         this.userService = userService;
         this.passwordEncoder = passwordEncoder;
     }


     @PostMapping("/registration")
     public String registration(@RequestParam String login, @RequestParam String password){
        User user = new User(login, passwordEncoder.encode(password));
        userService.createNewUser(user);
    return "redirect:/login";
    }




}
