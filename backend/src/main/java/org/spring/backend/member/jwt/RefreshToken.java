package org.spring.backend.member.jwt;

import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@RedisHash(value = "refreshToken",timeToLive = 86400)
public class RefreshToken {
    @Id
    private String id;
    private String refreshToken;
}
