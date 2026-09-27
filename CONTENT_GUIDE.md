# 页面元数据规范

页面 frontmatter 只填写内容相关元数据；canonical、Open Graph、Twitter Card 和结构化数据由 VitePress 配置统一生成。

## 字段

每个公开页面必填：

- `title`：页面的搜索与浏览器标题。写清页面主题，避免全站重复。
- `description`：页面摘要，会输出为 meta description 和分享描述。每页单独撰写，简要说明页面内容。

按需填写：

- `date`：首次发布日期，格式为 `YYYY-MM-DD`。仅在日期明确且页面显示发布日期时填写。
- `author`：作者与全站默认作者不同时填写。
- `ogImage`：需要为单页定制社交分享图时填写。未填写时使用 `docs/public/social/default-share-v2.jpg`（1200 × 630）。默认图不嵌入页面标题，分享标题和摘要由页面元数据提供。
- `ogImageAlt`：仅在填写了 `ogImage` 且图片含义无法由页面标题表达时填写。
- `noindex: true`：页面需要发布但不希望进入搜索索引时填写；默认不输出 robots 指令。
- `lastUpdated`：通常不手动填写。VitePress 的 `lastUpdated: true` 使用文件最近一次 Git 提交时间；只有需要人工覆盖时才填写。

不使用 `keywords`/TDK 中的 K 作为 `<meta name="keywords">`。目标搜索词属于选题研究和内容规划，不作为页面头部字段输出。`summary`、`tags` 等站内展示字段等到有列表/筛选需求时再引入。

## 站点级 SEO

VitePress 内建 sitemap 由 `docs/.vitepress/config.mts` 中的 `sitemap.hostname` 启用。`docs/public/robots.txt` 允许通用爬虫、搜索爬虫和 AI 搜索/训练爬虫访问，并声明 sitemap。`docs/public/llms.txt` 只维护人工精选的核心入口，不复制全站 sitemap；站点 head 通过 `rel="describedby"` 提供发现入口。

## 示例

```yaml
---
title: 验证关键词机会：用搜索需求筛选产品方向
description: 通过搜索词、趋势和搜索结果判断一个出海产品方向是否存在稳定需求。
date: 2026-09-24
author: 布吉岛
noindex: true
---
```

正式站点域名为 `https://seo.itkdm.com`。GitHub Actions 构建时会设置 `SITE_URL`；本地如需检查正式 SEO 标签，也可设置此变量。VitePress 会结合 `base` 生成 canonical、绝对分享图地址和结构化数据；未设置时暂不输出依赖域名的标签。

```powershell
$env:SITE_URL = 'https://seo.itkdm.com'
pnpm docs:build
```
