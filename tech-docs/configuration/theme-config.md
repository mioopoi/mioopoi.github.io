# 主题配置指南

## 概述
本指南详细说明博客主题的各项配置选项，帮助您自定义博客的外观和功能。

## 基本配置

### 站点信息 (_config.yml)
```yaml
# 站点基础信息
title: "你的博客标题"
description: "你的博客描述"
url: "https://yourdomain.com"
author:
  name: "你的姓名"
  email: "your@email.com"
  github: "yourusername"
```

### 导航菜单配置
在 `_config.yml` 中配置导航菜单：
```yaml
navigation:
  - title: "首页"
    url: "/"
  - title: "关于"
    url: "/about"
  - title: "归档"
    url: "/archive"
```

## 样式自定义

### CSS 变量定义
在 `assets/css/style.css` 中定义主题变量：
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-size: 16px;
  --line-height: 1.6;
}
```

### 颜色主题配置
```css
/* 浅色主题（默认） */
.theme-light {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e9ecef;
}

/* 暗色主题 */
.theme-dark {
  --bg-color: #1a1a1a;
  --text-color: #e9ecef;
  --border-color: #495057;
}
```

## 功能配置

### 评论系统
配置 Gitalk 评论系统：
```yaml
# _config.yml
gitalk:
  clientID: "your_client_id"
  clientSecret: "your_client_secret"
  repo: "your_repo_name"
  owner: "your_github_username"
  admin: ["your_github_username"]
```

### 搜索功能
启用本地搜索：
```yaml
# _config.yml
search:
  enabled: true
  engine: "fuse.js"  # 或 "lunr.js"
  index_path: "/search.json"
```

### 分析统计
配置网站统计：
```yaml
# _config.yml
analytics:
  cnzz:
    uid: "your_cnzz_uid"
  google_analytics: "UA-XXXXX-X"
```

## 页面布局配置

### 首页布局
修改 `index.html` 来自定义首页布局：
- 文章列表显示数量
- 侧边栏组件
- 分页设置

### 文章页面
在 `_layouts/post.html` 中配置：
- 文章目录显示
- 相关文章推荐
- 分享按钮

### 分类和标签页
配置分类和标签的显示方式：
- 分类页面模板
- 标签云样式
- 归档页面布局

## SEO 配置

### 元数据设置
```yaml
# _config.yml
seo:
  title: "SEO 优化标题"
  description: "SEO 优化描述"
  keywords: "关键词1, 关键词2, 关键词3"
  og_image: "/assets/images/og-image.jpg"
```

### 结构化数据
添加结构化数据标记：
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ page.title }}",
  "datePublished": "{{ page.date | date_to_xmlschema }}",
  "dateModified": "{{ page.last_modified_at | date_to_xmlschema }}"
}
</script>
```

## 性能优化配置

### 图片优化
```yaml
# _config.yml
image:
  lazy_loading: true
  webp_support: true
  compression_quality: 85
```

### 资源压缩
启用 Jekyll 的压缩功能：
```yaml
# _config.yml
compress_html:
  clippings: all
  comments: ["<!-- ", " -->"]
  endings: [html, head, body, li, h1, h2, h3, h4, h5, h6, p, pre, code]
```

## 第三方服务集成

### 社交媒体
配置社交媒体链接：
```yaml
# _config.yml
social:
  weibo: "your_weibo_id"
  zhihu: "your_zhihu_id"
  twitter: "your_twitter"
  linkedin: "your_linkedin"
```

### 内容分发网络 (CDN)
配置 CDN 加速：
```yaml
# _config.yml
cdn:
  css: "https://cdn.yoursite.com/css/"
  js: "https://cdn.yoursite.com/js/"
  images: "https://cdn.yoursite.com/images/"
```

## 响应式设计配置

### 断点设置
```css
/* 自定义断点 */
:root {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

### 移动端优化
- 触摸友好的按钮尺寸
- 移动端导航菜单
- 图片自适应缩放

## 浏览器兼容性

### 支持的浏览器
- Chrome (最新 2 个版本)
- Firefox (最新 2 个版本)
- Safari (最新 2 个版本)
- Edge (最新 2 个版本)

### 降级方案
为不支持现代 CSS 特性的浏览器提供降级方案：
```css
/* Flexbox 降级 */
.flex-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}
```

## 维护和更新

### 定期检查项目
- 依赖库版本更新
- 安全补丁应用
- 性能监控

### 备份策略
- 配置文件备份
- 内容版本控制
- 定期导出数据

## 常见问题

### Q: 如何更换博客 Logo？
A: 替换 `assets/images/logo.png` 文件，并更新 `_config.yml` 中的相关配置。

### Q: 如何添加自定义字体？
A: 在 `assets/fonts/` 目录添加字体文件，并在 CSS 中定义 font-face。

### Q: 如何自定义代码高亮主题？
A: 选择合适的 rouge 主题，或使用 Prism.js 等第三方库。

### Q: 如何添加新的页面布局？
A: 在 `_layouts/` 目录创建新的布局文件，并在 YAML Front Matter 中指定。

## 参考资源
- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [Bootstrap 官方文档](https://getbootstrap.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

---
**最后更新**: 2026-01-02  
**版本**: v1.0