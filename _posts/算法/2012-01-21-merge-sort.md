---
layout: post
title: "归并排序"
description: ""
category: "算法"
tags: [分治,Divide & Conquer]
summary:
---

**基本思想：**
 - divide & conquer
 - 把数组一分为二，分为长度大致相等的左、右两个子数组
 - 分别对左、右子数组进行排序
 - 左右子数组有序后，合并它们
 - 处理左、右子数组时，递归地进行

归并排序的递归方程:
$$T(n) = 2 T\left(\frac{n}{2}\right) + O(n)$$
$T(n)$表示对整个数组进行排序的时间，$2T\left(\frac{n}{2}\right)$表示对两个子数组进行排序的时间，而$O(n)$表示合并两个子数组的时间复杂度。求解这个递归方程，得到$T(n) = O(n\log{n})$。

关于时间复杂度，也可以这么简单地理解：划分原问题为更小规模子问题的复杂度是$O(\log{n})$（其实是个递归树，而且这里是二叉树），合并已排好序的数组的复杂度是$O(n)$，因而是$O(n\log{n})$。

参考程序(C++):

```c++
#include <iostream>
#include <cstdio>

using namespace std;

// helper()函数功能：合并两个排序数组。复杂度：O(n)
void helper(int arr[], int low, int mid, int high)
{
    int p = 0, q = 0;
    int n1 = mid - low + 1;
    int n2 = high - mid;
    int k = low;    // 注意这里k的赋值，不能是"k=0"哈

    int L[n1], R[n2];

    // 对数组元素进行复制，因而是导致大规模排序时归并排序比快速排序慢的主要原因
    for (int i = 0; i < n1; ++i) {
        L[i] = arr[low+i];
    }
    for (int i = 0; i < n2; ++i) {
        R[i] = arr[mid+i+1];
    }

    while(p < n1 && q < n2) {
        if (L[p] < R[q]) {
            arr[k++] = L[p];
            ++p;
        } else {
            arr[k++] = R[q];
            ++q;
        }
    }
    if (p < n1) {
        while (p < n1) {
            arr[k++] = L[p];
            ++p;
        }
    } else {
        while (q < n2) {
            arr[k++] = R[q];
            ++q;
        }
    }
}

void mergeSort(int a[], int low, int high)
{
    if (low < high) {
        int mid = low + (high - low) / 2;    // divide the array to two parts
        mergeSort(a, low, mid);       // recursion: sort the left sub-array
        mergeSort(a, mid+1, high);    // recursion: sort the right sub-array
        helper(a, low, mid, high);    // merge the left sub-array and the right sub-array
    }
}
// 测试
int main()
{
    int a[] = {9, 4, 2, 7, 12, 8, 1, 0, 3, 5, 0, 0, 0, -1, 0};
    int n = sizeof(a)/sizeof(a[0]);

    printf("Before sorting:\n");
    for(int i = 0; i < n; ++i) {
        printf("%d ", a[i]);
    }
    printf("\n");

    mergeSort(a, 0, n-1);

    printf("After sorting:\n");
    for(int i = 0; i < n; ++i) {
        printf("%d ", a[i]);
    }
    printf("\n");
    return 0;
}
```
