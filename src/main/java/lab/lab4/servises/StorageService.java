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
import java.time.format.DateTimeFormatter;
import java.util.List;

@NoArgsConstructor
@Service
public class StorageService {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    @Autowired
    private ResultCrudRepository repository;

    @Transactional
    public List<Result> findAllResults(String login) {
        return (List<Result>) repository.findAllByOwner(login);
    }


    @Transactional
    public Result saveResult(Point point, String owner) {
        long startTime = System.nanoTime();
        boolean success = point.hit();
        String attemptTime = formatter.format(ZonedDateTime.now(ZoneId.of("Europe/Moscow")));
        String execTime = String.valueOf((System.nanoTime() - startTime) / 10000);
        Result newResult = new Result(point.getX(), point.getY(), point.getR(), success, attemptTime, execTime, owner);
        return (Result) repository.save(newResult);
    }
}