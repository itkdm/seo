# 布吉岛出海指南

面向独立开发者和小团队的中文出海实战指南，围绕发现需求、验证产品、获得流量和实现变现展开。

## 技术栈

- [VitePress](https://vitepress.dev/) 1.6+
- Markdown 内容，Vue/Vite 驱动的静态站点构建
- pnpm 管理依赖

本项目使用 VitePress。不要因为 `vitepress` 底层使用 Vite，就把项目改造成普通 Vite/React 应用。

## 本地开发

需要 Node.js 20+ 和 pnpm 10+。

```powershell
pnpm install
pnpm docs:dev
```

开发服务器地址为 <http://localhost:5181/>。5181 是本项目端口；不要改用 5173，那个端口留给相邻的 `D:\develop\aiagentguide` 项目。

## 构建与预览

```powershell
pnpm docs:build
pnpm docs:preview -- --port 5181 --strictPort
```

预览会读取 `docs/.vitepress/dist/` 中最近一次构建产物。如果 5181 已被本项目的旧预览进程占用，先确认进程命令行属于本仓库，再停止并重启；不要终止其他项目的进程。

## 导航栏目与路由

| 导航 | 页面目录 | 路由 |
| --- | --- | --- |
| 入门 | `docs/getting-started/` | `/getting-started/` |
| 找方向 | `docs/research/` | `/research/` |
| 做产品 | `docs/product/` | `/product/` |
| 搞流量 | `docs/growth/` | `/growth/` |
| 做变现 | `docs/monetization/` | `/monetization/` |
| 实战案例 | `docs/cases/` | `/cases/` |
| 工具 | `docs/tools/` | `/tools/` |

栏目首页目前是简短概览，侧栏只显示当前栏目的“概览”。具体教程按独立 Markdown 页面维护。SEO 教程位于 `docs/seo/`，并由“搞流量”栏目引导。

## 目录结构

```text
docs/                       页面内容与静态资源
docs/.vitepress/config.mts  导航、侧栏和站点配置
docs/.vitepress/seo.ts      页面级 SEO head 标签与结构化数据
docs/.vitepress/theme/      默认主题扩展与样式
docs/public/                favicon、分享图等静态资源
CONTENT_GUIDE.md            页面元数据字段与写法
AGENTS.md                   AI Agent 项目协作规则
```

## 页面元数据

每个公开页面填写唯一的 `title` 和 `description`。`date`、`author`、`noindex` 按需使用；`ogImage` 通常省略并使用全站默认分享图，少数需要定制的页面才覆盖。更新时间默认读取 Git，`keywords` 不作为 `<meta name="keywords">` 输出。

详细规则见 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)。生产域名为 `https://seo.itkdm.com`。GitHub Actions 发布时会设置 `SITE_URL`，以输出 canonical、绝对分享图 URL 和结构化数据。

## 发布

推送到 `main` 分支后，GitHub Actions 会构建 VitePress 并部署到 GitHub Pages。仓库 Pages 发布来源需要设为 **GitHub Actions**，自定义域名设为 `seo.itkdm.com`；Cloudflare DNS 使用指向 `itkdm.github.io` 的 DNS only CNAME 记录。
