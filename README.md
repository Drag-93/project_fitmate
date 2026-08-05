# FitMate

> 스케줄 관리, 커뮤니티, 구독 서비스와 헬스장 CRM을 하나의 플랫폼으로 통합한 Full Stack 웹 서비스

FitMate는 운동을 지속하기 어려운 사용자와 회원 관리에 어려움을 겪는 헬스장을 위해 개발한 
운동 관리와 헬스장 CRM을 통합한 플랫폼입니다.

사용자는 운동 루틴 생성, 스케줄 관리, 커뮤니티, PT 예약, 이용권 구매 및 구독 서비스를 이용할 수 있으며,
관리자는 회원, 상품, 예약, 결제, 커뮤니티, 팝업 관리와 함께 **대시보드를 통해 핵심 운영 지표를 한눈에 확인**할 수 있습니다.

프로젝트에서는 **팀장 역할을 맡아 프로젝트 구조 설계와 Git 협업 환경을 구축**하였고,
**관리자 대시보드, 공통 컴포넌트(Calendar · Kakao Map), CI/CD 구축, CRM 기능 구현**을 담당했습니다.


## 📋 프로젝트 정보

| 구분 | 내용 |
|------|------|
| 프로젝트명 | FitMate |
| 개발 기간 | **2026.06.26 ~ 2026.07.31** |
| 개발 인원 | 4명 |
| 프로젝트 형태 | Spring Boot + React 기반 팀 프로젝트 |
| 담당 역할 | 팀장 · 관리자 기능 개발 · Calendar / Kakao Map 공통 컴포넌트 · CI/CD 구축 |
| 배포 환경 | Docker · Docker Hub · GitHub Actions · AWS EC2 |



## 🛠 기술 스택
### Front-End

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=Redux&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/>
</p>

### Back-End

<p>
  <img src="https://img.shields.io/badge/Java_17-007396?style=for-the-badge&logo=OpenJDK&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=SpringSecurity&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=Spring&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/OAuth2-4285F4?style=for-the-badge"/>
</p>

### Database & Messaging

<p>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=RabbitMQ&logoColor=white"/>
</p>

### DevOps

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker_Hub-2496ED?style=for-the-badge&logo=Docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=GitHubActions&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=Nginx&logoColor=white"/>
</p>

### API

<p>
  <img src="https://img.shields.io/badge/Kakao_Map_API-FFCD00?style=for-the-badge&logo=Kakao&logoColor=black"/>
  <img src="https://img.shields.io/badge/KakaoPay-FFCD00?style=for-the-badge&logo=Kakao&logoColor=black"/>
  <img src="https://img.shields.io/badge/ExerciseDB_API-2563EB?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/OpenWeather_API-EB6E4B?style=for-the-badge&logo=OpenWeatherMap&logoColor=white"/>
</p>

### Collaboration

<p>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>
  <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=GoogleSheets&logoColor=white"/>
  <img src="https://img.shields.io/badge/ERDCloud-4A90E2?style=for-the-badge"/>
</p>

## 🏗 시스템 아키텍처

React와 Spring Boot 기반의 Full Stack 구조로, Nginx를 통해 정적 파일 제공 및 API 요청을 처리합니다.

데이터는 MySQL에 저장하며, Redis는 캐시 및 세션 관리, RabbitMQ는 메시지 브로커로 구성하였습니다.

<p align="center">
  <img src="./readmeimg/시스템 아키텍처.png" width="900">
</p>

---

## 🚀 CI/CD 파이프라인

GitHub Flow 전략을 기반으로 Dev 브랜치에서 기능을 검증한 후
Main 브랜치에 병합하면 GitHub Actions가 자동으로 빌드 및 배포를 수행합니다.

Docker 이미지를 Docker Hub에 업로드하고, EC2에서 최신 이미지를 가져와 Docker Compose를 통해 서비스를 실행하도록 구성하였습니다.

<p align="center">
  <img src="./readmeimg/파이프라인.png" width="900">
</p>





