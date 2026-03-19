// Simplified Notification Script / 简易通知脚本
const axios = require('axios');

async function notify() {
  const webhookUrl = process.env.WEBHOOK_URL; 
  if (!webhookUrl) return;

  await axios.post(webhookUrl, {
    msg_type: "text",
    content: {
      text: "🚀 Playwright Automation Report: Tests Completed! \n报告已生成，请前往 GitHub Actions 查看。"
    }
  });
}

notify();