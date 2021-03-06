---
layout: post
title: "对CodeCraft2017赛题的评价"
description: ""
category: "算法"
tags: [竞赛,codecraft,组合优化]
summary:
---

昨天总决赛结束了，历时72天的CodeCraft2017终于画上句号。趁着记忆还比较清晰，来更新一下回答。

写在前面：由于本问题限于对赛题的评价，对一些代码层面的细节处理（诸如读图、结果的输出等等）这里不再多花笔墨，以及，比赛体验什么的也不多展开了，相信浏览这个页面的同学们也大多是参加了今年比赛的参赛选手，个中体会，冷暖自知。本人尽量对赛题做出简洁、客观的评价，并简要描述自己队的算法思想。但由于作为本次比赛的参赛选手，难免掺杂主观认知，所谓“不识庐山真面目，只缘身在此山中”，所以如果有表达不妥的地方，还请各位读者海涵，并多阅读其他答案或者与其他选手交流，以期获取更全面的认识。

下面，在对初赛、复赛和决赛赛题给出简评的同时，会重点讨论一下初赛赛题的解法，以供参考。

## 初赛赛题：流网络中的选址

初赛的赛题描述很简单：给你一个流网络（边有容量和单位流量费用），已知有一些节点有流量需求（消费节点），现要选一些节点部署服务器（服务节点），给消费节点传输流量，使得在满足所有消费节点流量需求的条件下，最小化成本（服务器购买成本+线路流量费用）。

其他条件和要求：

- 服务器输出能力无上限，一个服务节点可以服务多个消费节点，一个消费节点也可以从多个服务节点获取流量
- 每台服务器的购买成本均相同
- 输出结果中每条边上的流量必须为整数

数据规模：

- 网络节点数量不超过1000，每个节点出度不超过20，消费节点数量不超过500
- 边容量和单位流量费用为[0,100]的整数，服务器与消费节点的带宽需求为[0,5000]的整数

时间和内存限制

- 90秒内必须输出结果，否则没有成绩
- 内存不超过2GB

简评：非常好的一个NP-hard问题，数据规模和时限的设置比较合理，没有现成的模型可以立即套用，题目本身虽难，但也并不意味着无从入手，有较好的区分度。

整个问题的模型其实很简单，困难在于：一、 不能用任何第三方ILP solver，只能用C/C++/Java自己实现算法（在我看来，理解原理是一回事，用高效的算法实现又是一回事。比如，多少人能手动把修正单纯形、割平面等算法撸出来）；二、限时90s，对于一个NP-hard的问题而言，是很紧了，这就要求所设计的算法不能用大量的时间做低效的搜索；三、就是允许用ILP solver，也不一定能在90s内解出大规模图。

关于求解，一个自然而然的方向是：选出一个点集，评价这个点集。不断进行这样的枚举，最后用评价最好的点集构造输出。（另一个方向是整数规划，鉴于整数规划理论难，代码实现更难，这里不予讨论，后面本人整理好相关文档后，将开源用Gurobi求解本次赛题初赛和复赛的代码。）

如何选：方法很多很多，可以枚举（顺序or随机），也可以启发式，这往往是搜索的核心算法所在。

如何评价：最小费用流（min cost max flow）。ps: 最小费用流可以认为是求解算法的底层基础设施，费用流越快，基本上可以搜索的空间就越大，可以实施的操作也越多，得到更优解的可能性也越大。甚至于，说费用流的速度决定了算法能力的上限都一点不为过。从初赛到决赛，我们对费用流的升级路线是：SPFA增广路算法--->原始—对偶算法（"zkw"算法）--->Cost Scaling--->增量式zkw算法--->网络单纯形。网络单纯形的性能是我们实测效果最好的，在官方提供的练习用例上，90s内600节点的图可以跑4w~5w次费用流，800节点的图可以跑1w次费用流。ps. 后来知道可以用增量式方法也可以用在加速网络单纯形上，使得在800节点图上的表现90s内达到跑4w~7w次。

顺着这个思路往下走，就自然地能想到遗传算法、粒子群等寻优算法——初始随机生成一定数量的解（比如，用0-1数组表示一个服务点集，0表示该点不部署服务器，1表示部署），然后迭代若干轮，每一轮用最小费用流做评价，并用交叉、变异等算子推动种群的进化。

这些都是很不错的想法，但是实施起来就能逐渐感觉到难度，最大的困难大概在于评估的速度。随着图规模的变大，费用流的速度会降低，而要得到更优的解，又必须扩大种群规模和进化代数等参数，不解决这个矛盾，算法很快就会到达瓶颈，甚至90s的时间都来不及收敛。这个问题主要存在于使用了遗传算法和粒子群算法的队伍中，使用这两个算法，也许可以帮助一些队伍进入赛区32强，但要靠它们进入4强，非常之难。究其原因，在于：比赛是有限时的，而且限时比较紧，比赛的性质决定了它要选拔的是搜索速度和寻优能力都强的优化算法，遗传和粒子群等群体进化算法的优点是全局优化能力强，但是缺点也是显而易见的，比如速度慢、参数多等（当然有队伍尝试用近似方法加速评估，比如预处理计算好一些启发信息，或者用最大流替代费用流，亦或近似计算费用流等等，但是效果如何就不得而知了），如果给很长的时间去计算，也许它们就是最佳的选择了。

很多采用了局部搜索（Local Search）的队都获得了相当不错的优化结果，我们队也是如此。Local Search是一种古老的优化方法，但是不意味着古老的方法不比“现代”的方法差。注意请不要在意这些名字，因为实施起来，即便是同一种思维框架，具体细节处理上的不同也会使得结果可能有天壤之别。局部搜索的思维框架简单描述就是（模拟退火可以认为属于这个框架）：从一个初始可行解出发，不断改进当前解，如果到了局部最优，尝试用一些策略跳出它，再去改进，如此循环。优点是由于每次操作大多是专注于改进一个可行解，所以速度比较快，缺点就是容易陷入局部最优，需要用一些有效的方式跳出。

下面这个简单无比的算法做一遍，基本就可以稳进区域64强了：对所有消费节点按需求从小到大排序，接下来直接在消费节点上放服务器，从需求最大的开始放，当可行的时候终止；再从需求最小的节点开始减一轮服务器，只要减完可行，并且总成本能降低，就减；最后再从需求最大的增一轮。核心代码不超过100行。

如果再加上一些复杂的局部搜索技术，比如交换（Exchange），则往往能够实现优化效果的飞跃。在本问题中，加上服务器的交换策略，与邻居以及当前可行解的路由上的点进行启发式交换，可以进一步从质上提高解的质量，而且速度是遗传和粒子群所远不能比。

## 复赛赛题：NP-hard的双层叠加

复赛赛题的描述：在初赛赛题的基础上，加入了服务器的差异化约束条件——服务器有10个档次，每个档次的服务器购买成本和容量都不同，每个网络节点的部署费用也可能不同。也就是说，在一个网络节点部署一台服务器的成本 = 该服务器的购买成本 + 网络节点的部署成本。

数据规模：

- 网络节点数量不超过10000，每个节点的出度不超过10000，消费节点数量不超过10000
- 边容量与单位流量费用为[0, 100]的整数
- 服务器档次不超过10个
- 服务器成本为[0, 5000]的整数
- 服务器的输出能力、节点的部署成本与消费节点的流量需求为[0,10000]的整数

时间和内存限制：

- 90秒
- 内存不超过2GB

简评：非常不错的问题升级，难度进一步加大的同时，实现了从初赛赛题较为平稳的过渡，选手可以基于初赛对赛题的理解修改自己的算法。

注：比赛官网上对复赛数据规模的描述十分不合理，基本不包含什么信息量，可以认为是干扰信息，如果真出现了上限的最大规模，在时限和内存不变的条件下，几乎是不能做的。数据规模的确认在复赛前期耽误了不少选手的时间，不过好在复赛真实比赛中用的数据规模比较合理（最大是800节点, 5000+条边）。

之所以说是“NP-hard”的双层叠加，是因为除了要选择比较好的部署服务器的点集之外，还要确定服务器的档次，而一台服务器可选的档次就有10个之多，因而相当于面对两个NP-hard问题。比如，若选择30个节点部署服务器，加入档次的条件后，即便确定了部署的服务器数量、在哪部署，还有10^30种可能。换句话说，即便告诉你最优解中在哪些节点上部署了服务器，也很难找到最优解。问题的难度可想而知。

关于解法，初赛的基本思想可以继续沿用，但是要考虑服务器档次这个重要的条件。大体来说，选位置的优先级还是高于降档。有一个降档的基本做法是必须的：每次计算完费用流后，根据服务节点的输出流量确定相应的档次，可以有效避免成本的浪费。在搜索算法的前期，我们基本不考虑服务器档次，执行可行解中服务器的减少、增加和交换等操作的组合，和初赛算法类似；后期将档次的调整引入这些操作算子，并在算法的最后把降档和升档作为两个相对独立的操作过程又执行了一遍（即便看起来有如此多的操作，最后的用时都没有超过80s）。我们这样的做法十分有效，比如，复赛官方提供的最后一批练习用例，高级用例case0可以解出388600以内，中级用例也大多可以解出质量相当好的近似解（与最优解的距离在500以内）。

## 决赛赛题：流网络中的博弈

决赛赛题的条件比较多，可以访问这个页面获得题目描述: [赛题介绍-HUAWEI软件精英挑战赛](http://codecraft.huawei.com/home/detail)

简而言之，是在复赛的条件基础上，除了进一步增加数据规模，问题的性质也由优化问题变为博弈问题。博弈体现在两支队伍每一轮对消费节点的争抢上。

简评：将组合优化与博弈结合，命题思路极具创意。但是赛题的延续性被强烈地破坏。

以下为个人观点。命题的思路非常好，甚至不少被初赛复赛弄得精疲力竭的队伍看到决赛赛题后又燃起了做题的斗志。但是从做题的体验来看，本人认为，决赛的命题是失败的。主要有以下几个原因：

1. 问题的性质发生了本质的改变。初赛和复赛的赛题都是最优化问题，决赛赛题变为了博弈类问题。无论是在工程上的软件开发，还是程序设计等大型竞赛中，需求/赛题的突然变更都是叫人诟病的。加上决赛赛题公布的时候，距离比赛开始已经不到两周，这在某种程度上，意味着对开发人员/选手前期努力的不尊重。命题者为了让比赛更有趣味、更具观赏性，走了结合博弈的命题方向，但是这两点在比赛的过程中并未体现出来。恰恰相反，比赛的“趣味性”因为赛题条件的不断修改而渐渐丧失，观赏性也没从最后的比赛复盘中体现出来（观赏性做得不如去年）。
2. 违背了命题的延续性和初衷。CodeCraft的比赛与其他大型程序设计竞赛、数据挖掘竞赛的最大差异就是，提供了一个非常好的、公平公正的平台让大家去研究极具挑战性的问题，是一场马拉松式的竞赛。在竞赛的过程中，选手们可以充分发挥自己的聪明才智和科研能力，或与老师同学交流，或查阅学术论文，在不断加深对问题理解的同时，也锻炼了编码能力。而今年决赛的赛题一改初赛复赛的风格，为了追求所谓的趣味性和观赏性对赛题做出剧烈的变更。也许有人会说第一届CodeCraft也是博弈，但要知道，第一届的博弈赛题是从初赛就定下来了，一直延续到决赛，而且主题是德州扑克，抛开算法不谈，德州扑克本身就是规则简单、趣味无穷的博弈游戏。但是CodeCraft2017决赛的博弈问题，条件众多，且规则十分复杂，是不是一个好的博弈问题还有待商榷。另外，去年的CodeCraft2016赛题（经过必经点集的最短路径问题），命题组也是从初赛到决赛坚持了命题的延续性——决赛赛题和复赛完全一样。
3. 命题人缺乏对大型竞赛的命题经验。CodeCraft的选题几乎是每年都由不同的成员负责，谁提交的选题通过了审议，谁就担任命题组成员，拥有相当大的权力左右比赛的进程。没有命题经验本无可厚非，每个人都是从零起步，但倘若缺乏组织相关活动的基本常识又不去尽力避免，则是为过。要知道，选手不会在乎命题者背后付出了多少努力，恰恰是命题组的努力让选手感觉不到，整个赛题呈现得浑然天成，才是命题工作最大的成功。相信不少参赛队会有感觉：本届赛题的命题，相比前两届，有不小的差距。

关于决赛赛题的解法，不再多说，我们的体会是除了费用流之外，初赛复赛的深入和努力基本都用不上，另外，个人也不认为存在什么通用的算法可以做好决赛的问题。

关于赛题的评价，到这里也就差不多了，如果读者有什么问题，在评论区提出，或者私信皆可。本文还将根据自己的认知和他人的建议作出合适的修改。

以上。

## 附：我们针对初赛和复赛赛题所建立的数学模型

对于初赛和复赛的赛题，可以建立精确的数学模型并用整数规划技术求最优解（如分支割平面+对偶单纯形算法），决赛由于是博弈问题，所以无法独立建立数学模型解决。

须要指出的是，我们建立数学模型并求最优解的目的是为了研究最优解的性质，从而为设计启发式算法提供方向，比赛本身不允许直接调用开源求解器。

###  初赛赛题的数学模型

- 有向图记为$G = (V,E)$
- 对每条边$(i,j) \in E$，其容量（带宽）为$u_{i,j}$，单位流量的费用为$c_{i,j}$
- 每台内容服务器的费用均为$p$
- 每个节点有一个权值$b_i$表示供给/需求量，$b_i > 0$表示该节点是内容服务器节点，$b_i < 0$表示该节点是消费节点，$b_i = 0$表示该节点是转运节点（中间节点）；现设定除了消费节点的$b_i < 0$外，其他所有节点均等于0
- 新增"超源点"$S$，将其与网络中所有节点相连（出边带宽为正无穷，入边带宽为0，出边入边费用均为0），定义所有流量都从$S$出发，在网络中流动，最终汇入消费节点；$b_S$是所有消费节点的需求量之和的相反数
- $x_j$表示是否在节点$j$放置内容服务器（**决策变量**）
- $f_{i,j}$（其中$(i,j) \in E$）表示边$(i,j)$上的流量（**决策变量**）

问题可以表达为：

$$
{\text{minimize}} \quad p \cdot \sum_{j \in V} x_j + \sum_{(i,j) \in E} c_{i,j} \cdot f_{i,j}
$$

约束：

- 每个节点的供给/需求约束（节点流出量之和与流入量之和的差等于$b_i$）

$$
\sum_{j: \ (i,j) \in E} f_{i,j} - \sum_{j: \ (j,i) \in E} f_{j,i} = b_i, \ \ \forall i \in V \cup \{S\}
$$

- 边容量约束

$$
0 \le f_{i,j} \le u_{i,j}, \ \ \forall (i,j) \in E
$$

- 流量与选址的触发关系

$$
x_j > 0, \quad \text{when} \ f_{S,j} > 0 \\

x_j = 0, \quad \text{when} \ f_{S,j} \le 0
$$

上式是一个非线性函数（开关函数），可以用下面的方法转化成线性约束，添加如下约束：

$$
x_j \le f_{S,j} \le u_{S,j} \cdot x_j
$$

其中$u_{S,j}$是常量，表示$f_{S,j}$的上界，在本题中是2000（也就是我们上面所说的无穷大）。当$x_j = 0$时，$0 \le f_{S,j} \le 0$（即$f_{S,j} = 0$）；当$x_j = 1$时，$1 \le f_{S,j} \le u_{S,j}$

- 整数约束

$$
x_j \in \{ 0, 1 \}, \ \ \forall j \in V \\

f_{i,j} \in \mathbb{Z}, \ \ \forall (i,j) \in E
$$

### 复赛赛题的数学模型

- 有向图记为$G = (V,E)$
- 对每条边$(i,j) \in E$，其容量（带宽）为$u_{i,j}$，单位流量的费用为$c_{i,j}$
- 所有档次集合记为$K = \{0, 1, 2,  ... , m-1\}$，其中$m \le10$
  - 档次$k$的服务器成本为$p_k$，输出容量为$q_k$
- 网络节点$j$的部署成本为$o_j$
- 每个节点有一个权值$b_i$表示供给/需求量，$b_i > 0$表示该节点是内容服务器节点，$b_i < 0$表示该节点是消费节点，$b_i = 0$表示该节点是转运节点
- 新增"超源点"$S$，将其与网络中所有节点相连（容量为正无穷，费用为0），定义所有流量都从$S$出发，在网络中流动，最终汇入消费节点；$b_S$是所有消费节点的需求量之和的相反数
- $x_{j, k}$表示是否在节点$j$部署档次为$k$的内容服务器（**决策变量**）
- $f_{i,j}$（其中$(i,j) \in E$）表示边$(i,j)$上的流量（**决策变量**）

问题可以表达为：

$$
{\text{minimize}} \quad \sum_{k \in K} \sum_{j \in V} x_{j, k} (o_j + p_k) + \sum_{(i,j) \in E} c_{i,j} \cdot f_{i,j}
$$

约束：

- 每个节点的供给/需求约束（节点流出量之和与流入量之和的差等于$b_i$）

$$
\sum_{j: \ (i,j) \in E} f_{i,j} - \sum_{j: \ (j,i) \in E} f_{j,i} = b_i, \ \ \forall i \in V \cup \{S\}
$$

- 边容量约束

$$
0 \le f_{i,j} \le u_{i,j}, \ \ \forall (i,j) \in E
$$

- 流量与选址的触发关系，以及服务器输出容量约束（即，如果在节点$j$部署了档次为$k$的服务器，那么边$(S,j)$上的流量不能超过服务器的输出容量$q_k$）

$$
\sum_{k \in K} x_{j,k} > 0, \quad \text{when} \ f_{S,j} > 0 \\

\sum_{k \in K} x_{j,k} = 0, \quad \text{when} \ f_{S,j} \le 0
$$

上式是一个非线性函数（开关函数），可以用下面的约束转化成线性约束：

$$
\sum_{k \in K} x_{j,k} \le f_{S,j} \le \cdot \sum_{k \in K} x_{j,k} \cdot q_k \quad \forall j \in V
$$

当$\sum_{k \in K} x_{j,k} = 0$时，$0 \le f_{S,j} \le 0$（即$f_{S,j} = 0$）；当$\sum_{k \in K} x_{j,k} = 1$时，$1 \le f_{S,j} \le q_k$ (这里的$q_k$对应所部署档次的服务器成本)

- 每个网络节点最多部署一台服务器

$$
\sum_{k \in K} x_{j,k} \le 1, \quad \forall j \in V
$$

- 整数约束

$$
x_{j,k} \in \{ 0, 1 \}, \ \ \forall j \in V, \forall k \in K \\

f_{i,j} \in \mathbb{Z}, \ \ \forall (i,j) \in E
$$
