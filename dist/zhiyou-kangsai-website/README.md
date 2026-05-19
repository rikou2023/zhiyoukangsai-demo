# 智优康赛官网

这是智优康赛 GEO 服务商官网源码，包含前端页面、Python 后端服务和 Excel 表单数据库。

## 项目结构

```text
website/              前端页面与静态资源
server/               Python 后端服务
database/             表单数据，自动生成 leads.xlsx / leads.json
deploy/               Windows、macOS、Linux 一键部署脚本
```

## 一键启动

Windows：

```text
双击 deploy/deploy-windows.bat
```

macOS / Linux：

```bash
chmod +x deploy/deploy-unix.sh
./deploy/deploy-unix.sh
```

默认访问：

```text
http://127.0.0.1:8000
```

## 配置

复制 `deploy/.env.example` 为 `deploy/.env` 后可调整：

```text
HOST=0.0.0.0
PORT=8000
```

## 接口

- `GET /health`：服务健康检查
- `GET /ready`：数据文件就绪检查
- `GET /api/logos`：读取合作品牌 Logo
- `POST /api/contact`：接收官网表单并写入 Excel

## 表单数据

表单提交会写入：

```text
database/leads.xlsx
database/leads.json
```

Excel 表头和样式会由后端自动创建。
