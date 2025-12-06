package model;

import jakarta.annotation.ManagedBean;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Named("storageBean")
@SessionScoped
public class StorageBean implements Serializable {

    private static final long serialVersionUID = 1L;


    @Inject
    private StorageService service;

    private List<Result> results;

    @PostConstruct
    public void init(){
        results = service.getAll();
    }


public void addResult(Result res){
    service.save(res);
    results.add(0, res);
}

}
