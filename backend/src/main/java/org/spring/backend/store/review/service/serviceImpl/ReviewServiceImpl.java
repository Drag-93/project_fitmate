package org.spring.backend.store.review.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.review.dto.ReviewDto;
import org.spring.backend.store.review.service.ReviewService;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService{

  @Override
  public void insertReview(Long memberId, ReviewDto reviewDto, Long orderId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertReview'");
  }

  @Override
  public List<ReviewDto> reviewListByProduct(Long productId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'reviewListByProduct'");
  }

  @Override
  public ReviewDto reviewDetail(Long reviewId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'reviewDetail'");
  }

  @Override
  public void updateReview(Long reviewId, ReviewDto reviewDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateReview'");
  }

  @Override
  public void deleteReview(Long reviewId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteReview'");
  }

  @Override
  public List<ReviewDto> myReviewList(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'myReviewList'");
  }
  
}
