---
title: About
layout: page
group: navigation
comment: true
---

#### 关于我
电子科技大学通信工程本科毕业，目前在东南大学攻读硕士学位，专业是计算机科学。爱好乒乓球、动漫。近期最大的目标是把体重提高到`60kg`。

#### 关于这个博客
使用**Jekyll**+**bootstrap-3**搭建，用**markdown**写作，主题<a href="https://github.com/SenZhangAI/senzhangai.github.com">SenZhangAI</a>，托管在<a href="https://github.com/mioopoi/mioopoi.github.io" target="_blank">GitHub</a>上。

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

{% if site.url %}
RSS：[{{ site.url }}{{ '/rss.xml' }}](/rss.xml)
{% endif %}

{% include support.html %}

{% include comments.html %}
