package services;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import dto.Result;

import java.io.Serializable;
import java.util.List;

@Stateless
public class StorageService implements Serializable {
    private static final long serialVersionUID = 1L;
    @PersistenceContext(unitName = "PU")
    private EntityManager em;

    public void save(Result res){
        em.persist(res);
    }

    public List<Result> getAll(){
        return em.createQuery("select res from Result res", Result.class).getResultList();
    }

    public void cleanAll(){
          em.createNativeQuery("TRUNCATE TABLE results RESTART IDENTITY").executeUpdate();;
    }
}
