---
title: About
layout: page
group: navigation
comments: true
---

#### 关于我
本科毕业于[电子科技大学](http://www.uestc.edu.cn/) (通信与信息工程学院)，目前在东南大学攻读硕士学位，专业是计算机科学。

爱好乒乓球、动画、设计...以及一些新奇的东西。

近期最大的目标是把体重提高到`60kg`。

#### 关于这个Blog
使用**Jekyll**+**Bootstrap-3**搭建，用**Markdown**写作，托管在[GitHub](https://github.com/mioopoi/mioopoi.github.io)上，主题来自[SenZhangAI](https://github.com/SenZhangAI/senzhangai.github.com)前辈。

搭建这个网站没有什么特别的原因。主要大概是觉得有个属于自己的Blog会很**酷**，完全就是自己的空间，可以在这里贴上许多有趣的东西，功能不够了还可以自己开发，正所谓自己动手丰衣足食，顺便也学习一些前端的知识。

Anyway，如果这里的东西对你有或多或少的启发，我会很开心的。

#### 联系我

{% if site.author.email %}
Email：{{ site.author.email }}
{% endif %}

{% if site.author.weibo %}
Weibo：<http://weibo.com/{{ site.author.weibo }}>
{% endif %}

{% if site.author.github %}
Github：<https://github.com/{{ site.author.github }}>
{% endif %}

{% if site.author.twitter %}
Twitter：<https://twitter.com/{{ site.author.twitter }}>
{% endif %}

新浪微博: <a href="http://weibo.com/u/2386317781", target="_blank">虾米小华</a>

{% if site.url %}
RSS：[{{ site.url }}{{ '/rss.xml' }}](/rss.xml)
{% endif %}

{% include support.html %}
