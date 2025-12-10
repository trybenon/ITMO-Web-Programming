package dto;

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
    private ZonedDateTime attemptTime;
    @NonNull
    private String execTime;
}
