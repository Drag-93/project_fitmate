package org.spring.backend.chatbot.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.chatbot.config.Question;
import org.spring.backend.chatbot.message.BotMessage;
import org.spring.backend.chatbot.message.ClientMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequiredArgsConstructor
public class ChatBotController {

    //rabbitMQ
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name:ec2.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing.key.question:question.key}")
    private String routingkey;

    //RabbitMQ 전송 + 챗봇 응답
    @MessageMapping("/bot")
    @SendTo("/topic/question")
    public BotMessage rabbitChat(Question message) throws Exception {
        rabbitTemplate.convertAndSend(exchange, routingkey, message);

        String responseText = message.getContent() + " (RabbitMQ 처리 완료)";
        return new BotMessage(responseText, getCurrentFormattedTime());
    }

    //인사 메시지 응답
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public BotMessage greeting(ClientMessage message) throws Exception {
        Thread.sleep(50);
        String responseText = "안녕하세요, 챗봇(WebSocket)입니다.\n궁금한 점은 저에게 물어보세요.";
        return new BotMessage(responseText, getCurrentFormattedTime());
    }

    //일반 메시지 응답
    @MessageMapping("/message")
    @SendTo("/topic/message")
    public BotMessage message(ClientMessage message) throws Exception {
        Thread.sleep(50);
        String searchData = message.getContent().trim();
        System.out.println("입력메시지 >> " + searchData);

        String responseText = message.getContent() + "에 대한 응답입니다.";
        return new BotMessage(responseText, getCurrentFormattedTime());
    }

    //공통 시간 포맷 생성 메서드   
    private String getCurrentFormattedTime() {
        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a h:mm");
        return today.format(formatter);
    }
}
