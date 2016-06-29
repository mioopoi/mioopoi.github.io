---
layout: post
comments: true
title: LightOJ的两道图论问题
category: 算法
tags: 
keywords:
description: 
use_math: true
---

## LightOJ 1003 Drunk (拓扑排序)

![1003](http://img.blog.csdn.net/20150330170137245)

思路：拓扑排序（有向图的环路检测）。将所有的名称构建一个有向图，比如“soda wine”就是起点为“soda”，终点为“wine”的一条有向边。然后对图进行深度优先搜索，如果发现环路，则说明是可以“get drunk”的(Yes)，否则不能(No)。

需要注意的点：
1. 读入数据的效率，即如何将一个名字与一个节点一一对应（对出现的名字进行不重复的编号）。如果采用数组去存名字，每读入一个名字就去查这个数组来判断这个名字之前是否出现过，那将是十分低效的，甚至会导致超时。因为边的数量最多可以到20000，在最坏的情况下，节点的数量可以达到10000。在这个问题上，hash map有得天独厚的优势，而STL的map容器提供了这种数据结构。
2. 存图的方式。如果采用邻接矩阵存图，由于最坏情况下节点数量可以达到10000，所以邻接数组的规模不能小于10000*10000，这样是会爆空间的。所以应该采用邻接表来存图。

### AC代码：
```c++
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cmath>
#include <map>
using namespace std;

#define MAX 10001  //最大边数
#define INF 999999

int n=1, m;
int u[MAX], v[MAX], first[2*MAX], next[2*MAX];
int visit[2*MAX];
map<string, int> mapName;

void readGraph()
{
    string name1, name2;
    int i;
    pair<map<string, int>::iterator, bool> insert_pair;
    map<string, int>::iterator iter;
    scanf("%d", &m);
    for(i = 1; i <= 2*MAX-1; ++i) first[i] = -1;
    for(i = 1; i <= m; ++i) {
        cin>>name1>>name2;
        iter = mapName.find(name1);
        if(iter != mapName.end()) { //找到该名字
            u[i] = iter->second;
        }
        else {
            mapName.insert(pair<string, int>(name1, n));
            u[i] = n;
            ++n;
        }
        iter = mapName.find(name2);
        if(iter != mapName.end()) {
            v[i] = iter->second;
        }
        else {
            mapName.insert(pair<string, int>(name2, n));
            v[i] = n;
            ++n;
        }
        //下面这两行是用数组构建邻接表的关键
        next[i] = first[u[i]];
        first[u[i]] = i;
    }
}

bool DFS(int pos)
{
    int k, l;
    visit[pos] = -1;
    k = first[pos];
    if(k != -1) {
        if(visit[v[k]] < 0) return false;
        else if(!visit[v[k]] && !DFS(v[k])) return false;
        l = next[k];
        while(l != -1) {
            if(visit[v[l]] < 0) return false;
            else if(!visit[v[l]] && !DFS(v[l])) return false;
            l = next[l];
        }
    }
    visit[pos] = 1;
    return true;
}

bool topoSort()
{
    memset(visit, 0, sizeof(visit));
    for(int i = 1; i <= n; ++i) {
        if(!visit[i]) {
            if(!DFS(i))
                return false;
        }
    }
    return true;
}

int main()
{
    int cases, casenum=0;
    scanf("%d", &cases);
    while(cases--) {
        readGraph();
        if(topoSort())
            printf("Case %d: Yes\n", ++casenum);
        else
            printf("Case %d: No\n", ++casenum);
    }

    return 0;
}

```

## LightOJ 1006 Back to Underworld (BFS)

题目链接：http://acm.hust.edu.cn/vjudge/problem/viewProblem.action?id=25835

基本思路：用邻接表构建无向图，由题意可知它是一个二分图。然后用BFS对图着色（2种）：对于一个节点，如果将它着色为白色，那么与它相邻的所有节点都应着为黑色，即相邻的两个节点的颜色一定不同。统计两种颜色的数目取较大的即可。

注意点：
0. 存图方式，最好用邻接表。
1. 图不一定是连通的。一个不连通的图可以分为若干个连通子图，分别对每个连通图做BFS即可。由于是无向图，所以从一个节点的BFS一定可以着色完该节点所在的连通子图。考察节点时，如果节点没有被访问过，说明到达了一个新的连通子图；反之则无需从它开始BFS了。每着色完一个连通子图就应该统计一下两种颜色的数目并保留较大的。
2. 节点的编号不一定是连续的。比如只有1条边，两个节点的编号分别为100, 200，但是并不意味着就有200个节点，所以要做一下判断。如何判断一个编号没有被使用呢？只需考察是否有边连着它就好了，因为不可能存在孤立点。

### AC代码：
```c++
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cmath>
#include <list>
#include <map>
using namespace std;

#define MAXN 20001
#define MAXM 200001

int n, m, u[MAXM], v[MAXM];
int first[MAXN], next[MAXM];
int maxnum=0;
int color[MAXN];
bool visit[MAXN];

list<int> q;

void readdata()
{
    for(int i = 1; i < MAXN; ++i)
        first[i] = -1;
    for(int i = 1; i <= m; ++i) {
        scanf("%d%d", &u[2*i-1], &v[2*i-1]);
        u[2*i] = v[2*i-1]; v[2*i] = u[2*i-1];
        next[2*i-1] = first[u[2*i-1]];  // 第(2*i-1)条边的下一条边
        first[u[2*i-1]] = 2*i - 1;
        next[2*i] = first[u[2*i]];    // 第(2*i)条边的下一条边
        first[u[2*i]] = 2*i;
        int tmp = max(u[2*i-1], v[2*i-1]);
        n = (tmp > n? tmp:n);
    }
}

void BFS(int pos)
{
    int k;
    bool tmp_color=1;
    visit[pos] = true;
    color[pos] = tmp_color;
    q.push_back(pos);
    while(!q.empty()) {
        pos = q.front();
        q.pop_front();
        tmp_color = color[pos];
        k = first[pos];
        while(k != -1) {
            if(!visit[v[k]]) {
                visit[v[k]] = true;
                color[v[k]] = !tmp_color;
                q.push_back(v[k]);
            }
            k = next[k];
        }
    }
}

void cal()
{
    int numu, numv;

    maxnum = 0;
    memset(visit, 0, sizeof(visit));

    for(int i = 1; i <= n; ++i) {
        numu = 0; numv = 0;
        if(first[i]!=-1 && !visit[i]) {
            for(int j = 1; j <= n; ++j)
                color[j] = -1;  // 还没有着色
            BFS(i);
            for(int j = 1; j <= n; ++j) {
                if(color[j] == 1) ++numu;
                else if(color[j] == 0) ++numv;
            }
            maxnum += max(numu, numv);
        }
    }

}

int main()
{
    int cases, casenum=0;
    scanf("%d", &cases);
    while(cases--) {
        scanf("%d", &m);
        readdata();
        cal();
        printf("Case %d: %d\n", ++casenum, maxnum);
    }

    return 0;
}
```
