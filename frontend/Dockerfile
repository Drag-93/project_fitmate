# Build Stage
FROM node:22 AS builder

WORKDIR /app

# 패키지 파일 먼저 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 복사
COPY . .

# React 빌드
RUN npm run build


# Run Stage
FROM nginx:alpine

# React 빌드 결과물을 Nginx 기본 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]