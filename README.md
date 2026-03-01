# 弱菜的自我修养

个人技术博客，记录学习和思考的点滴。

## 技术栈

- **静态站点生成器**: Jekyll
- **前端框架**: Bootstrap 5
- **主题系统**: 支持亮色/暗色模式切换
- **图标系统**: SVG 图标
- **评论系统**: Gitalk
- **代码高亮**: Pygments

## 特性

- ✨ 现代化的设计风格，简洁优雅
- 🌓 支持亮色/暗色主题切换
- 📱 完全响应式设计，适配各种设备
- 💬 集成 Gitalk 评论系统
- 🎨 使用系统原生字体，加载速度快
- 📝 代码块支持复制、折叠等功能
- 🔍 支持站内搜索

## 本地开发

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 访问 http://localhost:4000
```

## 部署

本博客使用 GitHub Pages 自动部署，推送到 master 分支后会自动构建和发布。

## 目录结构

```
.
├── _includes/          # 页面组件
├── _layouts/           # 页面布局
├── _posts/             # 博客文章
├── assets/             # 静态资源
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript 文件
│   ├── fonts/         # 字体文件
│   └── images/        # 图片资源
├── _config.yml         # Jekyll 配置
└── index.html          # 首页
```

## 使用本主题

如果你想使用本主题，请修改以下内容：

1. 修改 `_config.yml` 中的个人信息
2. 修改 `CNAME` 文件中的域名
3. 修改 `about.md` 中的个人简介
4. 修改 `_data/blogroll.json` 中的友链

## 致谢

- 主题基于 [SenZhangAI](https://github.com/SenZhangAI/senzhangai.github.com) 的主题修改而来
- 感谢 Jekyll 和 Bootstrap 社区

## License

MIT License
