package org.spring.backend.chatbot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_tb")
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long id;

    @Column
    private String resStr; //답변

    @Column(nullable = false, unique = true)
    private String search; //검색단어

    //1:N
    @OneToMany(mappedBy = "chatEntity",
            cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<AnswerEntity> answerEntities;
}
