package org.spring.backend.exercise;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @Scheduled 어노테이션이 실제로 동작하려면 애플리케이션 어딘가에
 * @EnableScheduling이 선언되어 있어야 한다.
 *
 * 이미 메인 Application 클래스(@SpringBootApplication 붙은 곳)에
 * @EnableScheduling이 있다면 이 파일은 필요 없으니 지워도 된다.
 * (중복 선언 자체는 에러 나지 않지만 굳이 둘 필요는 없음)
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
