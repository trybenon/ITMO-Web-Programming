package model;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class Point {
    private double x;
    private double y;
    private double r;




    public boolean hit() {
        // 1-я четверть (x >= 0, y >= 0) - прямоугольник
        if (x >= 0 && y >= 0) {
            return (x <= r) && (y <= r/2);
        }

        if (x >= 0 && y <= 0) {
            return y >= x - r / 2;
        }

        // 2-я четверть (x >= 0, y < 0) - четверть круга
        if (x <= 0 && y > 0) {
            return (x * x + y * y <= r * r);
        }

        // 3-я четверть (x < 0, y < 0) - всегда false
        return false;
    }
}