package model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ResultBean {
    private Point point = new Point();
    private boolean success;
    private String current_time;
    private String execution_time;

    public ResultBean(Point point, String current_time, String execution_time) {
        this.point = point;
        this.current_time = current_time;
        this.execution_time = execution_time;
        updateSuccess();
    }

    private void updateSuccess() {
        if (point == null) {
            this.success = false;
            return;
        }
        this.success = point.hit();
    }
    public void setX(double x){
        point.setX(x);
        updateSuccess();
    }

    public void setY(double y){
        point.setY(y);
        updateSuccess();
    }
    public void setR(double r){
        point.setR(r);
        updateSuccess();
    }

}