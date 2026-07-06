package org.spring.backend.main.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.service.MainService;
import org.spring.backend.store.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {
    private final CommunityRepository communityRepository;
    private final ProductRepository productRepository;

    @Override //삭제예정
    public MainResponseDto defaultMain() {
        return null;
    }

}
