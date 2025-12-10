package model;

import jakarta.inject.Named;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import dto.Point;
import dto.Result;

import java.io.Serializable;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@Getter
@Named("attemptBean")
@SessionScoped
public class AttemptBean implements Serializable {
    private static final long serialVersionUID = 1L;
    private Point point = new Point();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Inject
    StorageBean storage;

    public void setX(double x){
        point.setX(x);

    }

    public void setY(double y){
        point.setY(y);

    }
    public void setR(double r){
        point.setR(r);

    }

    public void buildResult(){
        long startTime = System.nanoTime();
        boolean success = point.hit();
        ZonedDateTime attemptTime = ZonedDateTime.now(ZoneId.of("Europe/Moscow"));
        String execTime = String.valueOf((System.nanoTime() - startTime) / 10000) ;
        Result result = new Result(point.getX(), point.getY(), point.getR(), success, attemptTime, execTime);
        storage.addResult(result);
    }
}