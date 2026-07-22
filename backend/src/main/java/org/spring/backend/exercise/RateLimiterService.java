package org.spring.backend.exercise;

import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 사용자별 /recommend 호출을 제한하는 인메모리 sliding-window 레이트리미터.
 *
 * 주의: 서버 인스턴스가 여러 대(수평 확장)면 이 방식은 인스턴스별로 따로 카운트되어
 * 실질적인 제한이 느슨해진다. 이미 프로젝트에서 Redis를 쓰고 있다면
 * (기존 GlobalExceptionHandler의 IllegalStateException 주석에 Redis 언급이 있어서) 나중에
 * RedisTemplate 기반 INCR+EXPIRE 방식으로 바꾸는 걸 권장. 지금은 단일 인스턴스 가정하에
 * 간단하게 구현.
 */
@Service
public class RateLimiterService {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MS = 60_000; // 1분

    private final Map<String, Deque<Long>> requestLog = new ConcurrentHashMap<>();

    /** key(보통 userEmail) 기준으로 이번 요청이 허용되는지 확인하고, 허용되면 기록도 남긴다. */
    public boolean isAllowed(String key) {
        long now = System.currentTimeMillis();
        Deque<Long> timestamps = requestLog.computeIfAbsent(key, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() > WINDOW_MS) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= MAX_REQUESTS) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }
}
