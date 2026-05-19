# 智优康赛官网一键部署

## 快速配置

复制配置文件：

```bash
cp deploy/.env.example deploy/.env
```

常用配置：

```text
HOST=0.0.0.0
PORT=8000
```

服务器对外访问建议保留 `HOST=0.0.0.0`。只在本机预览可改成 `HOST=127.0.0.1`。

## Windows

双击：

```text
deploy/deploy-windows.bat
```

或在 PowerShell 执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\deploy-windows.ps1
```

## macOS / Linux

首次给脚本执行权限：

```bash
chmod +x deploy/deploy-unix.sh deploy/deploy-unix.command
```

启动：

```bash
./deploy/deploy-unix.sh
```

macOS 也可以双击 `deploy/deploy-unix.command`。

## 运行结果

脚本会自动完成：

- 创建 `.venv` 虚拟环境
- 安装后端依赖
- 初始化 `database/leads.xlsx`
- 启动官网服务

默认访问：

```text
http://127.0.0.1:8000
```

## 数据位置

表单提交会写入：

```text
database/leads.xlsx
database/leads.json
```
