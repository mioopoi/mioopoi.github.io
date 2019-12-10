---
title: About
layout: page
group: navigation
comments: true
---

### 关于我

90后。2015年本科毕业于[电子科技大学](http://www.uestc.edu.cn/)，随后推免至[东南大学](http://www.seu.edu.cn/)直硕，2018年获得东南大学计算机科学硕士学位。

- **关注领域** 数据技术, 数据挖掘, 机器学习, 推荐系统, 运筹优化
- **兴趣爱好** 乒乓球, 音乐, 动画, CSGO
- **短期目标** 深入理解Hadoop, Spark, Flink等数据技术组件
- **长期目标** (不好意思写出来喵
- **最近阅读** 《大学之路》（吴军 著）

### News!

- `2018.07.02` 我入职网易了，是一名数据挖掘工程师🆙
- `2018.06.12` 学位论文答辩顺利，被授予「工学硕士」学位。学园生活即将结束了 (一丝伤感❤️
- `2018.11.01` 我的秋招顺利结束了，决定签约网易啦😊
- `2017.12.20` 我的第一篇学术论文*Optimal Rate Schedules with Data Sharing in Energy Harvesting Communication Systems*被录用了 (科研菜鸟小心愿达成😀

### 关于这个Blog
使用**[Jekyll](https://jekyllrb.com/)** + **[Bootstrap-3](http://v3.bootcss.com/)**搭建，用**[Markdown](http://sspai.com/25137)**写作，托管在[GitHub](https://github.com/mioopoi/mioopoi.github.io)上，主题来自[SenZhangAI](https://github.com/SenZhangAI/senzhangai.github.com)。

搭建这个网站没有什么特别的原因，初衷大概是觉得有个属于自己的Blog会很**酷**，完全就是自己的空间，想写什么就写什么，可以在这里贴上许多有趣的内容，功能不够了还可以自己开发，正所谓自己动手丰衣足食。更重要的是，有时一些零碎的想法几句话说不完，就想汇成文章，或发表观点、或总结知识、或记录生活，以起到记录和重塑思维的作用。

Anyway，如果这里的东西对你有或多或少的启发，我会很开心的。


### 联系我

{% if site.author.email %}
Email：{{ site.author.email }}
{% endif %}

WeChat: `lhf199308` (备注信息: `ihuafan.com`)

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
