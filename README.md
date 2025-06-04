# 📝 SEHADANG

세하당에 오신 것을 환영합니다✨🤗
- 배포 사이트: https://react-blog-frontend-ev4g.vercel.app/


## 📌 프로젝트 소개

- *지브리 애니메이션의 감성과 디자인에서 영감을 받아 만든 개인 블로그 플랫폼입니다.*
- *사용자들이 마치 지브리 세계 속에서 글을 쓰고 여행하듯, 사용자 자신만의 이야기를 마치 애니메이션 한 장면처럼 남길 수 있습니다.*

## 📹 시연 영상
https://github.com/user-attachments/assets/c48e016e-726d-47bb-8c66-b62804a567ed


## ✨ 주요 기능
✅ 사용자 로그인 / 회원가입 (카카오 로그인 포함)

✅ 게시물 등록 / 조회 / 수정 / 삭제 기능

✅ 게시물 링크 복사

✅ 댓글 및 좋아요 기능

✅ 마이페이지에서 글 관리

✅ 사용자 비밀번호 변경

## 💡 Kick Point
🎨 지브리 감성 UI
지브리 애니메이션에서 영감을 받아 부드러운 색감, 따뜻한 여백, 손글씨 느낌의 폰트를 적용해 감성적인 사용자 경험을 구현했습니다.

✍️ 마크다운 에디터 커스터마이징
React-Quill 기반으로 블로그 글 작성에 최적화된 에디터를 구성하고, 직관적인 툴바와 반응형 UI를 적용했습니다.

🔐 JWT 기반 사용자 인증
로그인 시 Access/Refresh Token을 활용한 사용자 인증 및 토큰 재발급 로직을 직접 구현했습니다.

⚛️ SPA 기반 클라이언트 구조
React Router를 활용한 단일 페이지 앱(SPA) 구조로 페이지 전환이 빠르고 부드럽습니다.
상태 관리는 Redux Toolkit, 서버 통신은 Axios로 구성하였습니다.

⌛ 로딩 스켈레톤 UI 적용
게시글 리스트 페이지에 스켈레톤 UI를 적용하여 콘텐츠 로딩 중에도 부드러운 사용자 경험을 제공합니다.
사용자는 빈 화면 대신 뼈대 형태의 레이아웃을 보며 기다릴 수 있습니다.

🔔 React-Toastify를 활용한 알림 시스템
사용자 피드백을 명확하게 전달하기 위해 react-toastify로 성공/실패 알림, 로그인/글쓰기 완료 등 다양한 상황에 실시간 피드백을 제공합니다.

📱 반응형 웹 디자인
데스크탑과 모바일 환경 모두에 최적화된 레이아웃을 구성하여 다양한 기기에서 편리하게 사용할 수 있습니다.


## 🛠 기술 스택

### 🖥 Frontend
<p> <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/React_Router_Dom-CA4245?style=flat&logo=react-router&logoColor=white" /> <img src="https://img.shields.io/badge/React_Icons-ECECEC?style=flat&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/React_Quill-ffffff?style=flat&logo=quill&logoColor=black" /> <img src="https://img.shields.io/badge/React_Toastify-363636?style=flat&logo=react&logoColor=FFD580" /> <img src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white" /> <img src="https://img.shields.io/badge/Redux_Toolkit-FFCA28?style=flat&logo=redux&logoColor=black" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" /> </p>

### 🧠 Backend
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=white" /> <img src="https://img.shields.io/badge/CORS-004B8D?style=flat&logo=fetch&logoColor=white" /> <img src="https://img.shields.io/badge/Dotenv-8EBC00?style=flat&logo=envato&logoColor=white" /> <img src="https://img.shields.io/badge/BcryptJS-003B57?style=flat&logo=auth0&logoColor=white" /> <img src="https://img.shields.io/badge/JSONWebToken-000000?style=flat&logo=jsonwebtokens&logoColor=white" /> <img src="https://img.shields.io/badge/Cookie--Parser-845EC2?style=flat&logo=cookiecutter&logoColor=white" /> <img src="https://img.shields.io/badge/Multer-E91E63?style=flat&logo=upload&logoColor=white" /> <img src="https://img.shields.io/badge/date--fns-FF6F61?style=flat&logo=calendar&logoColor=white" /> </p>

### ☁️ DevOps
<p><img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white" /> <img src="https://img.shields.io/badge/CloudType-3C9DD0?style=flat&logoColor=white" /></p>


## 📁폴더구조
```
src/
├── apis/         # 서버와의 통신을 담당하는 API 함수 모음
├── assets/       # 이미지, 폰트 등 정적 자산
├── common/       # 공통으로 사용되는 레이아웃, 스타일, 토큰 등
├── components/   # 재사용 가능한 UI 컴포넌트
├── hooks/        # 커스텀 훅 (리액트 토스트)
├── pages/        # 라우트 별 페이지 컴포넌트
├── router/       # 라우팅 설정
├── store/        # 상태 관리 (Redux)
├── utils/        # 유틸리티 함수 모음
└── main.jsx      # 애플리케이션 진입점
```

## 📌 개선하고 싶은 사항
- 다크모드 지원
- 게시글 통계 시각화 기능
