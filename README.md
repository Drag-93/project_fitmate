# Git 규칙

## 작업 순서

### 1. 작업 시작 전

항상 최신 dev를 먼저 받아옵니다.

```bash
git checkout dev
git pull origin dev

git checkout 본인브랜치
git merge dev
```

---

### 2. 작업

```bash
git add .
git commit -m "작업 내용"
```

---

### 3. 개인 브랜치 업로드

```bash
git push origin 본인브랜치
```

---

### 4. dev에 반영

최신 dev를 다시 받아온 후 merge합니다.

```bash
git checkout dev
git pull origin dev

git merge 본인브랜치
git push origin dev
```

---

## push가 거부될 경우

다른 팀원이 먼저 dev를 업데이트한 경우입니다.

다시 최신 dev를 받아온 뒤 merge하면 됩니다.

```bash
git checkout dev
git pull origin dev

git merge 본인브랜치
git push origin dev
```

---

## 협업 규칙

* 모든 작업은 개인 브랜치에서 진행합니다.
* dev에 merge하기 전에는 항상 `git pull origin dev`를 실행합니다.
* merge 후 프로젝트가 정상 실행되는지 확인한 뒤 dev에 push합니다.
* 기능 단위로 commit하는 것을 권장합니다.


## 브랜치

* main : 최종 배포용 (팀장만 관리)
* dev : 개발 브랜치 (팀원 모두 사용)
* yg : 이용근 개인 브랜치
* ws : 김우송 개인 브랜치
* jh : 김주희 개인 브랜치
* lhs : 이현성 개인 브랜치
