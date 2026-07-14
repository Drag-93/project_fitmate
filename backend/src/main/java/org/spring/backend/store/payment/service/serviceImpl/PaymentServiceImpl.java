package org.spring.backend.store.payment.service.serviceImpl;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.backend.store.cart.service.CartService;
import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.entity.OrderItemEntity;
import org.spring.backend.store.order.repository.OrderRepository;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.order.type.OrderStatus;
import org.spring.backend.store.payment.dto.KakaoPayPrepareDto;
import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.entity.PaymentEntity;
import org.spring.backend.store.payment.repository.PaymentRepository;
import org.spring.backend.store.payment.service.PaymentService;
import org.spring.backend.store.payment.type.PaymentMethod;
import org.spring.backend.store.payment.type.PaymentStatus;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.spring.backend.store.subscription.repository.SubscriptionRepository;
import org.spring.backend.store.subscription.type.SubscriptionStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final CartService cartService;

  @Value("${kakao.admin-key}")
  private String kakaoAdminKey;

  @Override
  public void paymentInsert(PaymentDto paymentDto) {

    // 일반 상품 결제
    if (paymentDto.getOrderId() != null) {

      OrderEntity orderEntity = orderRepository.findById(paymentDto.getOrderId())
          .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

      PaymentEntity paymentEntity = PaymentEntity.builder()
          .orderEntity(orderEntity)
          .amount(paymentDto.getAmount())
          .paymentMethod(paymentDto.getPaymentMethod())
          .paymentStatus(PaymentStatus.READY)
          .build();

      paymentRepository.save(paymentEntity);

      paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
      paymentEntity.setApproveTime(LocalDateTime.now());

      orderEntity.setOrderStatus(OrderStatus.SUCCESS);
      orderEntity.setDeliveryStatus(DeliveryStatus.READY);
    }

    // 구독 결제
    else if (paymentDto.getSubscriptionId() != null) {

      SubscriptionEntity subscriptionEntity = subscriptionRepository.findById(paymentDto.getSubscriptionId())
          .orElseThrow(() -> new IllegalArgumentException("구독이 존재하지 않습니다."));

      PaymentEntity paymentEntity = PaymentEntity.builder()
          .subscriptionEntity(subscriptionEntity)
          .amount(paymentDto.getAmount())
          .paymentMethod(paymentDto.getPaymentMethod())
          .paymentStatus(PaymentStatus.READY)
          .build();

      paymentRepository.save(paymentEntity);

      paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
      paymentEntity.setApproveTime(LocalDateTime.now());

      subscriptionEntity.setSubscriptionStatus(SubscriptionStatus.ACTIVE);
      subscriptionEntity.setStartDate(LocalDateTime.now());
      subscriptionEntity.setNextPaymentDate(LocalDateTime.now().plusMonths(1));
    }

    // 둘 다 없는 경우
    else {
      throw new IllegalArgumentException("주문 또는 구독 정보가 필요합니다.");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<PaymentDto> paymentListFn(Long memberId) {
    return paymentRepository.findPaymentListByMemberId(memberId)
        .stream()
        .map(PaymentDto::toPaymentDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<PaymentDto> paymentAllList() {
    return paymentRepository.findAll()
        .stream()
        .map(PaymentDto::toPaymentDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public PaymentDto findById(Long id) {
    PaymentEntity paymentEntity = paymentRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("결제가 존재하지 않습니다."));

    return PaymentDto.toPaymentDto(paymentEntity);
  }

  @Override
  public void paymentApproval(String pgToken, Long paymentId) {
    // DB에서 엔티티를 영속 상태로 조회 (없으면 예외 발생)
    PaymentEntity paymentEntity = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new IllegalArgumentException("해당 결제 건이 존재하지 않습니다. ID: " + paymentId));

    if (paymentEntity.getPaymentStatus() == PaymentStatus.SUCCESS) {
      return;
    }
    // pg_token 세팅 (Dirty CHecking에 의해 자동 업데이트)
    paymentEntity.setPgToken(pgToken);
    paymentEntity.setPaymentStatus(PaymentStatus.PROCESSING);

    // 카카오 결제 승인 API 호출 진행
    paymentApproveKakao(paymentEntity);
  }

  @Override
  public void paymentApproveKakao(PaymentEntity paymentEntity) {

    OrderEntity order = paymentEntity.getOrderEntity();

    Long memberId = order.getMemberEntity().getId();
    int amount = order.getTotalPrice();

    String productName = order.getOrderItemEntities()
        .get(0)
        .getProductName();

    RestTemplate restTemplate = new RestTemplate();
    String tid = paymentEntity.getTid();
    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "KakaoAK " + kakaoAdminKey);
    // legacy 주소는 Form URL Encoded 방식으로 전송해야 안전합니다.
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    paymentEntity.setPaymentStatus(PaymentStatus.PROCESSING);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    URI uri = UriComponentsBuilder
        .fromUriString("https://kapi.kakao.com")
        .path("/v1/payment/approve")
        .queryParam("cid", "TC0ONETIME")
        .queryParam("tid", tid)
        .queryParam("partner_order_id", paymentEntity.getOrderEntity().getId())
        .queryParam("partner_user_id", memberId)
        .queryParam("pg_token", paymentEntity.getPgToken())
        .queryParam("item_name", productName)
        .queryParam("quantity", "1")
        .queryParam("total_amount", amount)
        .encode()
        .build()
        .toUri();

    try {
      ResponseEntity<String> result = restTemplate.exchange(uri, HttpMethod.POST, entity, String.class);

      // 성공 시 카카오가 반환한 최종 승인 영수증 JSON 보관 및 상태 변경 (Dirty Checking)
      paymentEntity.setPaymentApproveJson(result.getBody());
      paymentEntity.setApproveTime(LocalDateTime.now());
      paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
      order.setOrderStatus(OrderStatus.SUCCESS);
      order.setDeliveryStatus(DeliveryStatus.READY);
      createSubscription(paymentEntity);
      // 주문된 상품만 장바구니에서 제거
      cartService.deletePurchasedItems(order.getId());

    } catch (Exception e) {
      paymentEntity.setPaymentStatus(PaymentStatus.FAILED); // 실패 상태 기록
      throw new RuntimeException("카카오페이 최종 승인 통신 에러: " + e.getMessage(), e);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public String getJsonDb() {
    List<PaymentEntity> list = paymentRepository.findAll();
    return list.stream()
        .map(PaymentEntity::getPaymentReadyJson)
        .collect(Collectors.joining(", ", "[", "]"));
  }

  @Override
  public String pgRequest(String pg, Long orderId) {
    if (!"kakao".equalsIgnoreCase(pg)) {
      throw new RuntimeException("제휴되지 않은 결제사입니다.");
    }

    OrderEntity orderEntity = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

    Long memberId = orderEntity.getMemberEntity().getId();
    int amount = orderEntity.getTotalPrice();

    // 첫 번째 상품명을 대표 상품명으로 사용
    String productName = orderEntity.getOrderItemEntities()
        .get(0)
        .getProductName();

    // 1. 주문번호(ID) 발급을 위해 최소 정보로 최초 저장
    PaymentEntity paymentEntity = PaymentEntity.builder()
        .paymentMethod(PaymentMethod.KAKAO)
        .paymentStatus(PaymentStatus.READY)
        .amount(amount)
        .orderEntity(orderEntity)
        .build();

    paymentEntity = paymentRepository.save(paymentEntity);

    RestTemplate restTemplate = new RestTemplate();
    ObjectMapper objectMapper = new ObjectMapper();

    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "KakaoAK " + kakaoAdminKey);
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    URI uri = UriComponentsBuilder
        .fromUriString("https://kapi.kakao.com")
        .path("/v1/payment/ready")
        .queryParam("cid", "TC0ONETIME")
        .queryParam("partner_order_id", orderEntity.getId())
        .queryParam("partner_user_id", memberId)
        .queryParam("item_name", productName)
        .queryParam("quantity", "1")
        .queryParam("total_amount", amount)
        .queryParam("tax_free_amount", "0")
        .queryParam("approval_url", "http://localhost:3000/payment/approval/" + paymentEntity.getId())
        .queryParam("cancel_url", "http://localhost:3000/payment/cancel")
        .queryParam("fail_url", "http://localhost:3000/payment/fail")
        .encode()
        .build()
        .toUri();

    try {
      ResponseEntity<KakaoPayPrepareDto> result = restTemplate.exchange(uri, HttpMethod.POST, entity,
          KakaoPayPrepareDto.class);
      KakaoPayPrepareDto body = result.getBody();
      if (body != null) {
        String kakaoJsonString = objectMapper.writeValueAsString(body);

        // Drity Checking 기능을 통해 자동으로 세션 JSON 및 tid 동기화 저장
        paymentEntity.setPaymentReadyJson(kakaoJsonString);
        paymentEntity.setTid(body.getTid());

        return body.getNext_redirect_pc_url();

      }
      throw new RuntimeException("카카오페이로부터 응답 데이터를 받지 못했습니다.");
    } catch (JsonProcessingException e) {
      throw new RuntimeException("카카오 응답 오브젝트 직렬화 실패", e);
    } catch (Exception e) {
      throw new RuntimeException("카카오페이 Ready 요청 실패", e);
    }
  }

  // 구독 생성 메서드
  private void createSubscription(PaymentEntity paymentEntity) {

    OrderEntity order = paymentEntity.getOrderEntity();

    OrderItemEntity orderItem = order.getOrderItemEntities().get(0);

    ProductEntity product = orderItem.getProductEntity();

    // 구독 상품 아니면 종료
    if (product.getBillingType() != BillingType.SUBSCRIPTION) {
      return;
    }

    SubscriptionEntity subscription = SubscriptionEntity.builder()
        .memberEntity(order.getMemberEntity())
        .productEntity(product)
        .productEntity(product)
        .subscriptionStatus(SubscriptionStatus.ACTIVE)
        .startDate(LocalDateTime.now())
        .endDate(
            LocalDateTime.now()
                .plusDays(product.getDuration()))
        .nextPaymentDate(
            LocalDateTime.now()
                .plusMonths(1))
        .build();

    subscriptionRepository.save(subscription);
  }
}
