package lab.lab4.servises;

import jakarta.transaction.Transactional;
import lab.lab4.model.Point;
import lab.lab4.repositories.ResultCrudRepository;
import lombok.NoArgsConstructor;
import lab.lab4.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@NoArgsConstructor
@Service
public class StorageService {

    @Autowired
    private ResultCrudRepository repository;

    @Transactional
    public List<Result> findAllResults(){
        return (List<Result>) repository.findAll();
    }


    @Transactional
    public Result saveResult(Point point){
        long startTime = System.nanoTime();
        boolean success = point.hit();
        ZonedDateTime attemptTime = ZonedDateTime.now(ZoneId.of("Europe/Moscow"));
        String execTime = String.valueOf((System.nanoTime() - startTime) / 10000) ;
        Result newResult = new Result(point.getX(), point.getY(), point.getR(), success, attemptTime, execTime);
        return (Result) repository.save(newResult);
    }

    @Transactional
    public void cleanAllResults(){
        repository.deleteAll();
    }
}
