package model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ResultBean {
    private double x;
    private double y;
    private double r;
    private boolean success;
    private String current_time;
    private String execution_time;

    public ResultBean(double x, double y, double r, boolean success, String current_time, String execution_time) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.success = success;
        this.current_time = current_time;
        this.execution_time = execution_time;
    }

}