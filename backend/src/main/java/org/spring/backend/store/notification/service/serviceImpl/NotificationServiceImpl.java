package org.spring.backend.store.notification.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.notification.dto.NotificationDto;
import org.spring.backend.store.notification.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService{

  @Override
  public void insertNotification(Long memberId, NotificationDto notificationDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertNotification'");
  }

  @Override
  public List<NotificationDto> notificationList(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'notificationList'");
  }

  @Override
  public int unreadCount(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'unreadCount'");
  }

  @Override
  public void readNotification(Long notificationId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'readNotification'");
  }

  @Override
  public void readAllNotification(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'readAllNotification'");
  }

  @Override
  public void deleteNotification(Long notificationId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteNotification'");
  }
  
}
