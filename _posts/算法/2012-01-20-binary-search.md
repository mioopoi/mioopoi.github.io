---
layout: post
title: "二分搜索"
description: ""
category: "算法"
tags: [分治,Divide & Conquer]
summary:
---

经典的二分搜索的使用前提是数组已排好序。思想很简单：利用数组已排好序这个性质，每次将搜索范围缩小一半。设排序数组为`A`，要查找的目标是`target`，基本思路如下：
1. 用数组中间的元素`A[mid]`与`target`比较
2. 如果`A[mid]`与`target`相等，则找到，返回下标即可；
3. 如果`A[mid] < target`，则`target`只可能落在`mid`之后的部分；否则只可能落在`mid`之前的部分。可以递归地查找。

## 递归实现

```cpp
int binarySearch(vector<int>& A, int target, int left, int right) {
    if (left > right) {
        return -1;
    }

    int mid = left + (right - left) / 2;
    if (A[mid] == target) {
        return mid;
    } else if (A[mid] < target) {
        return binarySearch(A, target, mid+1, right);
    } else {
        return binarySearch(A, target, left, mid-1);
    }
}
```

## 循环实现

比起递归，循环实现虽然不太容易，但是有其必要性和好处，比如不会有堆栈溢出的问题，而且通常比递归效率高。C++代码：

```cpp
int binarySearch(vector<int>& A, int target) {
    if (A.empty()) {
        return -1;
    }
    int left = 0, right = A.size()-1, mid;
    while (left + 1 < right) {
        mid = left + (right - left) / 2;
        if (A[mid] == target) {
            return mid;
        } else if (A[mid] < target) {
            left = mid;
        } else {
            right = mid;
        }
    }
    if (A[left] == target) {
        return left;
    }
    if (A[right] == target) {
        return right;
    }
    return -1;
}
```

上面的代码有很好的通用性，可以用作二分搜索的模板。至于循环判断条件为什么用`left + 1 < right`而不用其他的表达式，以及为什么在循环结束后还要加上两个if语句，请仔细思考这些做法的好处。上面的代码稍作修改就可以处理一类二分搜索问题，比如求第一次（或最后一次）出现的`target`下标、`target`出现的次数，等等。
