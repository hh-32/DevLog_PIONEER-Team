import { Octokit } from "@octokit/rest";

export const pushMemoToGithub = async (user: any, memo: any) => {
  if (!user.githubToken || !user.githubRepo) return;

  const octokit = new Octokit({ auth: user.githubToken });

  // 마크다운 내용 구성
  const content = `
# ${memo.title}
- 날짜: ${new Date().toLocaleDateString()}
- 문제 링크: ${memo.problemUrl || '없음'}

## 💡 접근 방식
${memo.approach}

## ⚠️ 실패 원인
${memo.failReason || '없음'}

## ✅ 해결 방법
${memo.solution}

## 💻 코드
\`\`\`
${memo.code || ''}
\`\`\`
  `;

  const fileName = `logs/${new Date().getTime()}-${memo.title.replace(/\s+/g, '_')}.md`;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: user.githubId, // 사용자의 GitHub ID
      repo: user.githubRepo,
      path: fileName,
      message: `📝 DevLog: ${memo.title} 학습 기록 추가`,
      content: Buffer.from(content).toString("base64"),
    });
    console.log("GitHub Push 성공!");
  } catch (error) {
    console.error("GitHub Push 실패:", error);
  }
};