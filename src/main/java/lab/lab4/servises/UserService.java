package lab.lab4.servises;


import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lab.lab4.model.User;
import lab.lab4.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;

    }

    @PostMapping("/registration")
    public void createNewUser(User user){

        if(userRepository.existsByLogin(user.getLogin())){
            throw new EntityExistsException("Пользователь с логином " + user.getLogin() + " уже зарегистрирован");
        }
            userRepository.save(user);

    }
    public User findByLogin(String login) {
        return userRepository.findUserByLogin(login).orElseThrow(() -> new EntityNotFoundException("Пользователя с логином " + login + " не существует"));
    }
}
