import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 1. GitHub 인증 페이지로 리다이렉트
router.get('/github', authenticateToken, (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`;
  // 세션이나 임시 저장을 통해 현재 로그인한 사용자를 추적하기 위해 state 등을 사용할 수 있지만, 
  // 여기서는 단순화를 위해 클라이언트에서 처리하는 방식을 가이드합니다.
  res.json({ url: githubAuthUrl });
});

// 2. GitHub에서 인증 후 돌아오는 콜백 (Callback)
router.get('/github/callback', async (req, res) => {
  const { code } = req.query; // GitHub이 보내준 임시 코드

  try {
    // 코드를 Access Token으로 교환
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 해당 토큰으로 GitHub 유저 정보 가져오기
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const githubId = userResponse.data.login; // GitHub 사용자 ID (예: "hacker-user")

    // TODO: 현재 로그인한 사용자의 DB 레코드에 githubId와 githubToken 업데이트
    // 이 부분은 프론트엔드에서 현재 로그인된 유저 정보를 전달받거나, 
    // 콜백 주소에 userId를 포함시키는 방식으로 처리합니다.
    
    // 성공 시 프론트엔드 특정 페이지로 리다이렉트
    res.redirect(`http://localhost:5173/dashboard?github=success&id=${githubId}&token=${accessToken}`);
  } catch (error) {
    res.status(500).json({ error: 'GitHub 인증 실패' });
  }
});

export default router;