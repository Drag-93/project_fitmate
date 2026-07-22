package org.spring.backend.exercise;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.spring.backend.common.BasicTime;


@Entity
@Table(name = "exercise_plan")
@Getter
@NoArgsConstructor
public class ExercisePlan extends BasicTime {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String name;
    private String gifUrl; // API에서 가져온 GIF 주소

    @Lob @Column(columnDefinition = "LONGTEXT")
    private String routine; // buildRoutine 결과물


    public ExercisePlan(String userEmail, String name, String gifUrl, String routine) {
        this.userEmail = userEmail;
        this.name = name;
        this.gifUrl = gifUrl;
        this.routine = routine;
    }
}
