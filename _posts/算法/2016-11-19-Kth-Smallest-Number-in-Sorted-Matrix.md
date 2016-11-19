---
layout: post
title: "Kth Smallest Number in Sorted Matrix"
description: ""
category: "算法"
tags: [heap]
summary:
---

作者: [小华](http://ihuafan.com/about)

一个行和列都有序的矩阵，找出其中第k小的元素。
问题链接: http://www.lintcode.com/en/problem/kth-smallest-number-in-sorted-matrix/

## Brute Force
最暴力的方式是把矩阵里所有元素存到一个数组里，然后对数组排序后输出第k个元素。复杂度`O(N + Nlog(N)) `(其中N是矩阵所有元素个数)。C++代码:

```c++
class Solution {
public:
    /**
     * @param matrix: a matrix of integers
     * @param k: an integer
     * @return: the kth smallest number in the matrix
     */
    int kthSmallest(vector<vector<int> > &matrix, int k) {
        int n = matrix.size(), m = matrix[0].size();
        vector<int> myvec(n*m);
        
        int num = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                myvec[num++] = matrix[i][j];
            }
        }
        sort(myvec.begin(), myvec.end());
        return myvec[k-1];
    }
};
```

在LintCode/LeetCode上，这个非常暴力的算法能够得到`Accepted`。

## Merge Sorted Arrays
显然，上面的算法不是一个优秀的算法，因为它不但复杂度高，而且完全没有用到矩阵有序这一条件。如果继续按上面的思路，利用矩阵每一行和每一列都是有序的条件，可以采用**合并排序数组**的方式，这样就可以省去最后的排序操作。

我们知道[合并两个排序数组](http://www.lintcode.com/en/problem/merge-two-sorted-arrays/)可以用归并排序里的归并操作，时间复杂度是`O(两个数组的长度之和)`。如果是n个排序数组呢？当然可以依次合并：先将第1个数组和第2个数组合并，再将合并后的数组与第3个数组合并，以此类推，直到合并完所有数组。分析一下这么做的复杂度（设一共有n个待合并的排序数组，每个数组的长度均为m，其实长度不等也没关系，这里假设它们长度相等是为了便于分析）：

- 第1轮，合并数组1和数组2，得到长度为`2*m`的新数组x，时间复杂度`O(m+m) = O(2*m)`
- 第2轮，合并数组x和数组3，得到长度为`3*m`的新数组x，时间复杂度`O(2m+m) = O(3*m)`
- ...
- 第n-1轮，合并数组x和数组n，得到长度为`n*m`的新数组x，时间复杂度`O(n*m)`

所以总复杂度是`O(2*m) + O(3*m) + ... + O(n*m) = O(n*n*m)`。不能说它就一定比上一个方法好。可见单纯地依次合并不是好的做法，所以选择合并的方式是很重要的。其实可以在每一轮两两合并，仔细思考就会发现这样的合并方式是二叉树形的——第1轮合并n/2次，第2轮合并n/4次，...，每一轮合并的次数是上一轮的一半，不难分析其复杂度是`O(log(n)*n*m)`。C++代码：

```c++
class Solution {
public:
    /**
     * @param matrix: a matrix of integers
     * @param k: an integer
     * @return: the kth smallest number in the matrix
     */
    int kthSmallest(vector<vector<int> > &matrix, int k) {
        int n = matrix.size(), m = matrix[0].size();
        
        int num = n / 2;
        if (n > 1 && n % 2 != 0) matrix[n-2] = mergeSortedArray(matrix[n-2], matrix[n-1]);
        while (num > 0) {
            for (int i = 0; i < num; ++i) {
                matrix[i] = mergeSortedArray(matrix[2*i], matrix[2*i+1]);
            }
            if (num > 1 && num % 2 != 0) matrix[num-2] = mergeSortedArray(matrix[num-2], matrix[num-1]);
            num /= 2;
        }
        return matrix[0][k-1];
    }
    
    /**
     * @param A and B: sorted integer array A and B.
     * @return: A new sorted integer array
     */
    vector<int> mergeSortedArray(vector<int> &A, vector<int> &B) {
        if (A.empty()) return B;
        if (B.empty()) return A;
        
        int n = A.size(), m = B.size();
        vector<int> mergeArr(n + m);
        
        int p = 0, q = 0, k = 0;
        while (p != n && q != m) {
            if (A[p] < B[q]) mergeArr[k++] = A[p++];
            else mergeArr[k++] = B[q++];
        }
        while (p != n) mergeArr[k++] = A[p++];
        while (q != m) mergeArr[k++] = B[q++];
        return mergeArr;
    }
};
```

上面的代码在LintCode和LeetCode上都通过了测试。其中函数`mergeSortedArray`是合并两个排序数组的接口。由于在每一轮中，需要两两合并的数组并不总是偶数对的，所以应该将最后「落单」的那个数组考虑进去，在上面的代码中，处理方法就是将最后落单的数组与它前一个数组合并（两个`if`语句）。

## Min Heap
考虑这样一种情形：矩阵很大，而k很小（比如，k就等于1）。这时将所有的数组合并就显得代价太大了。我们能不能实现这样的操作：第1次找到最小的元素，第2次找到第二小的元素，...，第k次找到第k小的元素？以下面的矩阵为例，我们看看要实现这个想法需要哪些条件。
```
  1, 2, 4, 7
  3, 5, 6, 9
  5, 8, 7, 12
```
这个矩阵满足题目条件，即每一行、每一列都是有序的。显然，最小的元素位于矩阵的左上角，即(0,0)处，而第2小的元素则一定是最小元素的下边和右边即(0,1)和(1,0)的其中一个，在本例中，是位于(0,1)处的2。对于第3小的元素，就需要看2下边和右边的元素，以及之前未被选中的位于(1,0)处的3。我们发现2下边的元素没有必要考虑，因为它在3的右边，所以只需要考虑2右边的4，如此进行下去，直到找到第k小的。

通过上面的简单例子可见，我们的想法可以实现，但是需要维护一些信息。每挑出一个第i小的元素后，就会有一些新的待考察元素出现（第i小元素的下边和右边），在选择第(i+1)小的元素时，还要同时考察之前出现的、且未被选中的元素，然后在这些待考察元素中选最小的。有一种数据结构可以帮助我们更好地组织这种操作——**最小堆**(min heap)。

注意第i小元素的下边或右边的元素可能无需考察（它比那些前几轮滞留下的元素大），为了避免重复和不必要的比较，可以选定一个方向，比如统一按横向或者纵向扩展。这里我们选择横向。在初始化时，将第一列的所有元素加入最小堆（如果按纵向，就将第一行的所有元素入堆）。然后我们执行下面的操作k次：

- 取堆顶元素，将其位置右侧的元素插入最小堆
- 将堆顶元素出堆

第i次出堆的元素就是第i小的元素。在具体实现时，由于还要插入和堆顶节点相邻的元素，所以堆节点还要记录元素的位置。

我们可以用**优先队列**(priority queue)来维护最小堆。这里为了更好地展示代码思路，采用C++ STL中的[priority_queue](http://www.cplusplus.com/reference/queue/priority_queue/)：

```c++
// 堆节点定义
struct HeapNode {
    int val;    // 元素值
    int row;    // 行标号
    int col;    // 列标号
};

// 重载元素比较规则
struct cmp {
    bool operator()(HeapNode a, HeapNode b) {
        return a.val > b.val;
    }
};

class Solution {
public:
    /**
     * @param matrix: a matrix of integers
     * @param k: an integer
     * @return: the kth smallest number in the matrix
     */
    int kthSmallest(vector<vector<int> > &matrix, int k) {
        int nRow = matrix.size(), nCol = matrix[0].size();
        
        // 创建一个min heap, 初始化为矩阵的第一列
        priority_queue<HeapNode, vector<HeapNode>, cmp> q;
        for (int i = 0; i < nRow; ++i) {
            HeapNode node = {matrix[i][0], i, 0};
            q.push(node);
        }
        
        // 取堆顶元素，将其右侧元素插入min heap，之后出堆，做k次
        HeapNode popNode;
        for (int i = 0; i < k; ++i) {
            popNode = q.top(); q.pop();
            if (popNode.col < nCol - 1) {
                HeapNode newNode = {matrix[popNode.row][popNode.col + 1], popNode.row, popNode.col + 1};
                q.push(newNode);
            }
        }
        return popNode.val;
    }
};
```

上面算法的时间复杂度：设矩阵有n行m列。
- 堆的初始化：`O(n)`
- 取堆顶是`O(1)`，在k次操作中，每一次至少出堆一个节点，所以每次插入操作的最坏时间复杂度不会超过`O(log(n))`，于是k次操作的复杂度不会超过`O(k log(n))`
- 所以总的时间复杂度是`O(n + k log(n))`

当然，对于堆结构和其各种操作，还是建议学习并能够自己实现。

## References
[1] Merge K Sorted Arrays, http://algorithms.tutorialhorizon.com/merge-k-sorted-arrays/