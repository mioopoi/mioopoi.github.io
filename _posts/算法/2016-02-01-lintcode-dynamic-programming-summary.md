---
layout: post
title: "LintCode部分动态规划问题题解"
description: ""
category: "算法"
tags: [动态规划]
summary:
---

作者: <a href="http://mioopoi.github.io/about.html",target="_blank">Takashi</a>

## LintCode 109: Triangle (数字三角形)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/triangle/", target="_blank">http://www.lintcode.com/zh-cn/problem/triangle/</a>

经典的动态规划问题。定义`f(i,j)`表示从`triangle(i,j)`到底部的最小路径和，则有状态转移方程：
`f(i,j) = triangle(i,j) + min(f(i+1,j), f(i+1,j+1))`

自底向上求解子问题的代码(C++)：

```c++
class Solution {
public:
    /**
     * @param triangle: a list of lists of integers.
     * @return: An integer, minimum path sum.
     */
    int minimumTotal(vector<vector<int> > &triangle) {
        if (triangle.empty()) {
            return 0;
        }
        int n = triangle.size();
        int m = triangle[n-1].size();
        int f[m];
        // Init
        for (int i = 0; i < m; ++i) {
            f[i] = triangle[n-1][i];
        }
        // DP
        for (int i = n - 2; i >= 0; --i) {
            for (int j = 0; j < triangle[i].size(); ++j) {
                f[j] = min(f[j], f[j+1]) + triangle[i][j];
            }
        }

        return f[0];
    }
};
```

上面的代码对空间复杂度做了优化，其实开一维数组就够用了，因为每一次更新都只依赖于上一次的结果（这似乎就是传说中的“**马尔科夫性质**”？），而且修改数组值的时候并不会影响接下来的递推。

自顶向下求解子问题的代码：



## LintCode 110: minimum path sum (最小路径和)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/minimum-path-sum/", target="_blank"> http://www.lintcode.com/zh-cn/problem/minimum-path-sum/ </a>

简单的DP。

```cpp
class Solution {
public:
    /**
     * @param grid: a list of lists of integers.
     * @return: An integer, minimizes the sum of all numbers along its path
     */
    int minPathSum(vector<vector<int> > &grid) {
        if (grid.empty()) {
            return 0;
        }
        int m = grid.size();
        int n = grid[0].size();
        int f[m][n];
        // Init
        f[0][0] = grid[0][0];
        for (int i = 1; i < n; ++i) {
            f[0][i] = f[0][i-1] + grid[0][i];
        }
        for (int j = 1; j < m; ++j) {
            f[j][0] = f[j-1][0] + grid[j][0];
        }
        // DP
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[i][j] = min(f[i-1][j], f[i][j-1]) + grid[i][j];
            }
        }

        return f[m-1][n-1];
    }
};
```

## LintCode 111: Climbing Stairs (爬楼梯)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/climbing-stairs/", target="_blank"> http://www.lintcode.com/zh-cn/problem/climbing-stairs/ </a>

很有趣的问题。设f(i)表示到第i级楼梯上的方法数，那么有: f(i) = f(i-1) + f(i-2)，意思是可以从(i-1)级跳一级，或者从第(i-2)级跳两级到达第i级。边界条件: f(0) = 1 (不跳也是一种方法), f(1) = 1。可见，这是一个**Fibonacci**数列~

```cpp
class Solution {
public:
    /**
     * @param n: An integer
     * @return: An integer
     */
    int climbStairs(int n) {
        int f[n];
        f[0] = 1;
        f[1] = 1;
        for (int i = 2; i <= n; ++i) {
            f[i] = f[i-1] + f[i-2];
        }
        return f[n];
    }
};
```

由于递推的记忆深度只有2，其实只要三个变量就可以完成递推了。所以可以将空间复杂度优化到O(1)。

```cpp
class Solution {
public:
    /**
     * @param n: An integer
     * @return: An integer
     */
    int climbStairs(int n) {
        int f, f1 = 1, f2 = 1;
        for (int i = 2; i <= n; ++i) {
            f = f1 + f2;
            f1 = f2;
            f2 = f;
        }
        if (n == 0) return f1;
        if (n == 1) return f2;
        return f;
    }
};
```

## LintCode 114: Unique Paths (不同的路径)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/unique-paths/", target="_blank"> http://www.lintcode.com/zh-cn/problem/unique-paths/ </a>

简单的DP。

```cpp
class Solution {
public:
    /**
     * @param n, m: positive integer (1 <= n ,m <= 100)
     * @return an integer
     */
    int uniquePaths(int m, int n) {
        int f[m+1][n+1];
        // Init
        for (int i = 1; i <= m; ++i) {
            f[i][1] = 1;
        }
        for (int j = 1; j <= n; ++j) {
            f[1][j] = 1;
        }
        // DP
        for (int i = 2; i <= m; ++i) {
            for (int j = 2; j <= n; ++j) {
                f[i][j] = f[i][j-1] + f[i-1][j];
            }
        }
        return f[m][n];
    }
};

```

## LintCode 115: Unique Paths II

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/unique-paths-ii/", target="_blank"> http://www.lintcode.com/zh-cn/problem/unique-paths-ii/ </a>

在上一题基础上加一些判断就好。

```cpp
class Solution {
public:
    /**
     * @param obstacleGrid: A list of lists of integers
     * @return: An integer
     */ 
    int uniquePathsWithObstacles(vector<vector<int> > &obstacleGrid) {
        int m = obstacleGrid.size(), n = obstacleGrid[0].size();
        int f[m][n];
        // Init
        if (obstacleGrid[0][0] == 0) {
            f[0][0] = 1;
        } else {
            return 0;
        }
        for (int i = 1; i < m; ++i) {
            if (obstacleGrid[i][0] == 0 && f[i-1][0] != 0) {
                f[i][0] = 1;
            } else {
                f[i][0] = 0;
            }
        }
        for (int j = 1; j < n; ++j) {
            if (obstacleGrid[0][j] == 0 && f[0][j-1] != 0) {
                f[0][j] = 1;
            } else {
                f[0][j] = 0;
            }
        }
        // DP
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                if (obstacleGrid[i][j] == 1) {
                    f[i][j] = 0;
                    continue;
                }
                f[i][j] = f[i-1][j] + f[i][j-1];
            }
        }
        return f[m-1][n-1];
    }
};
```

## LintCode 76: Longest Increasing Subsequence (最长上升子序列)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/longest-increasing-subsequence/", target="_blank"> http://www.lintcode.com/zh-cn/problem/longest-increasing-subsequence/ </a>

经典的动态规划问题。定义f(i)表示以nums(i)结尾的子序列的LIS长度，则有递归方程：
**f(i) = max{ f(j) } + 1, 对所有的 j < i 且 nums(j) <= nums(i)**
最终的结果是 **max{ f(i) }, 对所有的i**

时间复杂度：O(n^2)

```cpp
class Solution {
public:
    /**
     * @param nums: The integer array
     * @return: The length of LIS (longest increasing subsequence)
     */
    int longestIncreasingSubsequence(vector<int> nums) {
        if (nums.empty()) {
            return 0;
        }
        int f[nums.size()];
        int rst = 1;
        f[0] = 1;
        for (int i = 1; i < nums.size(); ++i) {
            int tmp = 0;
            for (int j = 0; j < i; ++j) {
                if (nums[j] <= nums[i] && f[j] > tmp) {
                    tmp = f[j];
                }
            }
            f[i] = tmp + 1;
            if (f[i] > rst) {
                rst = f[i];
            }
        }
        return rst;
    }
};
```

LIS问题有O(nlogn)算法，不过不会的话似乎问题也不大，因为确实不容易想，有点“非主流”。不过自己还是花了一天的时间去尝试了一下，无奈最后还是没想出来，只好看前人写的解法了==

O(nlogn)的解法其实已经不能算是DP了，倒是贪心更确切些。纯DP基本上不会出现带有‘logn’的复杂度的，要么是二分搜索，要么是二叉树做了优化。起初我的思路是对DP的第二层循环做优化，老想着维护一颗平衡二叉树，最后无果。。事实上后来看刘汝佳的课件也确实是对第二层循环做手脚，不过维护的并不是AVL树，而仅仅是一个有序数组==写出来的代码也非常简洁，不得不感慨算法的世界太奇妙~

值得一提的是，Geeksforgeeks上对O(nlogn)算法也有精彩的<a href="http://www.geeksforgeeks.org/longest-monotonically-increasing-subsequence-size-n-log-n/", target="_blank">解释</a>。虽然完全换了一种思路，但是实现的代码和DP基础上优化的代码异曲同工。

这里解释一下怎么对DP第二层循环做优化。idea就是用一个辅助数组`assist `，`assist[i]`里记录了长度为`i`的LIS的结尾的**最小值**，因为相同长度的两个递增子序列，当然选结尾最小的那个比较好，原因是它将来扩展成更长子序列的可能性更大。不难发现，有**assist[1] <= assist[2] <= ...**（注意`assist[0]`在这里没有意义）。用`vector`定义该数组更好。当考察原数组`nums`的一个新元素`nums[i]`时，看它是不是比当前`assist`的最大值还要大（或等于），如果是，说明LIS可以增加一个长度，将其push进`assist`；否则找到`assist`中**第一个比nums[i]大的元素**，并将其替换为`nums[i]`，因为我们发现了该相应长度下的一个更小的结尾。在整个操作过程中，`assist`数组始终保持单调增，最后其长度-1就是LIS的长度。

上面步骤中的“找第一个比nums[i]大的元素"可以用二分查找，这样就出现了'logn'。

举个例子，原数组nums=[1,6,2,5,3,7]。
在开始之前，先`assist.push_back(0x80000000)` (赋什么值都行，主要是一个对vector的填充，因为assist[0]不表示什么意义)。
(0) `assist.push_back(nums[0])`，这时assist[1] = nums[0]，表示长度为1的子序列以nums[0]结尾；**assist = {X, 1}**
(1) 考察nums[1]。它的值为6，不小于assist中的最大值，可以扩充LIS长度，于是`assist.push_back(nums[1])`，这时assist[2] = nums[1]，表示长度为2的子序列以nums[1]结尾；**assist = {X, 1, 6}**
(2) 考察nums[2]。它的值为2，小于assist的最大值，我们找到assist中第一个比2大的值，是assist[2]=6，意味着长度为2的子序列的结尾(6)可以被替换为一个更好的值(2)，于是我们进行替换:`assist[2] = nums[2]`; **assist = {X, 1, 2}**
(3) 考察nums[3]。它的值为5，不小于assist中的最大值，可以扩充LIS长度，于是`assist.push_back(nums[3])`，这时assist[3] = nums[3]，表示长度为3的子序列以nums[3]结尾；**assist = {X, 1, 2, 5}**
(4) 考察nums[4]。它的值为3，小于assist的最大值，我们找到assist中第一个比3大的值，是assist[3] = 5，意味着长度为3的子序列的结尾(5)可以被替换为一个更好的值(3)，于是`assist[3] = 3`;  **assist = {X, 1, 2, 3}**
(5) 考察nums[5]。它的值为7，按前面的方法，最终得到**assist = {X, 1, 2, 3, 7}**
结束。

这样，最终得到的最长子序列的长度是4，即`assist.size() - 1`，最长子序列是1, 2, 3, 7。事实上，这个assist数组也保留了子问题的一个解：1; 1,2; 1,2,3分别是长度为1,2,3的子序列。

理清了思路，代码就不难写了，虽然我写得比较长，但是复杂度很低~

```cpp
class Solution {
public:
    /**
     * @param nums: The integer array
     * @return: The length of LIS (longest increasing subsequence)
     */
    int longestIncreasingSubsequence(vector<int> nums) {
        if (nums.empty()) {
            return 0;
        }
        vector<int> assist;    // the LIS with length i ends with assist[i](which is the smallest)
        assist.push_back(0x80000000);    // assist[0] has no meaning
        assist.push_back(nums[0]);    // LIS 1 end with nums[0]
        for (int i = 1; i < nums.size(); ++i) {
            if (nums[i] >= assist[assist.size() - 1]) {
                assist.push_back(nums[i]);
            } else {
                int tmp = binarySearch(assist, nums[i], 1, assist.size() - 1);
                assist[tmp] = nums[i];
            }
        }    
        return assist.size() - 1;
    }
private:
    int binarySearch(vector<int>& assist, int target, int l, int r) {
        while (l + 1 < r) {
            int mid = l + (r - l) / 2;
            if (assist[mid] <= target) {
                l = mid;
            } else {
                r = mid;
            }
        }
        if (assist[l] > target) {
            return l;
        }
        if (assist[r] > target) {
            return r;
        }
    }
};
```

这里二分我自己手写的，当然STL有库函数`lower_bound`和`upper_bound`就是用二分实现的，不过既然是练习，二分还是应该多动手写写。

## LintCode 108: Palindrome Partitioning II (分割回文串II)

为了提高递推的效率，可以先进行预处理：开一个bool数组`isPalind`，`isPalind[i][j]`表示字符串i到j是否是回文串。判断一个字符串是否是回文串可以O(n)完成，计算这个数组也可以用DP的思想，`isPalind[i][j]`是回文串当且仅当`s[i] = s[j]`并且`isPalind[i+1][j-1] = true`。所以计算isPalind需要O(n^2)。

定义`f[i]`表示对前i个字符组成的子串进行回文分割所需要的最少次数。则有如下递推关系：
f[i] = 0, 当isPalind[0][i] = true
f[i] = min { f[j] + 1, j < i 且 isPalind[j+1][i] = true }
最终的结果是f[n-1] (n为原串长度)

```cpp
class Solution {
public:
    /**
     * @param s a string
     * @return an integer
     */
    int minCut(string s) {
        int n = s.size();
        bool isPalind[n][n];  // store if is a palindrome string
        int f[n];  // store the minimum cuts
        // ----------pre-calculation--------------
        // for len = 1 & 2;
        for (int i = 0; i < n; ++i) {
            isPalind[i][i] = true;
            if (i + 1 < n) {
                isPalind[i][i+1] = (s[i] == s[i+1]);
            }
        }
        // for len > 2
        for (int len = 3; len <= n; ++len) {
            for (int st = 0; st <= n - len; ++st) {
                int ed = st + len - 1;
                isPalind[st][ed] = (s[st] == s[ed] && isPalind[st+1][ed-1]);
            }
        }
        // ------------Dynamic Programming-------------
        f[0] = 0;
        for (int i = 1; i < n; ++i) {
            if (isPalind[0][i]) {
                f[i] = 0;
                continue;
            }
            f[i] = i;
            for (int j = 0; j < i; ++j) {
                if (isPalind[j+1][i]) {
                    f[i] = min(f[i], f[j] + 1);
                }
            }
        }
        return f[n-1];
    }
};
```

## Lintcode 107: Word Break (单词切分)

思路：
用`f[i]`表示前i个字符串能否被成功切分。则有：
f[i] = OR{ f[j]==true, j < i 并且 string的第j+1到最后能被成功切分 } OR的意思是只要有一个成立，f[i]就为true了

这题WA了无数次。而且最后总是被卡TLE==下面这段代码，lintcode TLE, leetcode却轻松过(甚至超过58%的cpp提交)。leetcode上的计时基本没有什么参考价值~

```cpp
class Solution {
public:
    /**
     * @param s: A string s
     * @param dict: A dictionary of words dict
     */
    bool wordBreak(string s, unordered_set<string> &dict) {
        if (s.empty()) {
            return true;
        }

        int n = s.size();
        bool f[n + 1];

        f[0] = true;
        for (int i = 1; i <= n; ++i) {
            f[i] = false;
            for (int j = i - 1; j >= 0; --j) {
                if (!f[j]) {
                    continue;
                }
                string word = s.substr(j, i - j);
                if (dict.find(word) != dict.end()) {
                    f[i] = true;
                    break;
                }
            }
        }

        return f[n];
    }
};
```

学习了<a href="http://www.jiuzhang.com/solutions/word-break/", target="_blank">这里</a>，到底还是九章的代码写得靠谱。一直TLE的重要原因是忽略了很重要的一点，即：**单词的长度是有限的**！这样在DP第二层枚举的时候，从后往前，只要枚举到最大单词长度就行了。之前一直在小细节上尝试优化，都没有切中要点，这才是主要矛盾啊！这样就把复杂度降了一个数量级，从O(N^2)降到O(N*k)，其中N是原字符串的长度，k是最长单词的长度，k可以预先求好。你见过长度超过50的英文单词吗。。所以，复杂度基本就是O(N)了啊啊！我怎么就想不到呢== 事后在leetcode上还装个逼贴了个post: <a href="https://leetcode.com/discuss/84205/actually-consider-length-would-obtain-large-optimization", target="_blank">Actually, if we consider the max length of a word, we would obtain a large optimization </a>

收获的经验，**要多观察，多思考，不能一味地追求代码短小，哪怕长一些，逻辑清晰，复杂度低才是王道！**代码如下：

```cpp
class Solution {
public:
    /**
     * @param s: A string s
     * @param dict: A dictionary of words dict
     */
    bool wordBreak(string s, unordered_set<string> &dict) {
        if (s.empty()) {
            return true;
        }
        
        int maxLen = getMaxlen(dict);
        int n = s.size();
        bool f[n + 1];
        
        f[0] = true;
        for (int i = 1; i <= n; ++i) {
            f[i] = false;
            for (int j = i - 1; j >= max(0, i - maxLen); --j) {
                if (!f[j]) {
                    continue;
                }
                string word = s.substr(j, i - j);
                if (dict.find(word) != dict.end()) {
                    f[i] = true;
                    break;
                }
            }
        }
        
        return f[n];
    }

private:
    int getMaxlen(unordered_set<string> &dict) {
        int maxLen = 0;
        for (unordered_set<string>::iterator it = dict.begin(); it != dict.end(); ++it) {
            string word = *it;
            maxLen = max(maxLen, (int)word.length());
        }
        return maxLen;
    }
};
```

