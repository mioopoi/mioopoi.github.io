---
layout: post
title: "LintCode部分链表问题题解"
description: ""
category: "算法"
tags: [链表,linked list]
summary:
---

作者: [Takashi](http://mioopoi.github.io/about.html)


链表数据结构定义：

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

## LintCode 35. Reverse Linked List (翻转链表)

http://www.lintcode.com/en/problem/reverse-linked-list/

必须要掌握的基础知识。基本思路就是想办法将链表的所有指向反向，要点是两个指针的操作。比如要翻转链表`1->2->3`，从`1`开始(`head`开始指向1)，

1. 用一个`prev`指针表示当前处理的节点的前一个节点，初始化为`NULL`；
2. 首先要保存节点`2`（否则把`1`的指针反向后就找不到`2`了），为此须要用一个临时变量`next`，`next = head->next`；
3. 然后翻转指针，`head->next = prev`；
4. 最后更新`head`和`prev`（将两个指针向前移动）：`prev = head; head = next`（顺序不能互换）。
5. 重复步骤2~4，当`head`为空时，退出循环。这个时候，新的链表头节点是`prev`。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: The new head of reversed linked list.
     */
    ListNode *reverse(ListNode *head) {
        ListNode *prev = NULL, *next;
        while (head != NULL) {
            next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
};
```

## LintCode 36. Reverse Linked List II (翻转链表II) 

**思路1：两次遍历，空间O(n)**

第一次遍历，保存下m到n节点的数据；第二次遍历，修改m到n节点的数据（逆着替换）。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The head of linked list.
     * @param m: The start position need to reverse.
     * @param n: The end position need to reverse.
     * @return: The new head of partial reversed linked list.
     */
    ListNode *reverseBetween(ListNode *head, int m, int n) {
        if (m >= n || head == NULL) {
            return head;
        }
        ListNode *cur = head;
        vector<int> helper(n-m+1);
        int cnt = 0, k = 0;
        while (cur != NULL) {
            cnt += 1;
            if (cnt >= m && cnt <= n) {
                helper[k++] = cur->val;
            }
            cur = cur->next;
        }
        
        cur = head; cnt = 0;
        while (cur != NULL) {
            cnt += 1;
            if (cnt >= m && cnt <= n) {
                cur->val = helper[--k];
            }
            cur = cur->next;
        }
        
        return head;
    }
};
```

**思路2：两次遍历，空间O(1)**

首先找到所制定的区间（端点），然后翻转区间，最后实施重连。

1. 创建dummy node，记下head；提醒一下，如果是C++，为了避免内存泄漏，创建dummy node时最好不要用`ListNode *dummy = new ListNode(0)`，而是创建结构体：`ListNode dummy(0)`，然后访问的时候通过`.`即可。
2. 通过一次遍历，找到第m个节点`mth`，第m个节点的前一个节点`mth_prev`，第n个节点，第n个节点的后一个节点`nth_next`。
3. 翻转指定区间的链表段（同翻转整个链表的方法）。一种方法是，先`nth->next=NULL`，然后调用Reverse Linked List的方法，输入为`mth`。
4. 重新连接链表。这时指定区间的链表已经反向，把`mth_prev`与`nth`相连，`mth`与`nth_next`相连。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The head of linked list.
     * @param m: The start position need to reverse.
     * @param n: The end position need to reverse.
     * @return: The new head of partial reversed linked list.
     */
    ListNode *reverseBetween(ListNode *head, int m, int n) {
        ListNode dummy(0);
        dummy.next = head;
        
        ListNode *mth, *nth, *mth_prev = &dummy, *nth_next;
        for (int i = 1; i <= n; ++i) {
            if (i == m - 1) mth_prev = head;
            if (i == n) nth = head;
            if (head->next != NULL) {
                head = head->next;
            }
        }
        mth = mth_prev->next;
        nth_next = nth->next;
        
        nth->next = NULL; // important
        reverse(mth);
        mth_prev->next = nth;
        mth->next = nth_next;
        
        return dummy.next;
    }

    void reverse(ListNode *head) {
        ListNode *prev = NULL, *next;
        while (head != NULL) {
            next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        //head = prev;
    }
};
```

## LintCode 96. Partition List (链表划分)

思想和快排的Partition一样，不过链表的优点在这里就体现出来了：比基于数组的Partition方便的多。

创建两个dummy node，`leftDummy`和`rightDummy`，分别对应划分后的两个链表，然后遍历原始链表，比给定的值小就连到`leftDummy`链表后面，否则就连到`rightDummy`链表后面。**注意最后要将`rightDummy`的最后一个节点的`next`域置空**。

时间O(n)，空间O(1)

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @param x: an integer
     * @return: a ListNode 
     */
    ListNode *partition(ListNode *head, int x) {
        if (head == NULL) {
            return NULL;
        }
        
        ListNode leftDummy(0), rightDummy(0);
        ListNode *left = &leftDummy, *right = &rightDummy;
        
        while (head != NULL) {
            if (head->val < x) {
                left->next = head;
                left = head;
            } else {
                right->next = head;
                right = head;
            }
            head = head->next;
        }
        
        right->next = NULL;    // important
        left->next = rightDummy.next;
        return leftDummy.next;
    }
};
```

## LintCode 452. Remove Linked List Elements (删除链表中的元素)

1. 创建一个dummy node，连在head前；
2. 用一个指针`cur`表示当前所在节点，初始化为`&dummy`
3. 判断`cur->next`是否等于目标值，如果不等，指针往前走；否则`cur->next = cur->next->next`

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head a ListNode
     * @param val an integer
     * @return a ListNode
     */
    ListNode *removeElements(ListNode *head, int val) {
        if (head == NULL) {
            return NULL;
        }
        
        ListNode dummy(0); dummy.next = head;
        ListNode *cur = &dummy;
        
        while (cur != NULL) {
            while (cur->next != NULL && cur->next->val == val) {
                cur->next = cur->next->next;
            }
            cur = cur->next;
        }
        
        return dummy.next;
    }
};
```

## LintCode 372. Delete Node in the Middle of Singly Linked List (以O(1)时间复杂度删除链表节点)

http://www.lintcode.com/zh-cn/problem/delete-node-in-the-middle-of-singly-linked-list/

讲真刚看到这题还觉得挺迷（注意被删除的点不是首、末节点），不告诉我前一个节点怎么删除啊...其实解法有点猥琐-.-

这个解法就是“狸猫换太子”：把待删除节点的值用后一个节点的值替代，然后跳过后一个节点。其实删除的并不是输入的这个节点，而是输入节点的后一个节点...有点伤感...

C++代码：

```cpp
class Solution {
public:
    /**
     * @param node: a node in the list should be deleted
     * @return: nothing
     */
    void deleteNode(ListNode *node) {
        if (node == NULL || node->next == NULL) {
            return;
        }
        ListNode *next = node->next;
        node->val = next->val;
        node->next = next->next;
        return;
    }
};
```

## LintCode 217. Remove Duplicates from Unsorted List (无序链表的重复项删除)

http://www.lintcode.com/zh-cn/problem/remove-duplicates-from-unsorted-list/

**方法1 暴力搜索(双重循环)**

O(n^2)

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: head node
     */
     ListNode *removeDuplicates(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode dummy(0); dummy.next = head;
        ListNode *prev, *ref;
        while (head != NULL) {
            prev = head; ref = head->next;
            while (ref != NULL) {
                if (ref->val == head->val) {
                    prev->next = ref->next;
                    ref = ref->next;
                } else {
                    ref = ref->next;
                    prev = prev->next;
                }
            }
            head = head->next;
        }
        return dummy.next;
    }
};
```

**方法2 使用Hash**

遍历链表，过程中将没出现过的节点值存入hash table，出现过的就删除。

如果hash table的访问是O(1)的话，平均时间复杂度就是O(n)

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: head node
     */
     ListNode *removeDuplicates(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        map<int, bool> myhash;
        myhash[head->val] = true;
        ListNode *cur = head->next, *prev = head;
        while (cur != NULL) {
            if (myhash.find(cur->val) != myhash.end()) {
                prev->next = cur->next;
            } else {
                myhash[cur->val] = true;
                prev = prev->next;
            }
            cur = cur->next;
        }
        return head;
    }
};
```

在LintCode上，方法1耗时**2019ms**，方法2只需要**126ms**。使用Hash是用空间换了时间。

## LintCode 112. Remove Duplicates From Sorted List (删除排序链表中的重复元素)

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: head node
     */
    ListNode *deleteDuplicates(ListNode *head) {
        if (head == NULL) {
            return NULL;
        }
        
        ListNode dummy(0); dummy.next = head;
        ListNode *right = head;
        while (head != NULL) {
            int x = right->val;
            while (right != NULL && right->val == x) {
                right = right->next;
            }
            head->next = right;
            head = right;
        }
        return dummy.next;
    }
};
```

## LintCode 228. Middle of Linked List (链表的中点)

http://www.lintcode.com/zh-cn/problem/middle-of-linked-list/

很重要的链表基础操作。idea就是用*一快一慢指针*，慢的每次前进一步，快的每次前进两步，当快的到达终点时，慢的指针所在的位置就是链表的中点。

C++代码：

```cpp
class Solution{
public:
    /**
     * @param head: the head of linked list.
     * @return: a middle node of the linked list
     */
    ListNode *middleNode(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *low = head, *fast = head;
        while (fast->next != NULL && fast->next->next != NULL) {
            low = low->next;
            fast = fast->next->next;
        }
        return low;
    }
};
```

## LintCode 166. Nth to Last Node in List (链表倒数第n个节点)

http://www.lintcode.com/zh-cn/problem/nth-to-last-node-in-list/

**思路1 (先求链表长度)**

1. 先遍历一次链表，走到底，记下链表长度`len`.
2. 第二次遍历链表，走到`len-n+1`的位置，就是倒数第n个节点.

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @param n: An integer.
     * @return: Nth to last node of a singly linked list. 
     */
    ListNode *nthToLast(ListNode *head, int n) {
        if (head == NULL || n <= 0) {
            return NULL;
        }
        ListNode *cur = head;
        int cnt = 1;
        while (cur->next != NULL) {
            cnt++;
            cur = cur->next;
        }
        cur = head;
        for (int i = 1; i < cnt - n + 1; ++i) {
            cur = cur->next;
        }
        return cur;
    }
};
```

**思路2 (两个指针)**

维护两个指针：主指针`mainPtr`和参照指针`refPtr`，开始都指向`head`。首先将参照指针`refPtr`移到第n个节点，然后两个指针同时往前走，当参照指针到达最后一个节点时，主指针所处为位置就是倒数第n个节点。

这个方法比较巧妙，只需遍历一次链表。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @param n: An integer.
     * @return: Nth to last node of a singly linked list. 
     */
    ListNode *nthToLast(ListNode *head, int n) {
        if (head == NULL || n <= 0) {
            return NULL;
        }
        
        ListNode *mainPtr = head, *refPtr = head;
        for (int i = 1; i < n; ++i) {
            refPtr = refPtr->next;
        }
        while (refPtr->next != NULL) {
            mainPtr = mainPtr->next;
            refPtr = refPtr->next;
        }
        
        return mainPtr;
    }
};
```

**参考**

1. Geeksforgeeks, http://www.geeksforgeeks.org/nth-node-from-the-end-of-a-linked-list/

## LintCode 165. Merge Two Sorted Lists (合并两个排序链表) 

http://www.lintcode.com/zh-cn/problem/merge-two-sorted-lists/

模拟合并排序数组的操作。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param ListNode l1 is the head of the linked list
     * @param ListNode l2 is the head of the linked list
     * @return: ListNode head of linked list
     */
    ListNode *mergeTwoLists(ListNode *l1, ListNode *l2) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (l1 && l2) {
            if (l1->val < l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1? l1:l2;
        return dummy.next;
    }
};
```

## LintCode 104. Merge K Sorted Lists (合并k个排序链表)

http://www.lintcode.com/zh-cn/problem/merge-k-sorted-lists/

建议做这个问题之前，先解决[Merge Two Sorted Lists](http://www.lintcode.com/zh-cn/problem/merge-two-sorted-lists/)。

**思路1: 依次合并**

遍历vector，每次调用`mergeTwoLists`即可。时间复杂度O(k N)，其中k是链表的个数，N是合并完k个链表后的链表总长度。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param lists: a list of ListNode
     * @return: The head of one sorted list.
     */
    ListNode *mergeKLists(vector<ListNode *> &lists) {
        if (lists.empty()) {
            return NULL;
        }
        ListNode *mylist = NULL;
        for (int i = 0; i < lists.size(); ++i) {
            mylist = mergeTwoLists(mylist, lists[i]);
        }
        return mylist;
    }

    ListNode *mergeTwoLists(ListNode *l1, ListNode *l2) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (l1 && l2) {
            if (l1->val < l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1? l1:l2;
        return dummy.next;
    }
};
```

**思路2: 分治**

把vector分成左、右两部分，然后分别对左、右两边做`mergeKLists`，最后合并左、右的有序链表。时间复杂度O(N log k)。 其中k是链表个数，N是合并完k个链表后的总长度。

```cpp
class Solution {
public:
    /**
     * @param lists: a list of ListNode
     * @return: The head of one sorted list.
     */
    ListNode *mergeKLists(vector<ListNode *> &lists) {
        int n = lists.size();
        if (n == 0) {
            return NULL;
        }
        if (n == 1) {
            return lists[0];
        }
        return mergeKHelper(lists, 0, n-1);
    }
    
    ListNode *mergeKHelper(vector<ListNode *> &lists, int start, int end) {
        if (start == end) {
            return lists[start];
        }
        int mid = start + (end - start) / 2;
        ListNode *left = mergeKHelper(lists, start, mid);
        ListNode *right = mergeKHelper(lists, mid+1, end);
        return mergeTwoLists(left, right);
    }

    ListNode *mergeTwoLists(ListNode *l1, ListNode *l2) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (l1 && l2) {
            if (l1->val < l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1? l1:l2;
        return dummy.next;
    }
};
```

**其他非主流方法**

1. 合并`lists[0]`和`lists[1]`，并覆盖`lists[0]`；合并`lists[2]`和`lists[3]`，并覆盖`lists[1]`，合并`lists[4]`和`lists[5]`，并覆盖`lists[2]`...如此进行下去；修改vector下标的边界。
2. 重复上面的过程，直到所有链表合并完毕。

对边界的确定要留心。

```cpp
class Solution {
public:
    /**
     * @param lists: a list of ListNode
     * @return: The head of one sorted list.
     */
    ListNode *mergeKLists(vector<ListNode *> &lists) {
        if (lists.empty()) {
            return NULL;
        }
        int len = lists.size();
        while (len >= 2) {
            for (int i = 0; i < len / 2; ++i) {
                lists[i] = mergeTwoLists(lists[i<<1], lists[i<<1|1]);
            }
            if (len % 2 == 0) {
                len  = len>>1;
            } else {
                lists[len>>1] = lists[len-1];
                len = (len>>1) + 1;  // note: the priority of '+' is larger than '>>'
            }
        }
        return lists[0];
    }
};
```

注：上面这段代码`mergeTwoLists()`就省略了，和之前的完全一样。另外，用了移位操作， `len<<1` 即 `len * 2` ， `len<<1|1` 即 `len*2 + 1`，类似的， `len>>1` 等价于 `len / 2`。

## LintCode 98. Sort List (链表排序) 

非常好的一道题。掌握这个问题的高效实现方法很有助于加强对链表的各种操作。

如果用归并排序做，建议解决这题之前，先掌握以下两个基础问题：

1. 找链表中点: http://www.lintcode.com/zh-cn/problem/middle-of-linked-list/
2. 合并两个排序链表: http://www.lintcode.com/zh-cn/problem/merge-two-sorted-lists/

归并排序的基本思想就不多说了，提一个要点，找到链表中点`mid`后，要先保存`mid->next`，然后令`mid->next = NULL`，是为了把左右链表划分开来。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: You should return the head of the sorted linked list,
                    using constant space complexity.
     */
    ListNode *sortList(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *mid = middleNode(head);
        ListNode *right = mid->next;
        mid->next = NULL;
        
        ListNode *l = sortList(head);
        ListNode *r = sortList(right);
        
        return mergeTwoLists(l, r);
    }
    
    ListNode *middleNode(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *low = head, *fast = head;
        while (fast->next != NULL && fast->next->next != NULL) {
            low = low->next;
            fast = fast->next->next;
        }
        return low;
    }

    ListNode *mergeTwoLists(ListNode *l1, ListNode *l2) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (l1 && l2) {
            if (l1->val < l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1? l1:l2;
        return dummy.next;
    }
};
```

当然用快排也可以做，只是对于极端情况（当链表所有节点值都相等时）要注意特判。

## LintCode 451. Swap Nodes in Pairs (两两交换链表中的节点)

http://www.lintcode.com/zh-cn/problem/swap-nodes-in-pairs/#

**思路1 值交换**

用两个指针指向待交换的两个相邻节点，通过修改两个节点的值实现交换，需要一个临时变量。

```cpp
class Solution {
public:
    /**
     * @param head a ListNode
     * @return a ListNode
     */
    ListNode* swapPairs(ListNode* head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *first = head, *second = head->next;
        while (first != NULL && second != NULL) {
            int tmp = first->val;
            first->val = second->val;
            second->val = tmp;
            first = second->next;
            if (first != NULL) {
                second = first->next;
            }
        }
        return head;
    }
};
```

**思路2 指针交换**

记第一个节点的前继节点为`fstPrev`，待交换的两个节点依次是`first`和`second`。即节点顺序是fstPrev->first->second->...

一次交换过程为：

1. `fstPrev->next = second`
2. `first->next = second->next`
3. `second->next = first`

注意2和3不能互换。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head a ListNode
     * @return a ListNode
     */
    ListNode* swapPairs(ListNode* head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode dummy(0); dummy.next = head;
        ListNode *first, *second;
        ListNode *fstPrev = &dummy;
        
        while (fstPrev->next != NULL && fstPrev->next->next != NULL) {
            first = fstPrev->next;
            second = first->next;
            
            fstPrev->next = second;
            first->next = second->next;
            second->next = first;
            
            fstPrev = first;
        }
        
        return dummy.next;
    }
};
```

## LintCode 99. Reorder List (重排链表)

http://www.lintcode.com/zh-cn/problem/reorder-list/

很好的一个将链表的一些操作组合起来的问题。建议解决该问题之前，先解决以下两个问题：

1. [Middle of Linked List](http://www.lintcode.com/zh-cn/problem/middle-of-linked-list/)
2. [Reverse Linked List](http://www.lintcode.com/zh-cn/problem/reverse-linked-list/)

这个问题的操作步骤如下：

1. 先找到链表的中点，将链表划分为左右两个部分；
2. 将右链表翻转；
3. 再按要求合并左右链表。

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: void
     */
    void reorderList(ListNode *head) {
        if (head == NULL || head->next == NULL || head->next->next == NULL) {
            return;
        }
        
        mid = middleNode(head);
        ListNode *left = head, *right = mid->next;
        mid->next = NULL;
        // reverse right
        right = reverse(right);
        // reorder
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (left != NULL && right != NULL) {
            cur->next = left;
            left = left->next;
            cur = cur->next;
            
            cur->next = right;
            right = right->next;
            cur = cur->next;
        }
        if (left != NULL) {
            cur->next = left;
        }
        if (right != NULL) {
            cur->next = right;
        }
        head = dummy.next;
    }

private:
    ListNode *mid;
    ListNode *middleNode(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *low = head, *fast = head;
        while (fast->next != NULL && fast->next->next != NULL) {
            low = low->next;
            fast = fast->next->next;
        }
        return low;
    }

    ListNode *reverse(ListNode *head) {
        ListNode *prev = NULL, *next;
        while (head != NULL) {
            next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
};
```

## LintCode 105. Copy List with Random Pointer (复制带随机指针的链表)

http://www.lintcode.com/zh-cn/problem/copy-list-with-random-pointer/

**思路1 (使用Hash Table)**

copy的意思就是完整地新建一个和原来链表一样的链表，但是这个新的链表必须占据新的内存空间。如果仅仅是一个单向链表，是很容易做的，遍历链表的同时不断`new`出新的节点即可。难点在于`random`域的复制，因为一个节点的`random`可以指向任何一个其他节点，比如链表`3->2->4->null`，`random`域分别是`[null,2,3]`，第三个节点的`random`指向第一个节点，复制的时候怎么办？如何知道前面new出来的节点哪个是对应的random节点？

一种可行的方法是维护一个hash table，`key`是原来的节点，`value`是对应的新节点。设原节点为`x`，对应的新节点为`x'`，要确定`x'`的`random`域，只要在hash表中查找`key`为`x->random`的`value`即可。比如原节点`4`，要确定`4'`的`random`，查找`key` 为`4->random`即`3`的`value`，是`3'`，于是`4'`的`random`就是`3'`。

| 3 (null) | 2 (2) | 4 (3) |
| -------- | ----- | ----- |
| 3'       | 2'    | 4'    |

时间复杂度是O(n)，维护hash table需要额外O(n)的空间。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The head of linked list with a random pointer.
     * @return: A new head of a deep copy of the list.
     */
    RandomListNode *copyRandomList(RandomListNode *head) {
        if (head == NULL) {
            return NULL;
        }
        RandomListNode *newList = copyNext(head);
        addRandom(head, newList);
        return newList;
    }

private:
    map<RandomListNode*, RandomListNode*> mymap;
    
    RandomListNode *copyNext(RandomListNode *head) {
        RandomListNode dummy(0);
        RandomListNode *cur = &dummy;
        while (head != NULL) {
            RandomListNode *newNode = new RandomListNode(head->label);
            mymap[head] = newNode;
            cur->next = newNode;
            cur = cur->next;
            head = head->next;
        }
        return dummy.next;
    }
    
    void addRandom(RandomListNode *oldList, RandomListNode *newList) {
        while (oldList != NULL) {
            newList->random = mymap[ oldList->random ];
            oldList = oldList->next;
            newList = newList->next;
        }
    }
};
```

**思路2 (交替重构链表)**

这种方法很巧妙，时间复杂度O(n)，空间复杂度O(1)。但是该方法不具备通用性，知道有这么个方法就行了。

比如对于链表`3->2->4->null`。

第一步：复制链表，但是把节点插入在原节点的后面：

`3->3'->2->2'->4->4'->null`

这样做的好处是，没有开辟额外的空间，就能够表达原链表和新链表之间的对应关系。而且，原链表、新链表的构成也并没有被破坏。比如对于原节点`x`，它在原链表中的下一个节点是`x->next->next`，而它对应的新节点是`x->next`。

第二步，填充新节点的`random`域。

第三步，分离原链表和新链表。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The head of linked list with a random pointer.
     * @return: A new head of a deep copy of the list.
     */
    RandomListNode *copyRandomList(RandomListNode *head) {
        if (head == NULL) {
            return NULL;
        }
        insertCopy(head);
        setRandom(head);
        return separate(head);;
    }

private:
    void insertCopy(RandomListNode *head) {
        while (head != NULL) {
            RandomListNode *newNode = new RandomListNode(head->label);
            newNode->next = head->next;
            head->next = newNode;
            head = newNode->next;
        }
    }
    
    void setRandom(RandomListNode *head) {
        while (head != NULL) {
            if (head->random != NULL) {    // improtant
                head->next->random = head->random->next;
            }
            head = head->next->next;
        }
    }
    
    RandomListNode *separate(RandomListNode *head) {
        RandomListNode *newHead = head->next;
        while (head != NULL) {
            RandomListNode *tmp = head->next;
            head->next = tmp->next;
            head = head->next;
            if (tmp->next != NULL) {
                tmp->next = tmp->next->next;
            }
        }
        return newHead;
    }
};
```

## LintCode 106. Convert Sorted List to Balanced BST 

http://www.lintcode.com/zh-cn/problem/convert-sorted-list-to-balanced-bst/

先找排序链表的中点（一快一慢指针），根据重点构造BST的根节点；然后分辨将中点左、右两边的链表转换成BST，再把它们与根节点连起来即可。

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: a tree node
     */
    TreeNode *sortedListToBST(ListNode *head) {
        if (head == NULL) {
            return NULL;
        }
        if (head->next == NULL) {
            return (new TreeNode(head->val));
        }
        ListNode dummy(INT_MIN); dummy.next = head;
        ListNode *midNode = middleNode(&dummy);
        
        TreeNode *root = new TreeNode(midNode->next->val);
        TreeNode *right = sortedListToBST(midNode->next->next);
        midNode->next = NULL;    // important
        TreeNode *left = sortedListToBST(head);
        
        root->left = left;
        root->right = right;
        return root;
    }

    ListNode *middleNode(ListNode *head) {
        if (head == NULL || head->next == NULL) {
            return head;
        }
        
        ListNode *low = head, *fast = head;
        while (fast->next != NULL && fast->next->next != NULL) {
            low = low->next;
            fast = fast->next->next;
        }
        return low;
    }
};
```

## LintCode 102. Linked List Cycle (带环链表)

http://www.lintcode.com/zh-cn/problem/linked-list-cycle/

**思路1 Hash Table**

开一个hash table，标记访问过的节点，如果重复访问了某一节点，说明有环。需要额外O(n)的空间复杂度。

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: True if it has a cycle, or false
     */
    bool hasCycle(ListNode *head) {
        if (head == NULL) {
            return false;
        }
        while (head != NULL) {
            myhash[head] = true;
            if (myhash.find(head->next) == myhash.end()) {
                head = head->next;
            } else {
                return true;
            }
        }
        return false;
    }
    
private:
    map<ListNode*, bool> myhash;
};
```

**思路2 快慢指针**

用一快一慢指针，开始两个指针都指向`head`，慢指针每次向前走一步，快指针每次向前走两步。如果有环，则两个指针最终一定会相遇。这种方法无须额外的空间。

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: True if it has a cycle, or false
     */
    bool hasCycle(ListNode *head) {
        if (head == NULL) {
            return false;
        }
        ListNode *slow = head, *fast = head;
        while (fast != NULL && fast->next != NULL) {
            slow = slow->next;
            fast = fast->next->next;
            if (fast == slow) {
                return true;
            }
        }
        return false;
    }
};
```

## LintCode 103. Linked List Cycle II

http://www.lintcode.com/zh-cn/problem/linked-list-cycle-ii/

一个方法是使用Hash Table，需要额外的空间开销，不多说了。这题快慢指针依然有很巧妙的方法。这个算法叫[Floyd's cycle-finding algorithm](https://en.wikipedia.org/wiki/Cycle_detection)。详细介绍请戳[这里](http://ihuafan.com/%E7%AE%97%E6%B3%95/floyds-cycle-finding-algorithm)。

C++代码：

```cpp
class Solution {
public:
    /**
     * @param head: The first node of linked list.
     * @return: The node where the cycle begins. 
     *           if there is no cycle, return null
     */
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
            ListNode *u = head;
            while (u != slow) {
                u = u->next;
                slow = slow->next;
            }
            return u;
        }
        return NULL;
    }
};
```

## LintCode 170. Rotate List (旋转链表)

http://www.lintcode.com/problem/rotate-list/

与其说是「旋转链表」，倒不如说「对链表进行循环移位」更合适些。比如`1->2->3->4->5->null`，往右移2位，就是`4->5->1->2->3->null`。

如果往右移k位，思路是

1. 首先计算链表的长度`len`
2. `k = k % len`。因为`k`可能比链表长度还大，取余并不影响结果。
3. 找到链表倒数第`k+1`个节点`x`，它将是新链表的末节点。（快慢指针）
4. 以`x`为分界点，重新组合链表。

C++代码：

```cpp
struct ReturnType {
    ListNode *target;
    ListNode *last;
    ReturnType(ListNode *t, ListNode *l) : target(t), last(l) {}
};

class Solution {
public:
    /**
     * @param head: the list
     * @param k: rotate to the right k places
     * @return: the list after rotation
     */
    ListNode *rotateRight(ListNode *head, int k) {
        if (head == NULL) return head;
        int len = lenList(head);
        k = k % len;
        if (k == 0) return head;
        
        ReturnType x = nthToLast(head, k+1);
        ListNode *newHead = x.target->next;
        x.target->next = NULL;
        x.last->next = head;
        return newHead;
    }
    
    int lenList(ListNode *head) {
        int len = 0;
        while (head != NULL) {
            len++;
            head = head->next;
        }
        return len;
    }
    
    ReturnType nthToLast(ListNode *head, int n) {
        if (head == NULL || n <= 0) {
            return ReturnType(NULL, NULL);
        }
        
        ListNode *mainPtr = head, *refPtr = head;
        for (int i = 1; i < n; ++i) {
            refPtr = refPtr->next;
        }
        while (refPtr->next != NULL) {
            mainPtr = mainPtr->next;
            refPtr = refPtr->next;
        }
        
        ReturnType rst(mainPtr, refPtr);
        
        return rst;
    }
};
```

