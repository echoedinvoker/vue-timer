# 基於 Node.js 創建 Docker 映像
FROM node:lts-alpine

# 安裝 Vue CLI
RUN npm install -g @vue/cli

# 創建 app 目錄
WORKDIR /app

# 複製 package.json 並安裝依賴項
COPY package*.json ./
RUN npm install

# 複製 app 源代碼
COPY . .

# 編譯 app
RUN npm run build

# 啟動 app
CMD [ "npm", "run", "serve" ]

