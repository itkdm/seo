# AGENTS.md

本文件是 AI Agent 在本仓库中的协作入口。修改前先阅读与任务相关的页面和配置；内容字段规则以 [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) 为准。

## 项目定位

- 布吉岛出海指南：面向独立开发者和小团队，介绍需求发现、产品验证、SEO/渠道增长与变现。
- 技术栈是 VitePress + Markdown，由 pnpm 管理。保留 VitePress 架构，不迁移到普通 Vite、React 或其他文档框架。
- 用户当前明确要求优先于本文件；不要擅自扩大改动范围或改变已确认的页面文案、视觉方案和栏目结构。

## 开发与运行

- Node.js 20+，pnpm 10+。
- `pnpm docs:dev`：启动开发服务器 `http://localhost:5181/`。
- `pnpm docs:build`：构建静态站点到 `docs/.vitepress/dist/`。
- `pnpm docs:preview -- --port 5181 --strictPort`：预览最近一次构建产物。
- 端口 5181 属于本项目。不要占用或停止 5173；相邻的 `D:\develop\aiagentguide` 项目使用 5173。
- 停止端口进程前，先检查 PID 对应的完整命令行，确认它属于当前仓库。
- 改动 VitePress 配置、SEO 逻辑或页面结构后，运行 `pnpm docs:build` 验证构建；单纯文案改动不必默认跑额外测试。

## 页面与路由

- 栏目导航、sidebar、VitePress 站点设置在 `docs/.vitepress/config.mts`。
- 栏目入口由 `index.md` 承载。目前栏目首页是简短概览，左侧侧栏只保留栏目名和“概览”链接；不要在这些栏目首页侧栏重新列出所有教程，除非用户明确要求。
- 主要栏目路由：
  - `/getting-started/` 入门
  - `/research/` 找方向
  - `/product/` 做产品
  - `/growth/` 搞流量
  - `/monetization/` 做变现
  - `/cases/` 实战案例
  - `/tools/` 工具
- SEO 专题文档保存在 `docs/seo/`，链接由“搞流量”栏目引导。
- 移动或重命名页面时，同时更新 VitePress 侧栏、站内链接和 frontmatter；避免无必要地改变公开 URL。

## SEO 与元数据

- 先读 [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)。所有公开页面必填 `title` 和 `description`。
- `keywords` 不进入 frontmatter SEO 模板，也不生成 `<meta name="keywords">`。用户的搜索词研究属于选题规划，不能将 meta keywords 与关键词研究混为一谈。
- 全站默认分享图为 `docs/public/social/default-share.png`。`ogImage` 仅作为个别页面的覆盖项，不要求每篇文章准备图片。
- `date` 只在发布日期明确且页面同步展示时填写；`lastUpdated` 默认由 VitePress 的 Git 时间提供，不要手动重复维护。
- `author`、`noindex` 按需填写。除非用户明确要求，不要给现有页面编造日期、作者或索引状态。
- SEO head 生成逻辑位于 `docs/.vitepress/seo.ts`。保持 canonical、Open Graph、Twitter Card、robots 与结构化数据由此集中生成，不要在页面 frontmatter 手写重复的 head 标签。
- 正式站点域名为 `https://seo.itkdm.com`。GitHub Actions 构建时通过 `SITE_URL` 注入正式域名，生成 canonical、绝对分享图 URL 和结构化数据；本地未配置时不会输出依赖域名的标签。

## 内容与资源

- 页面内容写在 `docs/` 下的 Markdown 文件。
- 图片、favicon 和其他公开静态资源放在 `docs/public/`，使用以 `/` 开头的站点路径引用。
- 保持正文简明、面向读者；栏目概览只说明本栏目主题和后续内容，不将完整教程塞入概览页。
- 改路由或栏目命名时，先全仓搜索旧 URL 并更新引用，不要只改导航文字。
- 不要提交 `.env`、本地密钥、构建输出 `docs/.vitepress/dist/` 或 `node_modules/`。
- 未经用户明确要求，不要提交或推送 Git commit，也不要向外部服务发布项目。用户已明确授权本次初始化、提交推送并部署至 GitHub Pages。
