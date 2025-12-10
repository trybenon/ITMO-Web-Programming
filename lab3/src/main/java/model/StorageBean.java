package model;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;
import dto.Result;
import services.StorageService;

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

    public String getJsonResults() {
        if (results == null || results.isEmpty()) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");

        for (int i = 0; i < results.size(); i++) {
            Result r = results.get(i);

            sb.append(String.format(java.util.Locale.US,
                    "{\"x\":%.4f, \"y\":%.4f, \"r\":%.4f, \"success\":%b}",
                    r.getX(), r.getY(), r.getR(), r.isSuccess()));

            if (i < results.size() - 1) {
                sb.append(",");
            }
        }

        sb.append("]");
        return sb.toString();
    }


public void cleanRes(){
        service.cleanAll();
        results.clear();
    }
}

