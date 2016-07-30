---
layout: post
title: "插入视频测试"
description: ""
category: "游戏"
tags: [Test,Style]
summary: ""
---

示例1：

```html
<div 
style="position: relative; 
width:100%;
padding-bottom:65%; /* 16:9 */ 
height:0;">
<video id="video" controls="" preload="none" poster="">
<source id="mp4" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" type="video/mp4">
<p>Your user agent does not support the HTML5 Video element.</p>
</video>
</div>
```

是*進撃の巨人*的一段AMV：

<div 
style="position: relative; 
width:100%;
padding-bottom:65%; /* 16:9 */ 
height:0;">
<video id="video" controls="" preload="none" poster="">
<source id="mp4" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" type="video/mp4">
<p>Your user agent does not support the HTML5 Video element.</p>
</video>
</div>

示例2：

```html
<div 
style="position: relative; 
width:100%;
padding-bottom:65%; /* 16:9 */ 
height:0;">
<video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png">
  <source id="mp4" src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
  <source id="webm" src="http://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm">
  <source id="ogv" src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg">
  <p>Your user agent does not support the HTML5 Video element.</p>
</video>
</div>
```

是一段游戏的资料片：

<div 
style="position: relative; 
width:100%;
padding-bottom:65%; /* 16:9 */ 
height:0;">
<video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png">
  <source id="mp4" src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
  <source id="webm" src="http://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm">
  <source id="ogv" src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg">
  <p>Your user agent does not support the HTML5 Video element.</p>
</video>
</div>