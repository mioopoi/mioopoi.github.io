---
layout: post
title: "基本路径搜索算法小结"
description: ""
category: "算法"
tags: [图论, BFS]
summary:
---

(Hint: 以下代码全部采用`C++11`编写)

## 图的基本数据结构

这里我们全部采用邻接表的形式:

```cpp
class DirectedGraphNode {
  int label;  // 标号, 根据不同的需求使用, 比如起点到该点的距离
  vector<DirectedGraphNode*> neighbors;
  DirectedGraphNode(int x) : label(x) {};
};
```

如果用上面的方式定义节点，整个图就可以用如下的方式存储:

```cpp
class Graph {
public:
  vector<DirectedGraphNode*> nodes;
};
```

## 宽度优先搜索 (BFS)

宽度优先搜索使用一个队列维护当前探索到的"前线"，每一次从队列中取出一项，并考察从它可以继续走到哪些（没有探索过的）地方，然后把这些地点推入队列。

特别地，如果我们要搜索某一个目标点，每次从队列中取出一项时考察它是否就是我们要找的目标即可。代码非常直观：

```cpp
// Graph graph;
void Search(DirectedGraphNode* start, DirectedGraphNode* goal) {
  queue<DirectedGraphNode*> frontier;  // 前线
  frontier.push(start);  // 从起点出发开始探索
  unordered_map<DirectedGraphNode*, DirectedGraphNode*> came_from;  // came_from[x]表示从哪个地点到达x，即：key-探索到的某一节点, value-路径上到达该节点的前继节点
  came_from[start] = NULL;
  
  while (!frontier.empty()) {
    auto current = frontier.front(); frontier.pop();
    
    if (current == goal) {
      break;  // 找到目标，退出
    }
    
    for (auto next : current->neighbors) { // 从当前点继续探索
      if (came_from.count(next) == 0) { // 新的地方没有被探索过
        frontier.push(next);
        came_from[next] = current;
      }
    }
  }
  
  // 现在根据came_from可以很容易地构建从start到goal的路径
}
```

## 带权的"宽搜"

BFS认为从一个地点到另一个与其相邻的地点的边都是无权的，如果边是有权重的，要找到从起点到目标点的最短路径，怎么办？

由于需要记录所有边的"代价"（即权重），我们须要丰富节点的数据结构：

```cpp
class DirectedGraphNode {
  int label;  // 起点到该点的距离
  vector<pair<DirectedGraphNode*, int>> neighbors;
  DirectedGraphNode(int x) : label(x) {};
};
```

我们将`neighbors`以`vector<pair<DirectedGraphNode*, int>>`的形式存储，`pair`的第一项依然表示具体的相邻点，而第二项就表示当前点与该相邻点的权重。

`label`表示起点到当前点的距离，它被初始化为一个很大的数，表示我们还没有探索到这个位置。

现在我们须要对基本的BFS做一下推广：
- 将FIFO队列变成优先队列，因为我们希望每次从与起点相距最近的点开始往外探索，这样每次取出的点的距离标号一定是起点到它的最短距离。
- 只要我们找到了到某一点更短的路径，就将该点加入优先队列。

我们把节点的优先级定义为`起点到该点的当前最小距离`，如果这个量越小，则优先级越大，通过`C++`的仿函数实现：

```cpp
struct Cmp {
  bool operator()(const DirectedGraphNode* a, const DirectedGraphNode* b) {
    return a->label > b->label;
  }
}
```

```cpp
// Graph graph;
void Search(DirectedGraphNode* start, DirectedGraphNode* goal) {
  priority_queue<DirectedGraphNode*, vector<DirectedGraphNode*>, Cmp> frontier;  // 前线
  frontier.push(start);  // 从起点出发开始探索
  unordered_map<DirectedGraphNode*, DirectedGraphNode*> came_from;  // came_from[x]表示从哪个地点到达x，即：key-探索到的某一节点, value-最短路径上到达该节点的前继节点
  came_from[start] = NULL;
  start->label = 0;
  
  while (!frontier.empty()) {
    auto current = frontier.front(); frontier.pop();
    
    if (current == goal) {
      break;  // 找到目标，退出
    }
    
    for (auto& next : current->neighbors) { // 从当前点继续探索
      // next: pair<DirectedGraphNode*, int>
      auto next_node = next.first;
      auto w = next.second;
      auto new_cost = current->label + w;
      if (new_cost < next_node->label) { // 发现了一条到next_node更短的路径
        next_node->label = new_cost;
        frontier.push(next);
        came_from[next] = current;
      }
    }
  }
  
  // 现在根据came_from可以很容易地构建从start到goal的路径
}
```

是的，这就是所谓的`Dijkstra's Algorithm`！

## 参考

- [Introduction to A-star](http://www.redblobgames.com/pathfinding/a-star/introduction.html) (我读过的最好的讲解A-star算法的文章)
