package util;

import model.Result;

import java.util.ArrayList;
import java.util.List;

public class SessionStorage {
    private final List<Result> storage = new ArrayList<>();

    public void addResult(Result result){
        storage.add(result);
    }

    public List<Result> getResults(){
        return storage;
}
    public void clearResult(){
        storage.clear();
    }
}
