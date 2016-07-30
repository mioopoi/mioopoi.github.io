---
layout: post
title: "插入视频测试"
description: ""
category: "游戏"
tags: [Test,Style]
summary: ""
---

## 使用`<embed>`标签

```html
<embed width="320" height="240" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" />
```

请欣赏*AMV – 進撃の巨人*：

<embed width="320" height="240" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" />

## 使用`<video>`标签

```html
<video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png">
      <source id="mp4" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" type="video/mp4">
      <p>Your user agent does not support the HTML5 Video element.</p>
    </video>
```

这是一段游戏的资料片：

<video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png">
<source id="mp4" src="https://www.jiumodiary.com/videos/titan/titan1.mp4" type="video/mp4">
<p>Your user agent does not support the HTML5 Video element.</p>
</video>