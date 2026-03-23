// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 앞에 'export'가 반드시 있어야 다른 파일에서 'import' 할 수 있습니다.
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("❌ 토큰이 요청에 포함되지 않았습니다.");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      // ⭐ 이 로그가 중요합니다! 서버 터미널에서 확인하세요.
      console.log("❌ 토큰 검증 실패 원인:", err.message); 
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};