import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth'; // 경로 확인 필요

import { pushMemoToGithub } from '../services/githubService';

const router = express.Router();
const prisma = new PrismaClient();

// // 메모 생성
// router.post('/', authenticateToken, async (req: any, res) => {
//   const { title, problemUrl, platform, approach, failReason, solution, code } = req.body;
//   try {
//     const newMemo = await prisma.memo.create({
//       data: {
//         title, problemUrl, platform, approach, failReason, solution, code,
//         userId: req.user.id
//       }
//     });
//     res.status(201).json(newMemo);
//   } catch (error) {
//     res.status(500).json({ error: "메모 저장 실패" });
//   }
// });

router.post('/', authenticateToken, async (req: any, res) => {
  const { title, ...rest } = req.body;
  try {
    const newMemo = await prisma.memo.create({
      data: { ...req.body, userId: req.user.id }
    });

    // 메모 저장 성공 후, 해당 유저의 정보를 가져와서 GitHub 푸시 실행
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user && user.githubToken) {
      // 비동기로 실행하여 메모 저장 응답 속도에 영향을 주지 않음
      pushMemoToGithub(user, newMemo); 
    }

    res.status(201).json(newMemo);
  } catch (error) {
    res.status(500).json({ error: "메모 저장 실패" });
  }
});

// 내 메모 목록 조회
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const memos = await prisma.memo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(memos);
  } catch (error) {
    res.status(500).json({ error: "조회 실패" });
  }
});

export default router;