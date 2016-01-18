---
layout: post
comments: true
title: 平面最近点对
category: 算法
tags: 
keywords:
description: 
use_math: true
---

* content
{:toc}

## 描述
给了平面上若干个点的坐标，求最近的两个点之间的距离。

可供练习此问题的地方有:
<a href="http://acm.hdu.edu.cn/showproblem.php?pid=1007" target="_blank">HDU 1007</a>
<a href="https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1186" target="_blank">UVa 10245</a>
<a href="http://acm.zju.edu.cn/onlinejudge/showProblem.do?problemId=1107"_blank">ZOJ 2107</a> (和HDU 1007一样)
<a href="http://poj.org/problem?id=3714" target="_blank">POJ 3714</a> (问题稍有变化，是求两个不同点集的最近点对)

## 思路
### 方法一：Brute Force
$O(n^2)$，不多说了

#### 方法一的优化
事先对所有点按x坐标值排好序，然后通过x坐标差值缩小搜索范围。这个方法的实际效果是非常好的，但是最坏时间复杂度依然是$O(n^2)$，比如，当所有点的横坐标相等的时候。

该方法过了UVa 10245，但是ZOJ和HDU都TLE。下面是在UVa提交并AC的参考代码(C++):

```c++
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cmath>
using namespace std;

const int MAXN = 100010;

struct Point
{
    double x;
    double y;
}P[MAXN];

int N;

bool cmpX(Point p1, Point p2)
{
    if (p1.x != p2.x) {
        return p1.x < p2.x;
    }
    return p1.y < p2.y;
}

double dist(Point p1, Point p2)
{
    return sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
}

double getClosestDis(Point Px[], int n)
{
    if (n == 1) {
        return INFINITY;
    }
    if (n == 2) {
        return dist(Px[0], Px[1]);
    }
    double d = INFINITY;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            double temp = dist(Px[i], Px[j]);
            if (Px[j].x - Px[i].x >= d) {
                break;
            }
            if (temp < d) {
                d = temp;
            }
        }
    }
    return d;
}

int main()
{
    double rst;
    while (scanf("%d", &N) && N) {
        for (int i = 0; i < N; ++i) {
            scanf("%lf%lf", &P[i].x, &P[i].y);
        }
        sort(P, P + N, cmpX);
        rst = getClosestDis(P, N);
        if (rst >= 10000.00) {
            printf("INFINITY\n");
        } else {
            printf("%.4lf\n", rst);
        }
        //printf("%.2lf\n", rst / 2);
    }
    return 0;
}
```

### 方法二：Divide & Conquer
1. 把所有点按x坐标值从小到大排序
2. 按x坐标把点集划分为左、右两个子集
3. 分别计算左、右两个子集的最近点对距离
4. 合并，取左右子集最近点对距离的较小者（设为$d$）；同时还要考虑一个点在左子集，另一个点在右子集的情况——只需考虑出现在距离分割线$d$以内范围中的点，在二维平面上是一个长条形区域。筛选出该长条形区域内的所有点，按y坐标值对它们排序（排序的目的是剪枝），然后找这个点集中的最近点对，如果比$d$小，就更新$d$

以上2~4步递归地进行。

划分比较容易，关键是合并的复杂度。筛选出位于长条形区域内的点，须要扫一遍整个点集，$O(n)$；按y坐标值对它们排序，最快$O(n \log{n})$；然后找出最小距离，扫一遍，$O(n)$。所以，合并的复杂度是$O(n \log{n})$。整个算法的复杂度：$O(\log{n} * (n \log{n})) = O(n (\log{n})^2)$

分治的递归方程：
$$
T(n) = 2 T\left( \frac{n}{2} \right) + O(n \log{n})
$$

该方法已经可以通过所有的OJ了。以HDU 1007为例，参考的AC代码(C++)如下:

```c++
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cmath>
using namespace std;

const int MAXN = 100010;

struct Point
{
    double x;
    double y;
}P[MAXN], strip[MAXN];;

int N;

bool cmpX(Point p1, Point p2)
{
    if (p1.x != p2.x) {
        return p1.x < p2.x;
    }
    return p1.y < p2.y;
}

bool cmpY(Point p1, Point p2)
{
    if (p1.y != p2.y) {
        return p1.y < p2.y;
    }
    return p1.x < p2.x;
}

double dist(Point p1, Point p2)
{
    return sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
}

double getStripDis(Point strip[], int n, double d)
{
    double rst = d;
    sort(strip, strip + n, cmpY);
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n && (strip[j].y - strip[i].y) < rst; ++j) {
            if (dist(strip[i], strip[j]) < rst) {
                rst = dist(strip[i], strip[j]);
            }
        }
    }
    return rst;
}

double getClosestDis(Point Px[], int n)
{
    if (n == 1) {
        return INFINITY;
    }
    if (n == 2) {
        return dist(Px[0], Px[1]);
    }
    int mid = n / 2;
    double x_mid = Px[mid].x;

    double d_left = getClosestDis(Px, mid);
    double d_right = getClosestDis(Px + mid, n - mid);
    double d = min(d_left, d_right);

    int k = 0;
    for (int i = 0; i < n; ++i) {
        if (abs(Px[i].x - x_mid) < d) {
            strip[k++] = Px[i];
        }
    }
    double d_strip = getStripDis(strip, k, d);
    double d_final = d < d_strip? d:d_strip;
    return d_final;
}

int main()
{
    double rst;
    while (scanf("%d", &N) && N) {
        for (int i = 0; i < N; ++i) {
            scanf("%lf%lf", &P[i].x, &P[i].y);
        }
        sort(P, P + N, cmpX);
        rst = getClosestDis(P, N);
        printf("%.2lf\n", rst / 2);
    }
    return 0;
}
```

#### 分治法的优化
注意到在合并操作中，每一次递归都要依y坐标值对`strip`数组内的点排序，使得合并的复杂度最坏能到$O(n\log{n})$。如果没有排序这一步，那么扫描一遍即可，复杂度即是构建`strip`数组的复杂度---$O(n)$。于是，就能将求解整个问题的复杂度降至$O(n\log{n})$。

这是可以做到的——通过预处理。为此，需要另开一个数组(设为`Py`)，在一开始就将所有的点按'Y'坐标值从小到大排好序。然后在递归过程中，按x坐标值做divide操作的同时，也对`Py`数组进行划分。

以HDU 1007为例，优化后的AC代码(C++)如下：

```c++
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cmath>
using namespace std;

const int MAXN = 100010;

struct Point
{
    double x;
    double y;
}P[MAXN], P2[MAXN], strip[MAXN];

int N;

bool cmpX(Point p1, Point p2)
{
    if (p1.x != p2.x) {
        return p1.x < p2.x;
    }
    return p1.y < p2.y;
}

bool cmpY(Point p1, Point p2)
{
    if (p1.y != p2.y) {
        return p1.y < p2.y;
    }
    return p1.x < p2.x;
}

double dist(Point p1, Point p2)
{
    return sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
}

double getStripDis(Point strip[], int n, double d)
{
    double rst = d;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n && (strip[j].y - strip[i].y) < rst; ++j) {
            if (dist(strip[i], strip[j]) < rst) {
                rst = dist(strip[i], strip[j]);
            }
        }
    }
    return rst;
}

double getClosestDis(Point Px[], Point Py[], int n)
{
    if (n == 1) {
        return INFINITY;
    }
    if (n == 2) {
        return dist(Px[0], Px[1]);
    }
    int mid = n / 2;
    int x_mid = Px[mid].x;

    Point Py_left[mid+5];
    Point Py_right[n-mid+5];
    int nl = 0, nr = 0;
    // 对Py数组进行划分
    for (int i = 0; i < n; ++i) {
        if (Py[i].x <= Px[mid-1].x && nl < mid) {
            Py_left[nl++] = Py[i];
        } else {
            Py_right[nr++] = Py[i];
        }
    }
    // conquer
    double d_left = getClosestDis(Px, Py_left, mid);
    double d_right = getClosestDis(Px + mid, Py_right, n - mid);
    double d = min(d_left, d_right);
	// 构建strip数组
    int k = 0;
    for (int i = 0; i < n; ++i) {
        if (abs(Py[i].x - x_mid) < d) {
            strip[k++] = Py[i];
        }
    }
    // 求strip内的最近点对
    double d_strip = getStripDis(strip, k, d);
    // 合并子问题的解
    double d_final = d < d_strip? d:d_strip;
    return d_final;
}

int main()
{
    double rst;
    while (scanf("%d", &N) && N) {
        for (int i = 0; i < N; ++i) {
            scanf("%lf%lf", &P[i].x, &P[i].y);
            P2[i].x = P[i].x;
            P2[i].y = P[i].y;
        }
        sort(P, P + N, cmpX);
        sort(P2, P2 + N, cmpY);
        rst = getClosestDis(P, P2, N);
        printf("%.2lf\n", rst / 2);
    }
    return 0;
}
```

### 参考
[1] <a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/closepoints.pdf" target="_blank">CMSC 451: Closest Pair of Points</a>
[2] <a href="http://www.geeksforgeeks.org/closest-pair-of-points/" target="_blank">Divide and Conquer | Set 2 (Closest Pair of Points)</a>
[3] <a href="http://www.geeksforgeeks.org/closest-pair-of-points-onlogn-implementation/" target="_blank">Closest Pair of Points | O(nlogn) Implementation</a>
[4] <a href="http://www.csie.ntnu.edu.tw/~u91029/Point2.html#3" target="_blank">国立台湾师范大学: Closest Pair</a>