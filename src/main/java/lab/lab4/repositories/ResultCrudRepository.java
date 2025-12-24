package lab.lab4.repositories;

import lab.lab4.model.Result;
import lab.lab4.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultCrudRepository extends CrudRepository<Result, Long> {

    List<Result> findAllByOwner(String owner);
}
