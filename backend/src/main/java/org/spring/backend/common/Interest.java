package org.spring.backend.common;

    public enum Interest {
        //Interest Enum 구분
        DIET,
        WORKOUT,
        HEALTH;

        //product 카테고리
        public String getProductCategory() {
            return switch (this) {
                case DIET -> "다이어트";
                case WORKOUT -> "운동";
                case HEALTH -> "건강관리";
            };
        }

        //community 카테고리
        public String getCommunityCategory() {
            return switch (this) {
                case DIET -> "다이어트";
                case WORKOUT -> "운동";
                case HEALTH -> "건강";
            };
        }
    }