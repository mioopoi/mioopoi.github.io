---
layout: post
title: 直方图最大矩形
description: ""
category: "算法"
tags: LintCode, Divide and Conquer, stack
summary:
---


题目链接: http://www.lintcode.com/problem/largest-rectangle-in-histogram/

## 暴力搜索

如果想求出直方图最大矩形覆盖，那么能够直接想到的方法是求每一个直方图能形成的最大矩形面积。可以暴力枚举，对每个直方图，分别往左、右扫描，找到第一个比其矮的直方图，确定左右边界，然后计算面积。这样做的复杂度是`O(n^2)`，空间复杂度`O(1)`。

```cpp
class Solution {
public:
    /**
     * @param height: A list of integer
     * @return: The area of largest rectangle in the histogram
     */
    int largestRectangleArea(vector<int> &height) {
        if (height.empty()) {
            return 0;
        }
        
        int rst = 0;
        for (int i = 0; i < height.size(); ++i) {
            int left = i, right = i;
            int j;
            // left
            for (j = i; j >= 0; --j) {
                if (height[j] < height[i]) {
                    left = j;
                    break;
                }
            }
            if (j == -1) {
                left = j;
            }
            // right
            for (j = i; j < height.size(); ++j) {
                if (height[j] < height[i]) {
                    right = j;
                    break;
                }
            }
            if (j == height.size()) {
                right = j;
            }
            rst = max(rst, height[i]*(right-left-1));
        }
        
        return rst;
    }
};
```

然而这份代码会超时。

## O(nlogn)的分治法
idea是利用最矮的那个直方图，将其作为二分的分界线。
1. 找到数组中最小的元素，计算矩形覆盖`candidate = 最小元素 * 直方图数量`
2. 计算最小元素左边的最大矩形覆盖`leftMax`（不包括最小元素）
3. 计算最小元素右边的最大矩形覆盖`rightMax`（不包括最小元素）
4. 最大矩形覆盖是 max( candidate, leftMax, rightMax )

上面第2、3步递归执行。

考虑最坏情况的case（虽然出现的概率很低），即当数组都是单调递增或递减的情况，每次划分都有一边为0个元素。如果用线性扫描找最小元素，递归方程是：`!$ T(n) = O(n) + T(n-1) $`，和快排的一样，解出来是`!$ T(n) = O(n^2) $`。~~如果用线性扫描，会超时，亲测有效~~

所以如果可以在递归的过程中高效地求得数组中的最小元素，那将是极好的。有这样的方法吗？答案是**线段树**。建一棵线段树，根节点区间范围即是`[0,n-1]`（n为数组元素数量），每个节点保存的是该区间上最小元素的下标。这样查询区间最小值就只需O(logn)的时间了。递归方程变为`!$ T(n) = O(\log n) + T(n-1) $`，其解是`!$ T(n) = O(\log (n!)) = O(n \log n) $`。另外，建立线段树需要O(n)，所以总体的最坏时间复杂度是`!$ O(n \log n) $` (平均时间复杂度应该是`!$ O(n) $`)

C++代码：

```cpp
struct MySegmentTreeNode
{
    int start, end;
    int cnt;
}tree[3*1000000 + 5];

class Solution
{
public:
    int largestRectangleArea(vector<int> &height) {
        if (height.empty()) return 0;
        int start = 0, end = height.size()-1;
        build(tree, 1, start, end, height);
        return findMaxSize(height, start, end, tree);
    }

private:
    void build(MySegmentTreeNode* tree, int id, int start, int end, vector<int> &A)
    {
        if (start == end) {
            tree[id].start = start, tree[id].end = end;
            tree[id].cnt = start;
            return;
        }
        tree[id].start = start;
        tree[id].end = end;
        int mid = start + ( (end - start) >> 1 );
        build(tree, id<<1, start, mid, A);
        build(tree, id<<1|1, mid+1, end, A);
        tree[id].cnt = A[tree[id<<1].cnt] < A[tree[id<<1|1].cnt]? tree[id<<1].cnt : tree[id<<1|1].cnt;
    }

    int query(MySegmentTreeNode* tree, int id, int start, int end, vector<int> &A)
    {
        if (tree[id].start == start && tree[id].end == end) {
            return tree[id].cnt;
        }
        int mid = tree[id].start + ( (tree[id].end - tree[id].start) >> 1 );
        if (end <= mid) {
            return query(tree, id<<1, start, end, A);
        } else if (start > mid) {
            return query(tree, id<<1|1, start, end, A);
        } else {
            int left = query(tree, id<<1, start, mid, A);
            int right = query(tree, id<<1|1, mid+1, end, A);
            return (A[left] < A[right]? left:right);
        }
    }

    int findMaxSize(vector<int> &A, int start, int end, MySegmentTreeNode* tree)
    {
        if (start > end) {
            return 0;
        }
        int minID = query(tree, 1, start, end, A);
        int s1 = A[minID] * (end - start + 1);
        int s2 = findMaxSize(A, start, minID - 1, tree);
        int s3 = findMaxSize(A, minID + 1, end, tree);
        return max( s1, max( s2, s3 ) );
    }
};

```

## 一个巧妙的O(n)级算法

这个问题还有一个巧妙的方法，就是用栈。

思路：
1. 开一个栈，依次将数组的元素（的下标）入栈
2. 当数组元素大于栈顶元素时，直接将数组元素入栈；否则不断弹出栈顶元素，直到栈顶元素不大于该数组元素或者栈空，再将数组元素入栈。这个操作过程能够保证栈顶元素是即将入栈的数组元素的“左边界”。
3. 步骤2执行完之后，如果栈不空，那么栈中保存着一个递增的序列（从底部往出口），再依次弹出栈中的元素，同时计算每个元素能够达到的最大矩形面积。

第一版AC代码，比较冗长：

```cpp
class Solution {
public:
    /**
     * @param height: A list of integer
     * @return: The area of largest rectangle in the histogram
     */
    int largestRectangleArea(vector<int> &height) {
        if (height.empty()) {
            return 0;
        }
        
        int rst = height[0];
        stack<int> mystack;
        mystack.push(0);
        for (int i = 1; i < height.size(); ++i) {
            int id = mystack.top();
            if (height[i] > height[id]) {
                mystack.push(i);
            } else {
                int s;
                int left, right = i - 1;
                while (!mystack.empty() && height[id] > height[i]) {
                    mystack.pop();
                    if (!mystack.empty()) {
                        left = mystack.top();
                    } else {
                        left = -1;
                    }
                    s = height[id] * (right - left);
                    rst = (rst < s? s:rst);
                    if (!mystack.empty()) {
                        id = mystack.top();
                    }
                }
                mystack.push(i);
            }
        }
        
        int left, right, h, s;
        if (!mystack.empty()) {
            right = mystack.top();
        }
        while (!mystack.empty()) {
            h = height[mystack.top()];
            mystack.pop();
            if (!mystack.empty()) { // 不能漏掉这句
                left = mystack.top();
            } else {
                left = -1;
            }
            s = h * (right - left);
            rst = (rst < s? s:rst);
        }
        
        return rst;
    }
};
```

修改过后的代码，看起来简洁一些了：

```cpp
class Solution {
public:
    /**
     * @param height: A list of integer
     * @return: The area of largest rectangle in the histogram
     */
    int largestRectangleArea(vector<int> &height) {
        if (height.empty()) {
            return 0;
        }
        
        int rst = height[0];
        stack<int> mystack;
        mystack.push(0);
        for (int i = 1; i < height.size(); ++i) {
            if (height[i] <= height[mystack.top()]) {
                int left, right = i, s = 0;
                while (!mystack.empty() && height[mystack.top()] >= height[i]) {
                    int id = mystack.top(); mystack.pop();
                    left = (mystack.empty()? -1:mystack.top()); // important
                    s = height[id] * (right - left - 1);
                    rst = max(rst, s);
                }
            }
            mystack.push(i);
        }
        
        int left, right = mystack.top(), h, s;
        while (!mystack.empty()) {
            h = height[mystack.top()];
            mystack.pop();
            left = (mystack.empty()? -1:mystack.top()); // important
            s = h * (right - left);
            rst = max(rst, s);
        }
        
        return rst;
    }
};

```

一个让代码变得更简洁的方法是，在`height`数组最后添加一个辅助元素`0`(或者负数也行)，这样“思路”中的步骤3就可以合并到步骤2中去了，因为最后碰到该辅助元素时，由于栈中没有元素比它更小，原来所有的元素都将出栈。

更简洁的代码：

```cpp
class Solution {
public:
    /**
     * @param height: A list of integer
     * @return: The area of largest rectangle in the histogram
     */
    int largestRectangleArea(vector<int> &height) {
        if (height.empty()) {
            return 0;
        }
        
        height.push_back(0);    // add this line
        int rst = height[0];
        stack<int> mystack;
        mystack.push(0);
        for (int i = 1; i < height.size(); ++i) {
            if (height[i] <= height[mystack.top()]) {
                int left, right = i, s = 0;
                while (!mystack.empty() && height[mystack.top()] >= height[i]) {
                    int id = mystack.top(); mystack.pop();
                    left = (mystack.empty()? -1:mystack.top()); // important
                    s = height[id] * (right - left - 1);
                    rst = max(rst, s);
                }
            }
            mystack.push(i);
        }

        return rst;
    }
};

```

另外，如果知道这个问题的O(n)解法，这里的[最大矩形问题](http://www.lintcode.com/problem/maximal-rectangle/)就可以O(n^2)解决了。

## 相关链接
[1] Geeksforgeeks, http://www.geeksforgeeks.org/largest-rectangular-area-in-a-histogram-set-1/
[2] Geeksforgeeks, http://www.geeksforgeeks.org/largest-rectangle-under-histogram/
[3] 水中的鱼, Largest Rectangle in Histogram 解题报告, http://fisherlei.blogspot.com/2012/12/leetcode-largest-rectangle-in-histogram.html
