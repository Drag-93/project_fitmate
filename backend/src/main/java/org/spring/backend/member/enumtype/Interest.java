package org.spring.backend.member.enumtype;

    public enum Interest {
        //Interest Enum 구분
        DIET,
        WORKOUT,
        HEALTH;

        //product 카테고리
        public String getProductCategory() {
            return switch (this) {
                case DIET -> "다이어트";
                case WORKOUT -> "헬스장";
                case HEALTH -> "PT";
            };
        }

        //community 카테고리
        public String getCommunityTabName() {
            return switch (this) {
                case DIET -> "자유게시판";
                case WORKOUT -> "자유게시판";
                case HEALTH -> "자유게시판";
            };
        }
    }