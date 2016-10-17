---
layout: post
title: "城市大规模实时拼车问题"
description: ""
category: "科研"
tags: [分享经济,城市计算,实时拼车,数据挖掘]
summary:
---

作者：[小华](http://mioopoi.github.io/about.html)

---

这是今天组会上分享的内容。发表于数据挖掘/数据库领域顶级期刊TKDE 2015 (IEEE Transactions on Knowledge and Data Engineering)，与之对应的会议论文发表于数据挖掘/数据库领域顶级会议ICDE 2013 (IEEE International Conference on Data Engineering)。

- 会议论文: Microsoft Research, T-Share: A Large-Scale Dynamic Taxi Ridesharing Service, [https://www.microsoft.com/en-us/research/publication/t-share-a-large-scale-dynamic-taxi-ridesharing-service/](https://www.microsoft.com/en-us/research/publication/t-share-a-large-scale-dynamic-taxi-ridesharing-service/).
- 期刊论文: Shuo Ma, Yu Zheng, Ouri Wolfson. Real-Time City-Scale Taxi Ridesharing. IEEE Transactions on Knowledge and Data Engineering (TKDE), vol. 27, No.7, July 2015.

期刊相比会议论文扩展的工作是，增加了对费用分配的建模分析，即如果有新的乘客上车，应如何定价，以使得新加入的乘客、车上的乘客，以及司机都能满意。

以下是对全文内容的总结。

---

# Real-Time City-Scale Taxi Ridesharing

## 1 INTRODUCTION

- real-time taxi-sharing has not been well explored
- more challenging because both ride requests and positions of taxis are highly dynamic and difficult to predict
  - passengers are often lazy to plan a taxi trip in advance, and usually submit a ride request shortly before the departure
  - a taxi constantly travels on roads, picking up and dropping off passengers; the destination depends on that of passengers, while passengers could go anywhere in a city
- Contributions
  - proposed and developed a taxi-sharing system using the mobile-cloud architecture
    - taxi indexing
    - searching
    - scheduling
  - considers and models monetary constraints in ridesharing
    - provide incentives not only for passengers but also for taxi drivers
  - performed extensive experiments to validate the effectiveness of taxi-sharing as well as the proposed system's efficiency and scalability
- Paper organization
  - sec 2: formally describe the real-time taxi-sharing problem
  - sec 3: overviews the architecture of the proposed system
  - sec 4: describes the index of taxis used and the taxi searching algorithm
  - sec 5: describes the scheduling process
  - sec 6: simulation and evaluation
  - sec 7: summarize the related work

## 2 THE REAL-TIME TAXI-SHARING PROBLEM

- Constituent parts
  - a data model
  - constraints
  - an objective function

### 2.1 Data Model

#### 2.1.1 Ride Request

a ride request `Q`:

- `Q.t`: a timestamp indicating when `Q` was submitted
- `Q.o`: an origin point
- `Q.d`: a destination point
- `Q.pw`: the time interval when the rider wants to be picked up at the origin point
  - `Q.pw.e`: the early bound of the pickup window
  - `Q.pw.l`: the late bound of the pickup window
- `Q.dw`: the time interval when the rider wants to be dropped off at the destination point
  - `Q.dw.e`: the early bound of the delivery window
  - `Q.dw.l`: the late bound of the delivery window

In practice, a rider only needs to explicitly indicate `Q.d` and `Q.dw.l` (甚至`Q.dw.l`也不是必需的，因为很多时候乘客无法较为准确地估计到达目的地的时间，当然这篇文章里假设它是能够被较准确地获取，同时也是后面提出的dual-side taxi searching所必须的条件), as most information of a ride request can be automatically obtained from a rider's mobile phone.

#### 2.1.2 Taxi Status

a taxi status `V` represents an instantaneous state of a taxi:

- `V.ID`: the unique identifier of the taxi
- `V.t`: the time stamp associated with the status
- `V.l`: the geographical location of the taxi at `V.t`
- `V.s`: the current schedule of `V`, which is a temporally-ordered sequence of origin and destination points of $n$ ride requests $Q_1, Q_2, \ldots, Q_n$ (注意，为什么是一个请求序列，因为存在拼车，这个序列中的每个请求都是需要由该taxi满足的)
  - for every ride request $Q_i$, either `Q[i].o` precedes `Q[i].d` in the sequence, or only `Q[i].d` exists in the sequence
- `V.r`: the current projected route of `V`, which is a sequence of road network nodes calculated based on `V.s`

note that the schedule of a vehicle status is dynamic (changes over time)

### 2.2 Constraints

- *vehicle capacity constraint*: the number of riders that sit in the taxi does not exceed the number of seats of a taxi at any time


- *time window constraints*: all riders that are assigned to `V` should be able to depart from the origin point and arrive at the destination point during the corresponding pickup and delivery window, respectively.
- *monetary constraints*: a rider does not pay more than without taxi-sharing and a taxi driver does not earn less than without taxi-sharing when travelling the same distance

### 2.3 Objective Function and Problem Definition

An objective function is usually applied to find the optimal taxi (since multiple taxi status may satisfy a ride request). 也就是派车准则

In this study, the criteria is: given a ride request, the system aims to find the taxi status which satisfies the ride request with minimum increase in travel distance, formally defined as follows:

- Given a fixed number of taxis traveling on a road network and a sequence of ride requests in ascending order of their submitted time, the system aims to serve each ride request `Q` in the stream by dispatching the taxi `V` which satisfies `Q` with minimum increase in `V`'s scheduled travel distance on the road network.

This is a greedy strategy and it does not guarantee that the total travel distance of all taxis for all ride requests is minimized. However, the researchers still opt for this definition due to two major reasons:

- the real-time taxi-sharing problem inherently resembles a greedy problem
- the problem of minimizing the total travel distance of all taxis for the complete ride request stream is NP-complete (已经被证明)

## 3 SYSTEM ARCHITECTURE

主要是系统架构，可以诉诸原文看更直观的图解。

## 4 TAXI SEARCHING

> The taxi searching module quickly selects a small set of candidate taxis with the help of the spatio-temporal index.

Taxi Searching的目的其实就是先做一层预处理，筛选出一部分备选taxis，为约束条件的计算降低复杂度。

### 4.1 Index of Taxis

> The spatio-temporal index of taxis is built for speeding up the taxi searching process.

- partition the road network using a grid
- within each grid cell, choose the road network node which is closest to the geographical center of the grid cell as the anchor node of the cell
- compute the distance $d_{ij}$ and travel time $t_{ij}$ of the fastest path on the road network for each anchor node pair $c_i$ and $c_j$. Both the distance and travel time is only computed once. （为了更好地模拟实际情况，travel time应该是按道路状况如交通流密度动态更新的，比如，每10min更新一次，现在的技术是通过机器学习等手段预测路段交通流变化，这不是本文要重点解决的问题，所以就用静态的数值去近似了。因为直观上来说，距离越远，travel time是越大的，具有较好的近似性，而且可以有效地降低计算开销）The distance and travel time results are saved in a matrix called *grid distance matrix*. $D_{ij} = (t_{ij}, d_{ij}) \ i,j = 0,1,2,\ldots, n$ 其中n的大小和网格划分的粒度有关
- each grid cell $g_i$ maintains three lists
  - a *temporally-ordered grid cell list* $(g_i.l_c^t)$: 按其他grid cells到$g_i$的时间升序排列 (temporal closeness)
  - a *spatially-ordered grid cell list* $(g_i.l_c^s)$: 按其他grid cells到$g_i$的距离升序排列 (spatial closeness)
  - a *taxi list* $(g_i.l_v)$ 
    - the taxi list $g_i.l_v$ of grid cell $g_i$ records the IDs of all taxis which are scheduled to enter $g_i$ in near future (typically within a temporal scope of 1 or 2 hours)
    - each taxi ID is also tagged with a timestamp $t_a$ indicating when the taxi will enter the grid cell
    - all taxis in the taxi list are sorted in ascending order of the associated timestamp $t_a$
    - $g_i.l_v$ is updated dynamically
      - taxi $V_j$ is removed from the list when $V_j$ leaves $g_i$
      - taxi $V_k$ is inserted into the list when $V_k$ is newly scheduled to enter $g_i$


### 4.2 Searching Algorithms

#### 4.2.1 Single-Side Taxi Searching

- Suppose at current time $t_{cur}$, there is a query $Q$ in grid cell $g_7$
- $g_7$ is the first grid cell selected by the algorithm (这是显然合理的，因为请求就是从这个grid cell发出的)
- Any other grid cell $g_i$ is selected if and only if $t_{cur} + t_{i7} \le Q.pw.l$, where $t_{i7}$ represents the travel time from grid grid cell $g_i$ to grid cell $g_7$. This constraint indicates that any taxi currently within grid cell $g_i$ can enter $g_7$ before the late bound of the pickup window using the travel time between the two grid cells
- The searching algorithm scans all grid cells in the order-preserved list $g_7.l_c^t$ and finds the first grid cell $g_f$ which fails to hold the above constraint, then all taxis in grid cells before $g_f$ in the list are selected as candidate taxis. (找出所有符合条件的grid cell)
- Then for each selected grid cell $g_s$, the algorithm selects taxis in $g_s.l_v$ whose $t_a$ is no later than $Q.pw.l-t_{s7}$ (在所有符合条件的grid cell中，再筛选出符合条件的taxi)

缺点：选择出的grid cell可能很多，导致备选的taxi数量很多，计算开销很大

#### 4.2.2 Dual-Side Taxi Searching

（滴滴：司机可以看到乘客的目的地；Uber：司机无法看到乘客的目的地）

Actually, the spatiotemporal (时空的) factor on the destination point of queries also provides us with opportunities to reduce the number of grid cells to be selected. (即筛选时再考虑目的地)

- Suppose at current time $t_{cur}$, $g_7$ and $g_2$ are the grid cells in which $Q.o$ and $Q.d$ are located respectively.
- 扫描$g_7.l_c^t$，在上车点筛选符合条件的grid cells: $t_{cur} + t_{i7} \le Q.pw.l$
- 扫描$g_2.l_c^t$，在下车点筛选符合条件的grid cells: $t_{cur}+t_{j2} \le Q.dw.l$
- 两个grid cell集合中的taxi取交集


缺点：may result larger increase in travel distance for the given ride request

优点：as a compensation for the small loss in distance optimality, the algorithm selects far fewer taxis for the schedule allocation step, reducing the computation cost and ride request processing time

实验发现，相比single-side taxi searching，dual-side taxi searching降低了`50%`的taxis数量，而行程长度只增加了`1%`。


## 5 TAXI SCHEDULING

> 设$S_V$是searching algorithm计算得到的关于请求$Q$的备选车状态集，taxi scheduling的目的是从$S_V$中找到能满足$Q$且路程增加量最小的taxi。

其中主要做的就是路径规划。

Given a taxi status, theoretically we need to try all possible ways of inserting $Q$ into the schedule of the taxi status in order to choose the insertion which results in minimum increase in travel distance.

All possible ways of insertion can be created via three steps:

1. reorder the points in the current schedule, subject to the precedence rule
2. insert `Q.o` into the schedule
3. insert `Q.d` into the schedule

For the sake of simplicity, we do not consider the schedule reordering step.

注意，上面每一步都是需要执行的，并不是只执行其中某一个（虽然为了使问题简化，步骤1被省略了），而且

- The capacity and time window constraints are checked in all three steps, during which the insertion fails immediately if any constraint is violated.
- The monetary constraints are then checked for the insertion after all three steps have been done successfully.
- Finally, among all insertions that satisfy all constraints, we choose the insertion that results in minimum increase in travel distance for the given taxi status.

最后，应该还有一步，就是对所有符合约束的taxi status按minimum travel distance increase排序，并选择最小的那个对应的taxi去接客。

A computer cluster can be employed to parallelize the computation by assigning taxi statuses to different computers in the cluster, so the constraints checking for multiple taxi statuses can be performed simultaneously.

### 5.1 Time Window Constraints

- Given a schedule of $n$ points, there is $O(n^2)$ ways to insert a new ride request into the schedule.
- the insertion can be separated into two stages:
  - insert the pickup point of the query
  - insert the delivery point of the query
- choose the taxi `V` out of the taxi status set which incurs the minimum increase in travel distance
- ​

### 5.2 Monetary Constraints

- two constraints which encourage riders to participate in taxi-sharing
  - (1) any rider who participates in taxi-sharing should pay no more than what he would pay if he takes a taxi by himself
  - (2) if an occupied taxi V is to pick up a new rider Q, then each rider P currently sitting in V whose travel time is lengthened due to the pickup of Q, should get a decrease in taxi fare; and the fare should be proportional to P's increase in travel time
- one constraint which gives the driver motivation to participate in taxi-sharing
  - (3) a driver should charge for all distances she has travelled


对乘客的费用方案才是主要的，因为决定是否拼车的主动权在乘客手里；对司机的费用方案更多的意义在于提升司机接客的积极性。

- 符号说明
  - given a taxi status $V$ and a new ride request $Q_n$
  - $Q_1, Q_2, \ldots, Q_{n-1}$: the riders involved in the current schedule of $V$ before the join of $Q_n$
  - $d_i$: the distance between $Q_i.o$ and $Q_i.d$ on the road network ($i=1,2,\ldots,n$)
  - $f_i$: the taxi fare of rider $Q_i$ if $V$ picks up $Q_n$
  - $F: \ R^{+} \rightarrow R^{+}$: the fare calculation function which maps the travelled distance to the taxi fare (it can be defined by some transportation authority or taxi company)
- 约束(1)，拼车后所有乘客的车费比乘客单独叫车的费用便宜：

$$
f_i \le F(d_i), \ \ i = 1,2,\ldots,n
$$

- 设$M$是$Q_n$加入后司机的收益，$D$是$Q_n$加入后新规划的总路径长度，约束(3)：

$$
M \ge F(D)
$$

由于$M=\sum_{i=1}^{n}f_i$，于是有：
$$
F(D) \le M = \sum_{i=1}^{n}f_i \le \sum_{i=1}^{n}F(d_i)
$$
司机的收益可以定在$F(D)$和$\sum_{i=1}^{n}F(d_i)$之间的任何一个值，这里为了让乘客的费用最小化，令$M = F(D)$。

#### 接下来的问题是：每个乘客的费用应该如何定价？

- 符号说明
  - $\Delta f_i$: $Q_n$加入后，乘客$Q_i (i=1,2,\ldots,n-1)$收费的降低量
  - $\Delta T_i$: $Q_n$加入后，乘客$Q_i(i=1,2,\ldots,n-1)$行程时间的增加量
  - $\Delta D$: $Q_n$加入后，路径的增加量
- 乘客定价模型

$$
f_n = F(d_n) - f, \\
\Delta f_i = \frac{\Delta T_i}{\sum_{i=1}^{n-1}\Delta T_i} \left [ f_n - F(\Delta D) \right ], \ \ i = 1,2,\ldots,n-1
$$

第一个式子中，$f$是一个常量，含义是$Q_n$因为上了有乘客的车而减少的费用，第一个式子的含义就是对新加入的乘客的定价（不多于其单独叫车的费用）。

第二个式子有两层含义：其一，是总体应该降低的费用量，它是$f_n-F(\Delta D)$，即对$Q_n$的收费与给司机多增加的收益之差，这个差价就用来分配到目前车上的所有乘客上；其二，就是对这笔差价的分配，每个乘客的分配额度与其增加的行程时间比例成正比。

显然，要求$\Delta f_i \ge 0$，即对$Q_n$的收费不应小于路径增加量对应的费用，因此有：
$$
f_n \ge F(\Delta D)
$$
上式是满足费用约束的充分必要条件。

- 存在的问题

一些乘客可能会认为降低的费用不足以弥补其行程时间的增加，因此会对拼车形成抵触态度。

本文作者的做法是为每个乘客$Q_i$引入一个参数$Q_i.r$，其含义是"$Q_i$能够接受的费用——时间比率"，它反映了乘客的心理阈值，即只要费用降低量与行程时间增加量的比值（也就是单位行程时间增加对应的费用降低量）大于该阈值，乘客就愿意拼车。模型即：
$$
\frac{\Delta f_i}{\Delta T_i} \ge Q_i.r
$$
只要车上所有乘客的心理阈值被满足，就可以加入新的乘客。

**而实际应用中，这个心理阈值是不容易获取的，所以对这个量的估计也是一个问题~**
