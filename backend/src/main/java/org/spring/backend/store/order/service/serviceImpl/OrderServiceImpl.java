package org.spring.backend.store.order.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.order.dto.OrderDto;
import org.spring.backend.store.order.service.OrderService;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService{

  @Override
  public void insertOrder(Long memberId, OrderDto orderDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertOrder'");
  }

  @Override
  public List<OrderDto> orderList(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'orderList'");
  }

  @Override
  public OrderDto orderDetail(Long orderId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'orderDetail'");
  }

  @Override
  public void cancelOrder(Long orderId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'cancelOrder'");
  }

  @Override
  public void updateOrderStatus(Long orderId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateOrderStatus'");
  }
  
}
