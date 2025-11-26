package model;

import lombok.*;

@NoArgsConstructor
@Getter
public class PointBean {
    private double x;
    private double y;
    private double r;


    public PointBean(double x, double y, double r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }



    public boolean hit() {

        // 1-я четверть (x >= 0, y >= 0) - прямоугольник
        if (x >= 0 && y >= 0) {
            return (x <= r / 2) && (y <= r);
        }

        // 2-я четверть (x < 0, y >= 0) - треугольник
        if (x < 0 && y >= 0) {
            return (y <= (x / 2 + r / 2)) && (x >= -r) && (y <= r);
        }

        // 4-я четверть (x >= 0, y < 0) - четверть круга
        if (x >= 0 && y < 0) {
            return (x * x + y * y <= r/2 * r/2);
        }

        // 3-я четверть (x < 0, y < 0) - всегда false
        return false;
    }
}