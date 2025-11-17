package model;

public class Result {
    private double x;
    private double y;
    private double r;
    private boolean success;
    private String current_time;
    private String execution_time;

    public Result(double x, double y, double r, boolean success, String current_time, String execution_time) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.success = success;
        this.current_time = current_time;
        this.execution_time = execution_time;
    }

    public double getY() {
        return y;
    }

    public double getX() {
        return x;
    }

    public double getR() {
        return r;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getCurrent_time() {
        return current_time;
    }

    public String getExecution_time() {
        return execution_time;
    }
}