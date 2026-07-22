package org.spring.backend.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private String sender;  // "user" 또는 "bot"
    private String content; // 메시지 내용
    private String time;    // 전송 시간
}
