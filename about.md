---
title: About
layout: page
group: navigation
comments: true
---

### 关于我

90后。本科毕业于[电子科技大学](http://www.uestc.edu.cn/)通信学院，目前在东南大学攻读计算机科学硕士学位。

- **关注领域** 算法设计、机器学习、数据技术（Spark/Hive/Scala）、运筹优化
- **兴趣爱好** 乒乓球、动画、单机游戏，以及和可爱的小动物玩耍
- **短期目标** 完成网易布置的大作业！
- **最近状态** (放松.jpg

### News!

- 我的秋招顺利结束了，决定签约网易啦，职位是机器学习算法工程师 (开心
- 我的第一篇学术论文*Optimal Rate Schedules with Data Sharing in Energy Harvesting Communication Systems*被录用了 (科研菜鸟小心愿达成:smile:

### 关于这个Blog
使用**[Jekyll](https://jekyllrb.com/)** + **[Bootstrap-3](http://v3.bootcss.com/)**搭建，用**[Markdown](http://sspai.com/25137)**写作，托管在[GitHub](https://github.com/mioopoi/mioopoi.github.io)上，主题来自[SenZhangAI](https://github.com/SenZhangAI/senzhangai.github.com)前辈。

搭建这个网站没有什么特别的原因，主要大概是觉得有个属于自己的Blog会很**酷**，完全就是自己的空间，想写什么就写什么。另外就是有时一些零碎的想法几句话说不完，就想汇成文章，或发表观点、或总结知识、或重塑思维，可以在这里贴上许多有趣的内容，功能不够了还可以自己开发，正所谓自己动手丰衣足食。

Anyway，如果这里的东西对你有或多或少的启发，我会很开心的。


### 联系我

{% if site.author.email %}
Email：{{ site.author.email }}
{% endif %}

QQ: `864439764` (备注请告知职业~)

{% if site.author.weibo %}
Weibo：<http://weibo.com/{{ site.author.weibo }}>
{% endif %}

{% if site.author.github %}
Github：<https://github.com/{{ site.author.github }}>
{% endif %}

{% if site.author.twitter %}
Twitter：<https://twitter.com/{{ site.author.twitter }}>
{% endif %}

{% if site.author.zhihu %}
Zhihu: <{{ site.author.zhihu }}>
{% endif %}

{% if site.url %}
RSS：[{{ site.url }}{{ '/rss.xml' }}](/rss.xml)
{% endif %}

{% include support.html %}
