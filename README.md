# 🌿 DevLog PIONEER (Club Admin Dashboard)

> **개발 학습 기록을 깃허브 잔디로 자동 변환해주는 스마트 대시보드**
> 
> 팀 프로젝트나 개인 학습 내용을 기록하면, 설정한 깃허브 레포지토리에 마크다운 파일로 자동 커밋되어 '잔디'를 심어줍니다.

---

## ✨ 주요 기능 (Key Features)

- **📝 스마트 메모장**: 개발 진행 상황, 문제 해결 과정(Troubleshooting)을 구조화하여 기록.
- **🚀 GitHub 자동 연동**: OAuth 인증을 통해 본인의 깃허브 계정과 연동.
- **🌱 자동 잔디 심기**: 메모 저장 시 지정한 레포지토리에 자동으로 Push (학습 기록의 시각화).
- **📊 관리자 대시보드**: 클럽 멤버 관리 및 활동 현황 트래킹.

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React (TypeScript)
- **State Management**: Context API
- **Styling**: CSS Modules / Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (Express)
- **Database**: PostgreSQL / MySQL
- **ORM**: Prisma
- **Auth**: JWT (JSON Web Token), GitHub OAuth 2.0

---

## 🚀 시작하기 (Getting Started)

### 1. 레포지토리 클론
```bash
git clone [https://github.com/hh-32/DevLog_PIONEER-Team.git](https://github.com/hh-32/DevLog_PIONEER-Team.git)
cd DevLog_PIONEER-Team
```

### 2. 의존성 설치
#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

### 3. 환경 변수 설정 (.env)
#### 각 폴더에 .env 파일을 생성하고 아래 형식을 참고하여 입력하세요.
#### backend/ .env
```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CALLBACK_URL="http://localhost:5000/api/auth/github/callback"
```

---
### 🔗 Reference
- Project History & Documentation (Notion)
- https://www.notion.so/2026-1-DevLog_-2f1560f3453a8061b949eb07da20c7ef?source=copy_link

### 🤝 팀 정보 (Team)
- Role: Frontend Developer & Project Management

- Contact: [hahyeonchoe006@gmail.com]

---
