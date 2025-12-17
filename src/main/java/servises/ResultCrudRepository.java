package servises;

import model.Result;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultCrudRepository extends CrudRepository<Result, Long> {
}
