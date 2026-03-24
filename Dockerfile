# Use the official Microsoft Playwright image
# 使用官方 Playwright 镜像 (内置了 Node 和所有浏览器)
FROM mcr.microsoft.com/playwright:v1.42.0-jammy

# Set working directory / 设置工作目录
WORKDIR /app

# Copy package files / 复制依赖文件
COPY package*.json ./

# Install dependencies / 安装依赖
RUN npm i

# Copy the rest of the code / 复制剩余代码
COPY . .

# Default command to run tests / 默认运行命令
CMD ["npx", "playwright", "test"]