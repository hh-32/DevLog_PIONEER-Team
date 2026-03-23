import express from 'express';
import memoRoutes from './routes/memo';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import 'dotenv/config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import githubAuthRoutes from './routes/githubAuth';

const app = express();
const prisma = new PrismaClient();

// 🛡️ [보안 검사대] 토큰이 유효한지 확인하는 함수
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" 형태에서 토kn만 추출

  if (!token) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
    }
    req.user = user; // 토큰 속의 사용자 정보를 요청 객체에 담음
    next(); // 검사 통과! 다음 함수로 진행
  });
};

const JWT_SECRET = "my_super_secret_key_1234"; // 나중에는 환경변수로 관리하는 게 좋아요!

// 1. CORS 설정: 중복을 제거하고 하나로 합칩니다.
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));

// 2. 미들웨어 설정
app.use(express.json());

// 3. 라우터 연결 (변수명을 확인하세요: githubAuthRoutes 또는 githubAuth)
// 상단에서 import githubAuthRoutes from './routes/githubAuth'; 로 가져왔다고 가정합니다.
app.use('/api/auth', githubAuthRoutes); 

// 4. 메모 라우터 연결
app.use('/api/memos', memoRoutes);

// 5. 서버 테스트용 엔드포인트
app.get('/ping', (req, res) => {
  res.send('pong! 서버가 정상적으로 돌아가고 있습니다.');
});

// 6. 서버 시작 (하나의 포트만 사용합니다)
const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 정상적으로 실행 중입니다!`);
});

// 👥 팀원 전체 목록 가져오기 API
app.get('/members', async (req, res) => {
  try {
    const members = await prisma.user.findMany(); // DB에서 모든 팀원 찾아오기
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "데이터를 가져오는데 실패했습니다." });
  }
});

// 🆕 새로운 팀원 추가 API
app.post('/members', authenticateToken, async (req, res) => {
  const { name, role, task } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name: name || "Unknown",
        role: role || "Member",
        task: task || "",
        // status: "진행중",
        // 🚨 필수 항목인 email과 password에 임시 데이터를 넣어줍니다.
        email: `${Date.now()}@test.com`, // 중복되지 않게 현재 시간을 활용한 임시 메일
        password: "temp_password_1234"    // 나중에 가입 기능 만들 때 바뀔 임시 비번
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error("DB 저장 중 에러 발생:", error);
    res.status(500).json({ error: "데이터 저장에 실패했습니다." });
  }
});

// 🔐 [Step 1] 회원가입 API
app.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. 이미 가입된 이메일인지 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }

    // 2. 비밀번호 암호화 (숫자가 높을수록 보안이 강해지지만 속도가 느려집니다. 10이 적당해요!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. DB에 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "Admin", // 첫 가입자는 관리자로 설정
      },
    });

    res.json({ message: "회원가입 성공!", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
  }
});

// 🔑 [Step 2] 로그인 API
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. 유저 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "존재하지 않는 사용자입니다." });
    }

    // 2. 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // 3. 통행증(JWT) 발급 (유효기간 1일)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "로그인 성공!",
      token,
      user: { name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: "로그인 중 오류 발생" });
  }
});