package servises;

import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@NoArgsConstructor
@Service
public class StorageService {

    @Autowired
    private ResultCrudRepository repository;

    @Transactional
    public void getAllResults(){
        List<Result> results = (List<Result>) repository.findAll();
    }

    @Transactional
    public void saveResult(Result result){
        repository.save(result);
    }

    @Transactional
    public void cleanAllResults(){
        repository.deleteAll();
    }
}
