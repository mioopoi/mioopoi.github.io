# 技术文档目录说明

## 目录结构

```
tech-docs/
├── README.md          # 本文档 - 技术文档目录说明
├── upgrade/           # 升级相关文档
│   ├── 2026-01-02-bootstrap5-migration.md    # Bootstrap 5 升级记录
│   ├── 2026-01-02-jekyll-upgrade.md         # Jekyll 升级记录
│   └── ...           # 其他升级文档
├── configuration/     # 配置相关文档
│   ├── theme-config.md    # 主题配置指南
│   ├── seo-setup.md       # SEO 设置指南
│   └── ...            # 其他配置文档
├── troubleshooting/   # 问题排查文档
│   ├── common-issues.md   # 常见问题解决方案
│   ├── performance-issues.md # 性能问题排查
│   └── ...            # 其他问题排查文档
├── development/       # 开发相关文档
│   ├── coding-standards.md # 编码规范
│   ├── deployment-guide.md # 部署指南
│   └── ...            # 其他开发文档
└── changelog/         # 版本变更记录
    ├── v2.0-changelog.md   # v2.0 版本变更
    ├── v1.1-changelog.md   # v1.1 版本变更
    └── ...            # 其他版本记录
```

## 文档类型说明

### upgrade/
专门存放框架和技术栈升级相关的文档，包括：
- 升级计划文档
- 升级实施记录
- 升级过程中遇到的问题和解决方案
- 升级后的测试和验证结果

### configuration/
存放各种配置相关的文档，包括：
- 主题配置指南
- SEO 设置
- 第三方服务集成配置
- 性能优化配置

### troubleshooting/
问题排查和故障排除文档，包括：
- 常见问题及解决方案
- 性能问题排查指南
- 兼容性问题处理
- 调试技巧

### development/
开发相关的文档，包括：
- 编码规范和标准
- 部署流程和指南
- 开发环境搭建
- 代码贡献指南

### changelog/
版本变更记录，包括：
- 每个版本的详细变更记录
- 破坏性变更说明
- 升级指南

## 文档命名规范

### 时间戳格式
- 文档名包含日期：YYYY-MM-DD-descriptive-name.md
- 示例：2026-01-02-bootstrap5-migration.md

### 版本标签
- 版本变更文档使用版本号：v2.0-changelog.md
- 功能特性文档使用功能描述：theme-config.md

### 语言
- 所有技术文档使用中文撰写
- 特殊技术术语可保留英文原文
- 代码注释和示例使用英文

## 维护原则

### 及时更新
- 每次技术变更后及时更新相关文档
- 确保文档与实际代码同步
- 重要变更需要在多个相关文档中保持一致

### 易于查找
- 文档分类清晰，命名规范
- 重要文档在 README.md 中有索引
- 使用一致的文档结构和格式

### 质量保证
- 文档内容准确、完整
- 代码示例经过测试验证
- 包含必要的截图或示例

## 贡献指南

如果您需要添加新的技术文档，请：

1. 选择合适的分类目录
2. 按照命名规范命名文件
3. 使用标准模板结构（如果适用）
4. 在本文档中添加新文档的索引

## 索引

### 最新文档
- [2026-01-03 博客升级实施记录](upgrade/2026-01-03-blog-upgrade-implementation.md) - 博客架构升级的详细实施记录
- [2026-01-02 博客升级方案](upgrade/2026-01-02-blog-upgrade-plan.md) - 完整的博客升级计划

### 重要配置
- [主题配置指南](configuration/theme-config.md) - 博客主题自定义配置

### 常见问题
- [常见问题解决方案](troubleshooting/common-issues.md) - 技术问题和解决方案

---

**最后更新**: 2026-01-03  
**维护者**: Huafan Li  
**联系方式**: 通过 GitHub Issues 反馈文档问题