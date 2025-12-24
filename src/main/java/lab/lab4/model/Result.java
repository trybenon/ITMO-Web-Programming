package lab.lab4.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Entity
@Table(name = "results")
@RequiredArgsConstructor
public class Result implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    private double x;
    @NonNull
    private double y;
    @NonNull
    private double r;
    @NonNull
    private boolean success;
    @NonNull
    @Column(name="attempt_time")
    private String attemptTime;
    @NonNull
    @Column(name="exec_time")
    private String execTime;
    @NonNull
    private String owner;
}