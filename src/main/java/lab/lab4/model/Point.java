package lab.lab4.model;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class Point {
    private double x;
    private double y;
    private double r;

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public boolean hit() {
        // 1-я четверть - прямоугольник
        if (x >= 0 && y >= 0) {
            return (x <= r) && (y <= r/2);
        }
        // 4-я четверть - треугольник
        if (x >= 0 && y <= 0) {
            return y >= x - r / 2;
        }

        // 2-я четверть - четверть круга
        if (x <= 0 && y > 0) {
            return (x * x + y * y <= r * r);
        }

        // 3-я четверть - всегда false
        return false;
    }
}