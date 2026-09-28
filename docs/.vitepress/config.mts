import { defineConfig } from 'vitepress'
import { createSeoHead } from './seo'

const siteUrl = process.env.SITE_URL
const siteOrigin = new URL(siteUrl || 'https://seo.itkdm.com').origin

export default defineConfig({
  lang: 'zh-CN', title: '布吉岛出海增长指南',
  description: '从需求挖掘、产品验证到 SEO 与广告增长，陪你一步一步做出自己的出海生意。',
  cleanUrls: true, lastUpdated: true,
  sitemap: { hostname: siteOrigin },
  head: [
    ['meta', { name: 'theme-color', content: '#f7f7f2' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/favicon.png' }],
    ['link', { rel: 'describedby', href: '/llms.txt' }]
  ],
  transformHead({ pageData, siteData, title, description }) {
    return createSeoHead({ pageData, siteData, title, description, siteUrl })
  },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '布吉岛出海增长指南标志' }, siteTitle: '布吉岛出海增长指南',
    nav: [
      { text: '入门', link: '/getting-started/' },
      { text: '找方向', link: '/research/' },
      { text: '做产品', link: '/product/' },
      { text: '搞流量', link: '/growth/' },
      { text: '做变现', link: '/monetization/' },
      { text: '实战案例', link: '/cases/' },
      { text: '工具', link: '/tools/' }
    ],
    sidebar: {
      '/getting-started/': [{ text: '入门', items: [
        { text: '概览', link: '/getting-started/' }
      ] }],
      '/research/': [{ text: '找方向', items: [
        { text: '概览', link: '/research/' }
      ] }],
      '/product/': [{ text: '做产品', items: [
        { text: '概览', link: '/product/' }
      ] }],
      '/seo/': [{ text: 'SEO 增长', items: [
        { text: '从这里开始', link: '/seo/' }, { text: '关键词研究与内容地图', link: '/seo/keyword-research' }, { text: '新站技术 SEO 清单', link: '/seo/technical-seo' }
      ] }],
      '/growth/': [{ text: '搞流量', items: [
        { text: '概览', link: '/growth/' }
      ] }],
      '/monetization/': [{ text: '做变现', items: [
        { text: '概览', link: '/monetization/' }
      ] }],
      '/cases/': [{ text: '实战案例', items: [{ text: '概览', link: '/cases/' }] }],
      '/tools/': [{ text: '工具', items: [{ text: '概览', link: '/tools/' }] }]
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' }, lastUpdated: { text: '最后更新于' },
    footer: { message: '从一个需求开始，做自己的互联网生意。', copyright: 'Copyright © 2026 布吉岛' }
  }
})
