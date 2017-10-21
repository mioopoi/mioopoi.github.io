---
layout: post
title: "带环链表"
description: ""
category: "算法"
tags: [链表,数学]
summary:
---

## 问题

如何判断一个链表是否有环？如果是，如何确定环的起点？

比如链表`10->4->5->7->3->2`，节点`2`指向节点`5`，这是一个有环的链表。

![linked-list](https://raw.githubusercontent.com/mioopoi/Images/master/2016-07-17-floyds-cycle-finding-algorithm/linked-list.png)

如果把链表展开，就是`10->4->5->7->3->2->5->7->3->2->...`，其中`5->7->3->2`这个子序列不断重复，构成了「环」。`5`是环的起点，`2`是环的终点；环的长度是最短重复子序列的长度，或者说是最小正周期（这里等于4）。

## 分析

当然，一个容易想到的办法是维护一个Hash Table，每访问一个节点，就将其记录下来，第一次重复访问了某一个节点时，就说明链表有环，而且该点就是环的起点。然而建立哈希表需要额外$O(n)$的空间开销，下面要讨论的方法不但不损失时间效率，而且不需要额外的空间消耗。

相信不少人都知道**快慢指针**一说。用快慢指针，看他们能不能相遇嘛...可是，为什么快慢指针是可行的？为什么快指针的速度是慢指针的2倍而不是3倍、5倍？为什么2倍关系的快慢指针一定会相遇？怎么证明？如果不弄清这些问题，就算代码写出来了，也只能说处于「一知半解」的层面，理解代码背后的思想，才是主要的。

可以认为带环链表是一个无限长序列，只是这个序列有一部分是周期序列。用$x_i (i=0,1,2,\ldots)$表示这个无限长序列的第$i$个元素，用$\lambda$表示环的长度，并设$x_{\mu} (\mu \ge 1 )$是环的起点。则对所有的$i \ge \mu$，有下式成立：

$$x_i = x_{i+k \lambda}$$

其中，$k$是不小于0的整数。

特别地，当$i = k \lambda \ge \mu$时，有$x_i = x_{2 i}$。这就是「快慢指针」的来源，即如果链表有环，将一快一慢指针同时从头节点出发（注：如果认为序列下标从1开始，那么初始的慢指针在位置1处，而快指针在位置2处），慢指针每次向前走一步，快指针每次向前走两步，那么两个指针一定会在某一点相遇。而它们相遇的这个点，一定处于环的内部，并且与头节点的距离是环长度的整数倍。

记快慢指针相遇的这个点是$x_v$，一定有$v \ge \mu$且$v = k \lambda$。于是，寻找环的起点就不难了，因为起点$\mu$一定满足$x_{\mu} = x_{\mu + v}$。我们只要从头节点开始遍历链表，第一个满足这个等式的节点就是环的起点。

上面的方法就是所谓的**Floyd's cycle-finding algorithm**。算法的时间复杂度是$O(\mu + \lambda)$，空间复杂度是$O(1)$。

## 算法实现(C++)

链表的数据结构定义如下：

```cpp
class ListNode {
public:
    int val;
    ListNode *next;
    ListNode(int val) {
        this->val = val;
        this->next = NULL;
    }
}
```

首先，基于快慢指针相遇的原理，判断是否有环。如果有环，记录两个指针相遇的位置（也就是$x_v$）。链表的头节点记为`head`，则该过程的代码为：

```cpp
ListNode *slow = head, *fast = head;
bool isCycle = false;
while (fast != NULL && fast->next != NULL) {
    slow = slow->next;
    fast = fast->next->next;
    if (fast == slow) {
        isCycle = true;
        break;
    }
}
```

其次，如果有环（即`isCycle`为`true`），则一个指针从头开始，另一个从$x_v$开始，同时以相同的速度往前移动，每次都移动一步。当两个指针相遇时，位置就是环的起点。

```cpp
ListNode *u = head, *v = slow;
while (u != v) {
    u = u->next;
    v = v->next;
}
```

综上，整个链表环路检测的函数如下所示。如果链表无环，返回`NULL` ；否则返回环的起点。

```cpp
ListNode *detectCycle(ListNode *head) {
    if (head == NULL) {
        return NULL;
    }

    ListNode *slow = head, *fast = head;
    bool isCycle = false;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        if (fast == slow) {
            isCycle = true;
            break;
        }
    }
    
    if (isCycle) {
        ListNode *u = head, *v = slow;
        while (u != v) {
            u = u->next;
            v = v->next;
        }
        return u;
    }
    return NULL;
}
```

另外，如果还要求环的长度（最小正周期），由于已经知道了环的起点，只要从它开始遍历，找到第一个等于起点的位置即可，最多还需要$O(\lambda)$的时间。

**相关练习**

[Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

[Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

## 参考

1. Wikipedia, Cycle detection, https://en.wikipedia.org/wiki/Cycle_detection
