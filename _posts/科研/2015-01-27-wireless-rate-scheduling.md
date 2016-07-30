---
layout: post
title: "无线通信中功率调度的优化问题"
description: "一种最简单的情形"
category: "科研"
tags: [凸优化,无线通信]
summary:
---

作者：[小华](http://mioopoi.github.io/about.html)

---

毕设课题中涉及到了一种方法，感觉应该属于凸优化，这里理一理。

## 背景简介

无线通信中，我们知道，如果通信节点发射功率越大，那么传输/发送数据的速率就越快。而且试想，随着发射功率的增大，传输速率应该是先增加得很快，随后增加得越来越缓慢，有点像对数关系。类似的比如香农公式指出了AWGN的信道传输速率的极限（关于香农公式的简介，可以戳这：[http://blog.sina.com.cn/s/blog_72dcd1890101i415.html](http://blog.sina.com.cn/s/blog_72dcd1890101i415.html)）。

## 模型

可见当年香农前辈对信道建模也是用的对数关系，直观、合理，简洁。而对于无线通信节点的发送速率和发射功率之间的关系，很多学者也是用的对数关系去建模。设速率为r，功率为p，将它们之间的关系表示如下（下面简称发送速率为“速率”、发射功率为“功率”）：

![img](http://img.blog.csdn.net/20150127144903856?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

它有以下几点性质：（1）g(p)是连续、可微的，（2）g(0)=0，且当p趋向于无穷大时，r也趋向于无穷大，（3）g(p)是p的单调增加函数，（4）g(p)是严格的凹函数（strictly concave）。这个函数大概长下面这个样子（关于凹函数和凸函数，可以戳这：[http://blog.sina.com.cn/s/blog_8e3c51d50102vts0.html](http://blog.sina.com.cn/s/blog_8e3c51d50102vts0.html)）：

![img](http://img.blog.csdn.net/20150127152757526?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

上图中，横轴是p，纵轴是r。

当然，这是一个比较笼统的模型，实际情况下可不一定是这样，比如功率无法做到连续变化，而是离散的。在IEEE 802.11协议中，功率/速率就是有一组离散的数值的。

## 问题和解决方案

这个模型下可以诞生好些问题，我们来一一列举。

### 问题1：min energy问题

现在不是要倡议建设资源节约型、环境友好型社会吗，那么问题来了：如果有一部分数据B_0已经放在通信节点的缓存中待发送，并且为了保证QoS（Quality of Service），设定一个deadline T，希望这部分数据能在deadline之前被发送出去，如何分配功率/速率，才能使消耗的能量最少（假设能量能够足够、持续地被供给）？

我们来建立这个问题的数学模型。

目标当然是使消耗的能量最少，能量等于什么？功率乘以时间，或者更严谨一些，是在时间上对功率的积分。显然，我们要做的就是找到最好的功率分配方案。设功率为p(t)，目标就是：

![img](http://img.blog.csdn.net/20150127162450656?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

当然，还有一些其他的限制条件，在deadline之前我们要把所有的数据传输完毕，传输的数据量？在时间上对速率积分：

![img](http://img.blog.csdn.net/20150127162922814?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

另外，p(t)肯定不小于0。

于是，可以整理出如下的优化模型：

![img](http://img.blog.csdn.net/20150127162055578?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

这个问题怎么解决呢？

一种直觉性的猜测是在整个时间段上功率/速率是恒定的，因为很多极大/极小的问题都是在决策变量相等时得到。也就是说，我们按速率r_0 = B_0/T来传输数据，就能消耗最少的能量。是不是这样呢？

我们先来考虑一种简单的情形，要在[0,l)内发送B（bits）数据，均匀的速率是r = B/l，现如果速率并不是“均匀的”，在前一段时间内（设长度为l_1）速率是r_1，后一段时间内（设长度为l_2）速率是r_2，并且r_1不等于r_2。显然，由于要发送的数据量都是一定的，必然是一个大于r，另一个小于r（否则这段时间内要么浪费了能量，要么根本发不完数据）。设这种情况消耗的能量是E'，则

![img](http://img.blog.csdn.net/20150127170557676?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

上式中出现了反函数，在“模型”中我们的设定使得g(p)是存在反函数的，而且它的反函数也是连续、可微，且单调增加，只不过凹凸性发生了改变——由凹函数变成了凸函数。设均匀速率分配下消耗的能量是E，则

![img](http://img.blog.csdn.net/20150127171959968?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

然后存在关系：

![img](http://img.blog.csdn.net/20150127172120027?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

其中，l_1 + l_2 = l。

下面我们就要比较E'和E的大小，按我们的猜测，即是去证明E' > E。

不妨设r_1 < r < r_2。既然g(p)的反函数是凸函数，凸函数有什么性质（定义）？

![img](http://img.blog.csdn.net/20150127190346641?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

上式中，0 < t < 1。我们要利用起这个性质，要给 t 赋一个合适的值：

![img](http://img.blog.csdn.net/20150127191731664?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmFuZmFuX1U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

为什么这样赋值，因为这样才能和E'的表达式结合起来，方便它的变形，导出我们要的不等式。于是，

![img](http://img.blog.csdn.net/20150127192920155)

我们发现，到这步就可以对中括号里的部分使用不等式了，继续：

![img](http://img.blog.csdn.net/20150127193712056)

接着，我们使用关系 r_1 * l_1 + r_2 * l_2 = r l 和 l_1 + l_2 = l，得到：

![img](http://img.blog.csdn.net/20150127194100312)

而这个等式的右边就是均匀分配速率所消耗的能量。至此，我们证明了之前的猜想。

如果把上面这种简单的情形推广到更一般的情形呢？比如，某个时间段内不是只有两种速率，而是很多种速率。其实这很好办，无论有多少种速率，我们都可以先取相邻的两段速率，将它们“均匀化”，然后依次进行下去，直到整个时间段上的速率都被“均匀化”。不难证明，在整个时间段上将速率“均匀化”消耗的能量一定是最少的。

我们来从一种更生动的角度来理解所谓的“均匀化”。在上面提到的有两种速率的分配方案中，要得到最优结果，就相当于从原来速率较大的时段中拿出一部分数据包放到速率较小的时段中去发送，以使得两个时段的速率相等，其实也就是使两个时段的功率相等。也就是给每bit数据的传输分配的能量是相等的。这种概念被许多学者称作'equalization'（很重要的一种思想方法）。

另一方面，如果考虑通信节点功率切换的能量消耗，均匀的功率分配就更是最佳的选择了，因为这种方案的功率切换是最少的（在本问题中，没有）。

### 问题2：max throughput问题

将min energy问题稍作改变，如果是数据足够多，能量有限（即在deadline前不能把所有数据发完），应该如何分配功率/速率，使得有限的能量能够发送尽可能多的数据呢？

设所有可用的能量为E_0，deadline为T。这个问题的数学模型为：

![img](http://img.blog.csdn.net/20150128215609634)

我们仍然猜测：在整个时间段上均匀分配功率是最佳的方案。

这里直接使用'equalization'方法。试想，如果在时段内有两个小的时段上功率不等，那么我们可以从原来功率较大的时段里分出一部分能量给功率较小的时段，使得两个时段的功率相等（前提是要保证两个时段消耗的能量之和不变）。再由g(p)这个函数的凹凸性，可以知道调整后的方案用同样的能量发送了更多的数据。这里就不再给出详细的证明了，和前面的证明方法一样。

从问题1和问题2可以看出，虽然是两个完全不同的问题，但是却是用同样的思想解决。那些最理想的结果都在’equalization‘后得到，看来均匀分配的好处还是挺多的。如果没有特殊的约束和限制条件的话，那就平均主义吧！

![img](http://img.blog.csdn.net/20150128221658603)

### 问题3：min time问题

还有一类问题，是把时间的最小化作为目标的，就是如何分配功率/速率，尽可能快地把有限的数据发送出去（没有deadline限制了）。min time问题可以说是这里面最难的问题了。那么“min time”问题的数学模型是：

![img](http://img.blog.csdn.net/20150129145750626)

看起来不怎么容易。想一想，最优的方案是什么样子的，会不会还是“均匀”的呢？

如果最优的功率/速率分配方案是“不均匀”的。仍然用'equalization'的方法，我们取两段功率不等的时段（在每个时段内其功率是恒定的），从功率较大的一个时段中分一部分能量给功率较小的时段，使得两个时段的功率相等。然后由g(p)函数的凹凸性，可以知道调整过后同样的能量能够发送更多的数据，也就是说，要发送原来的数据量，完全可以在更短的时间内完成。这样，我们就证明了对于这类问题，“均匀化”还是最好的。

通过上面的证明，我们知道用恒定的功率就好了。这个恒定的功率是多少呢？约束条件中的两个等式就可以简化为：

![img](http://img.blog.csdn.net/20150129152436682)

这样，就可以唯一地解出p了。

我们再来深入地考察一下上面的关系。将两个等式相除，得到：

![img](http://img.blog.csdn.net/20150129152926250)

可见，g(p)/p是一个定值。f(p) = g(p)/p这个函数的单调性是怎样的？对p求导：

f'(p) = [g'(p)p - g(p)] / p^2

直接看看不出来，分子再对p求导：

[g'(p)p - g(p)]' = g''(p)p + g'(p) - g'(p) = g''(p)p 

由于g(p)是凹函数，所以有g''(p) < 0。因此分子是单调减少的。分子的最大值在p = 0处取得：g'(0)*0 - g(0) = 0。所以f'(p) <= 0，f(p)单调减少。

如果对于固定的数据量B_0，延长发送的时间，最优策略下消耗的能量怎样变化？

由g(p)T = B_0知，延长发送时间，发送速率g(p)将比原来小，g(p)是单调增加的，所以p也比原来小。于是，根据g(p)/p的单调减少性知g(p)/p将比原来大，再由g(p)/p = B_0/E_0知E_0将比原来小。就是说，消耗的能量将变小，这是符合直觉的。

同样地，对于固定的能量E_0，如果延长发送时间，那么也不难证明，最优策略下将能够发送更多的数据。

于是对于这个问题，我们还可以这样思考：要发送那么多数据，目标是尽可能缩短发送时间，这样就需要尽可能多的能量，当然要把所有可用的能量都用上就好了。