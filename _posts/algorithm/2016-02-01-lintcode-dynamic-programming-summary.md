---
layout: post
title: "LintCode部分动态规划问题题解"
description: ""
category: "算法"
tags: [动态规划]
summary:
---

作者: [Takashi](http://mioopoi.github.io/about.html)

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

这题感觉挺难的，WA了无数次，而且最后总是被卡TLE== 下面这段代码，lintcode TLE, leetcode却轻松过(甚至超过58%的cpp提交)。leetcode上的计时基本没有什么参考价值~

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

## LintCode 116: Jump Game (跳跃游戏)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/jump-game/", target="_blank">http://www.lintcode.com/zh-cn/problem/jump-game/ </a>

思路1：动态规划，复杂度是O(n^2)
定义`f[i]`表示从数组下标为i的位置能否到达数组的最后一个位置，从后往前推，转移方程：
**f[i] = OR{ f[i+1], ... f[i+A[i]] }**
边界: f[n-1] = true (最后一个肯定不用跳就能到了)
整个问题的解就是f[0]

```cpp
class Solution {
public:
    /**
     * @param A: A list of integers
     * @return: The boolean answer
     */
    bool canJump(vector<int> A) {
        if (A.empty()) {
            return false;
        }
        if (A.size() == 1) {
            return true;
        }
        if (A[0] == 0) {
            return false;
        }
        
        int n = A.size();
        bool f[n];
        f[n-1] = true;
        for (int i = n - 2; i >= 0; --i) {
            f[i] = false;
            int steps = A[i];
            for (int j = i + 1; j < n && j <= i + steps ; ++j) {
                if (f[j]) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[0];
    }
};
```

思路2：贪心，复杂度是O(n)。该问题LeetCode上如果用DP会TLE, 所以贪心是最好的方法。用一个变量`maxPos`记录目前能够到达的最远位置，然后从第一个位置开始遍历，如果该位置没有超过`maxPos`，说明它是可以到达的，然后判断从该位置是否能跳到最后一个位置。

```cpp
class Solution {
public:
    /**
     * @param A: A list of integers
     * @return: The boolean answer
     */
    bool canJump(vector<int> A) {
        if (A.empty()) {
            return false;
        }
        if (A.size() == 1) {
            return true;
        }
        if (A[0] == 0) {
            return false;
        }
        
        int maxPos = 0;
        for (int i = 0; i < A.size() - 1; ++i) {
            if (i <= maxPos) {
                maxPos = max(maxPos, i + A[i]);
                if (maxPos >= A.size() - 1) {
                    return true;
                }
            }
        }
        return false;
    }
};
```

## LintCode 117: Jump Game II (跳跃游戏II)

题目链接: <a href="http://www.lintcode.com/zh-cn/problem/jump-game-ii/", target="_blank">http://www.lintcode.com/zh-cn/problem/jump-game-ii/ </a>

这题用DP做的话，O(n^2), lintcode和leetcode都TLE。还是贪心法最好，O(n)就能解。过了一个多月再做这题，又不会了。后来用贪心写出来之后，看之前的AC代码，是用递归写的（但是这次是用循环写），两种写法的思想其实一样。

思路:
1. 用一个变量`maxPos`记录当前能到达的最远位置，用一个数组`steps[A.size()]`记录从初始点(`0`)到该点(`i`)所需要的最少跳数；初始化为: `maxPos = 0`, `steps[0] = 0` (当然，可以steps[1...n] = inf)
2. 往前走的过程中(扫一遍数组)，如果从该点`i`能一次跳到比`maxPos`更远的点，就将下标`maxPos`到`i+A[i]`这一段的steps置为**stpes[i] + 1**。注意在遍历过程中，steps[i]只会被更新一次
3. 如果发现`i+A[i] >= A.size()-1`了，就直接返回`steps[i] + 1`即可

```cpp
class Solution {
    /**
     * @param A: A list of lists of integers
     * @return: An integer
     */
    public:
    int jump(vector<int> A) {
        if (A.empty() || A.size() == 1) {
            return 0;
        }

        int maxPos = 0;
        int steps[A.size()];
        steps[0] = 0;
        for (int i = 0; i < A.size(); ++i) {
            if (i + A[i] > maxPos) {
                if (i + A[i] >= A.size() - 1) {
                    return steps[i] + 1;
                }
                for (int j = maxPos + 1; j <= i + A[i]; ++j) {
                    steps[j] = steps[i] + 1;
                }
                maxPos = i + A[i];
            }
        }
        return -1;
    }
};
```

虽然有两层for循环，但是平摊复杂度其实是O(n)。
注意: 上面的代码并不能处理无法到达最后一个点的情况，比如`[2,1,1,0,3]`

---

## LintCode 29: InterLeaving String (交叉字符串)

题目链接: [http://www.lintcode.com/zh-cn/problem/interleaving-string/](http://www.lintcode.com/zh-cn/problem/interleaving-string/)

这题如果不是事先知道要用DP做，还挺不容易想的。s3字符串的顺序是不能打乱的，即s1和s2都是s3的子序列，所以使得DP的实现变成了可能。思路：设**f(i, j)**表示**s3的前(i+j)个字符所构成的子串**能否由字符串**s1的前i个字符所构成的子串**和字符串**s2的前j个字符所构成的子串**交叉构成。则递推式为:
**f(i, j) = true 当且仅当{ f(i-1, j)==true && s1[i-1] == s3[i+j-1] }, OR { f(i, j-1)==true && s2[j-1] == s3[i+j-1] }**

```cpp
class Solution {
public:
    /**
     * Determine whether s3 is formed by interleaving of s1 and s2.
     * @param s1, s2, s3: As description.
     * @return: true of false.
     */
    bool isInterleave(string s1, string s2, string s3) {
        if (s1.empty() && s2.empty()) {
            if (s3.empty()) {
                return true;
            }
            return false;
        }
        if (s3.empty()) {
            return false;
        }
        
        if (s1.size() + s2.size() != s3.size()) {
            return false;
        }

        int m = s1.size(), n = s2.size();
        bool f[m+1][n+1];
        // Init
        f[0][0] = true;
        for (int i = 1; i <= m; ++i) {
            if (f[i-1][0] && s1[i-1] == s3[i-1]) {
                f[i][0] = true;
            } else {
                f[i][0] = false;
            }
        }
        for (int i = 1; i <= n; ++i) {
            if (f[0][i-1] && s2[i-1] == s3[i-1]) {
                f[0][i] = true;
            } else {
                f[0][i] = false;
            }
        }
        // DP
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (f[i-1][j] && s1[i-1] == s3[i+j-1]) {
                    f[i][j] = true;
                    continue;
                }
                if (f[i][j-1] && s2[j-1] == s3[i+j-1]) {
                    f[i][j] = true;
                    continue;
                }
                f[i][j] = false;
            }
        }

        return f[m][n];
    }
};
```

算法的时间复杂度是O(n^2)，令我惊奇的是，把这份代码放到leetcode上去跑，居然0ms Accepted，还打败了82.29%的cpp提交，内牛满面。虽然leetcode上“击败了**%的提交”其实参考价值不大，但是印象中很少有超过70%的==

## LintCode 77: Longest Common Subsequence (最长公共子序列)

题目链接: [http://www.lintcode.com/zh-cn/problem/longest-common-subsequence/#](http://www.lintcode.com/zh-cn/problem/longest-common-subsequence/#)

经典的DP问题。定义f(i, j)表示**A的前i个字符构成的子串**和**B的前j个字符构成的子串**的LCS，则递推式为：

**f(i, j) = f(i-1, j-1), 当A[i-1] == B[i-1]**
否则，**f(i, j) = max(f(i, j-1), f(i-1, j))**

```cpp
class Solution {
public:
    /**
     * @param A, B: Two strings.
     * @return: The length of longest common subsequence of A and B.
     */
    int longestCommonSubsequence(string A, string B) {
        if (A.empty() && B.empty()) {
            return 0;
        }
        if (A.empty() || B.empty()) {
            return 0;
        }

        int m = A.size(), n = B.size();
        int f[m+1][n+1];
        // Init
        f[0][0] = 0;
        for (int i = 1; i <= m; ++i) {
            f[i][0] = 0;
        }
        for (int j = 1; j <= n; ++j) {
            f[0][j] = 0;
        }
        // DP
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (A[i-1] == B[j-1]) {
                    f[i][j] = f[i-1][j-1] + 1;
                } else {
                    f[i][j] = max(f[i][j-1], f[i-1][j]);
                }
            }
        }

        return f[m][n];
    }
};
```

## LintCode 79: Longest Common Substring (最长公共子串)

题目链接: [http://www.lintcode.com/zh-cn/problem/longest-common-substring/#](http://www.lintcode.com/zh-cn/problem/longest-common-substring/#)

经典DP问题。和最长公共子序列相似。注意“子串”必须是连续的一段，而“子序列”则不一定。定义f(i, j)表示**以A的第i个字符结尾和以B的第j个字符结尾的最长公共子串**，则递推式为：

**f(i, j) = f(i-1, j-1) + 1, 当A[i-1] == B[j-1]**
否则，**f(i, j) = 0**

```cpp
class Solution {
public:    
    /**
     * @param A, B: Two string.
     * @return: the length of the longest common substring.
     */
    int longestCommonSubstring(string &A, string &B) {
        if (A.empty() && B.empty()) {
            return 0;
        }
        if (A.empty() || B.empty()) {
            return 0;
        }

        int m = A.size(), n = B.size();
        int f[m+1][n+1];
        int rst = 0;
        // Init
        f[0][0] = 0;
        for (int i = 1; i <= m; ++i) {
            f[i][0] = 0;
        }
        for (int j = 1; j <= n; ++j) {
            f[0][j] = 0;
        }
        // DP
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (A[i-1] == B[j-1]) {
                    f[i][j] = f[i-1][j-1] + 1;
                    rst = f[i][j] > rst? f[i][j]:rst;
                } else {
                    f[i][j] = 0;
                }
            }
        }

        return rst;
    }
};
```

## LintCode 118: Distinct Subsequences (不同的子序列)

题目链接: [http://www.lintcode.com/zh-cn/problem/distinct-subsequences/](http://www.lintcode.com/zh-cn/problem/distinct-subsequences/)

第一次做想了不少时间。挺好的题。

定义f(i, j)表示**S的前i个字符构成的子串**的子序列中**T的前j个字符构成的子串**出现的次数。则递推式为：

**f(i, j) = f(i-1, j), 当S[i-1] != T[j-1]**
否则，**f(i, j) = f(i-1, j) + f(i-1, j-1)**

当S[i-1] = T[j-1]的情况要仔细分析，不能想当然地认为是f(i, j) = f(i-1, j - 1)，因为可能在S中会出现重复的字符。比如S的子串(设为S')是 "rabb"，T的子串(设为T')是"rab"，这时如果把两个子串的'b'都给删掉了，最终得到的结果是1，而正确的结果是2。因为即使S'删掉最后一个字符，T'仍然有可能出现。所以要加上**f(i-1, j)**。

另外，要特别注意边界的处理。

```cpp
class Solution {
public:    
    /**
     * @param S, T: Two string.
     * @return: Count the number of distinct subsequences
     */
    int numDistinct(string &S, string &T) {
        if (S.empty() && T.empty()) {
            return 1;
        }
        if (S.empty()) {
            return 0;
        }
        if (T.empty()) {
            return 1;
        }
        
        int m = S.size(), n = T.size();
        if (m < n) {
            return 0;
        }

        int f[m+1][n+1];
        f[0][0] = 1;
        for (int i = 1; i <= m; ++i) {
            f[i][0] = 1;
        }
        for (int j = 1; j <= n; ++j) {
            f[0][j] = 0;
        }
        // DP
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (S[i-1] != T[j-1]) {
                    f[i][j] = f[i-1][j];
                } else {
                    f[i][j] = f[i-1][j] + f[i-1][j-1];
                }
            }
        }

        return f[m][n];
    }
};
```

## LintCode 119: Edit Distance (编辑距离)

题目链接: [http://www.lintcode.com/zh-cn/problem/edit-distance/](http://www.lintcode.com/zh-cn/problem/edit-distance/)

很有趣，不过也不太容易想的一个问题。也是看了提示才知道解法。定义f(i, j)表示**str1的前i个字符变成str2的前j个字符最少需要的操作次数**，则递推式为：

f1 = f(i, j-1) + 1    // 插入
f2 = f(i-1, j) + 1    // 删除
f3 = f(i-1, j-1) + 1, 当 str1[i-1] != str2[j-1] 否则，f3 = f(i-1, j-1)    // 替换
**f(i, j) = min( f1, f2, f3 )**

```cpp
class Solution {
public:    
    /**
     * @param word1 & word2: Two string.
     * @return: The minimum number of steps.
     */
    int minDistance(string word1, string word2) {
        if (word1.empty() && word2.empty()) {
            return 0;
        }
        if (word1.empty()) {
            return word2.size();
        }
        if (word2.empty()) {
            return word1.size();
        }

        int m = word1.size(), n = word2.size();
        int f[m+1][n+1];
        // Init
        f[0][0] = 0;
        for (int i = 1; i <= m; ++i) {
            f[i][0] = i;
        }
        for (int j = 1; j <= n; ++j) {
            f[0][j] = j;
        }
        // DP
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                int numInsert = f[i][j-1] + 1;
                int numDelete = f[i-1][j] + 1;
                int numReplace = (word1[i-1] == word2[j-1]? f[i-1][j-1]:f[i-1][j-1]+1);
                f[i][j] = min(min(numInsert, numDelete), numReplace);
            }
        }

        return f[m][n];
    }
};
```

## LintCode 91: Minimum Adjustment Cost (最小调整代价)

题目链接: [http://www.lintcode.com/zh-cn/problem/minimum-adjustment-cost/](http://www.lintcode.com/zh-cn/problem/minimum-adjustment-cost/)

很有挑战性的一道题。想了好久~ 不过想出算法后，代码写起来是很容易的，一次AC。一位学姐说过，不要去急于看题解，先自己慢慢想，一个小时想不出来想两个小时，哪怕是一天，也许第二天就有思路了，这个**从无到有**的过程非常重要。而且自己想出来解法也很开心不是？

思路，定义f(i, h)表示**前i个数调整好并且第i个数是h的最小代价**，那么f(i, h)能由哪些状态转移而来呢？由于调整好以后相邻两个数差的绝对值不会超过`target`，所以第(i-1)个数只可能在**(h-target) ~ (h+target)**范围内(由于都是正整数，且最大为100，所以最小值是**low = max(0, h-target)**，最大值是**high = min(100, h+target)**)，选f(i-1, low)~f(i-1, high)中最小的，然后加上`abs(h-A[i-1])`(第i个数本身的调整代价)就好。

复杂度是O(n h target), n是数组的规模(整数的个数)，h是整数的最大值，在本问题中由于h和target都不大于100，所以复杂度可以认为是O(k n)，k是常数

```cpp
class Solution {
public:
    /**
     * @param A: An integer array.
     * @param target: An integer.
     */
    int MinAdjustmentCost(vector<int> A, int target) {
        if (A.empty() || A.size() <= 1) {
            return 0;
        }

        int n = A.size(), maxh = 100;
        int f[n+1][maxh+1];
        // Init
        f[0][0] = 0;
        for (int i = 1; i <= n; ++i) {
            f[i][0] = 0;
        }
        for (int h = 1; h <= maxh; ++h) {
            f[0][h] = 0;
        }
        // DP
        for (int i = 1; i <= n; ++i) {
            for (int h = 1; h <= maxh; ++h) {
                int low = max(1, h - target);
                int high = min(maxh, h + target);
                int tmp = f[i-1][low];
                for (int j = low + 1; j <= high; ++j) {
                    if (f[i-1][j] < tmp) {
                        tmp = f[i-1][j];
                    }
                }
                f[i][h] = tmp + abs(h - A[i-1]);
            }
        }
        // Result
        int rst = 0x7fffffff;
        for (int h = 1; h <= maxh; ++h) {
            if (f[n][h] < rst) {
                rst = f[n][h];
            }
        }
        return rst;
    }
};
```

## LintCode 92: Backpack (背包问题)

题目链接: [http://www.lintcode.com/zh-cn/problem/backpack/](http://www.lintcode.com/zh-cn/problem/backpack/)

这题一次性通过率很低(20%)，必须要优化空间复杂度！时间复杂度O(n m)应该差不多了，但是空间复杂度可以优化到O(m)。因为DP的记忆深度只有2.

状态定义和转移方程同经典的背包问题：定义f(i, j)表示**前i个物品放入大小为j的空间里能够占用的最大体积**，则递推式为：

**f(i, j) = max( f(i-1, j), f(i-1, j-A[i-1]) + A[i-1] )**

递推的时候，对每个i，**从后往前**计算即可，这样就用一维数组就行了。详细可以阅读[背包问题九讲](http://love-oriented.com/pack/)

```cpp
class Solution {
public:
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @return: The maximum size
     */
    int backPack(int m, vector<int> A) {
        if (m == 0 || A.empty()) {
            return 0;
        }
        
        int n = A.size();
        // vector<vector<int> > f(n+1, vector<int>(m+1));
        int f[m+1];
        for (int j = 0; j <= m; ++j) {
            f[j] = 0;
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = m; j >= 1; --j) {
                if (j >= A[i-1]) {
                    f[j] = max(f[j-A[i-1]] + A[i-1], f[j]);
                }
            }
        }
        return f[m];
    }
};
```

## LintCode 125: Backpack II (背包问题II)

题目链接: [http://www.lintcode.com/zh-cn/problem/backpack-ii/](http://www.lintcode.com/zh-cn/problem/backpack-ii/)

不多说了，记得优化空间复杂度！

```cpp
class Solution {
public:
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @return: The maximum size
     */
    int backPackII(int m, vector<int> A, vector<int> V) {
        if (m == 0 || A.empty()) {
            return 0;
        }
        
        int n = A.size();
        int f[m+1];
        for (int j = 0; j <= m; ++j) {
            f[j] = 0;
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = m; j >= 1; --j) {
                if (j >= A[i-1]) {
                    f[j] = max(f[j-A[i-1]] + V[i-1], f[j]);
                }
            }
        }
        return f[m];
    }
};
```

## LintCode 89: k sum (k数和)

题目链接: [http://www.lintcode.com/zh-cn/problem/k-sum/#](http://www.lintcode.com/zh-cn/problem/k-sum/#)

这个问题比较困难。几乎想了一天。

思路：
定义f(s, i, j)表示**选出来的k个数中第s个数是数组A的第i个数，且和为j的方案个数**，则有递推式：

**f(s, i, j) = f(s-1, i-1, j-A[i-1]) + f(s-1, i-2, j-A[i-1]) + ... + f(s-1, s-1, j-A[i-1])**

因为第s个数不可能是A数组第s数之前的，所以只要加到f(s-1, s-1, j-A[i-1])即可。

递推的顺序是个难点。直接写的话，需要开三维数组，从转移方程可以看出，f(s, x, y)只与f(s-1, x, y)有关，所以空间开销可以优化为二维数组。但是大循环还是得三层。

```cpp
class Solution {
public:
    /**
     * @param A: an integer array.
     * @param k: a positive integer (k <= length(A))
     * @param target: a integer
     * @return an integer
     */
    int kSum(vector<int> A, int k, int target) {
        if (A.empty() || k == 0) {
            return 0;
        }

        int n = A.size();
        int f[n+1][target+1];
        // Init
        for (int i = 0; i <= n; ++i) {
            for (int j = 0; j <= target; ++j) {
                f[i][j] = 0;
            }
        }
        f[0][0] = 1;
        // DP
        for (int num = 1; num <= k; ++num) {
            for (int i = n; i >= 1; --i) {
                for (int j = target; j >= 1; --j) {
                    f[i][j] = 0;
                    if (j - A[i-1] >= 0) {
                        for (int m = num - 1; m <= i - 1; ++m) {
                            f[i][j] = f[i][j] + f[m][j-A[i-1]];
                        }
                    }
                }
            }
        }
        int rst = 0;
        for (int i = k; i <= n; ++i) {
            rst = rst + f[i][target];
        }
        return rst;
    }
};
```

第一次写四层for循环的DP...时间复杂度是O(k^2 * n * target)。虽然上面的代码过了，但是感觉这个算法的复杂度还是有点高了。

## LintCode 192: Wildcard Matching (通配符匹配)

题目链接: [http://www.lintcode.com/zh-cn/problem/wildcard-matching/#](http://www.lintcode.com/zh-cn/problem/wildcard-matching/#)

定义f(i, j)表示**字符串s的前i个字符和字符串p的前j个字符是否匹配**，则有以下几种情况:

1. 如果`s[i-1] == '*'`, 则f(i, j) = OR( f(i-1, j), f(i, j-1) )
2. 如果`p[j-1] == '*'`, 则f(i, j) = OR( f(i, j-1), f(i-1, j) )
3. 如果`s[i-1] == ?`或者`p[j-1] == ?`, 则f(i, j) = f(i-1, j-1)
4. 如果`s[i-1] == p[j-1]`, 则f(i, j) = f(i-1, j-1)

以上四种情形中只要有一个成立，就可以将f(i, j)置为`true`

```cpp
class Solution {
public:
    /**
     * @param s: A string 
     * @param p: A string includes "?" and "*"
     * @return: A boolean
     */
    bool isMatch(const char *s, const char *p) {
        if (s == NULL && p == NULL) {
            return true;
        }
        if (s == NULL || p == NULL) {
            return false;
        }

        int n = strlen(s), m = strlen(p);
        bool f[n+1][m+1];
        // Init
        f[0][0] = true;
        for (int i = 1; i <= n; ++i) {
            if (f[i-1][0] == true && s[i-1] == '*') {
                f[i][0] = true;
            } else {
                f[i][0] = false;
            }
        }
        for (int j = 1; j <= m; ++j) {
            if (f[0][j-1] == true && p[j-1] == '*') {
                f[0][j] = true;
            } else {
                f[0][j] = false;
            }
        }
        // DP
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
                f[i][j] = false;
                if (s[i-1] == '*' || p[j-1] == '*') {
                    f[i][j] = f[i][j-1] || f[i-1][j];
                }
                if (s[i-1] == '?' || p[j-1] == '?' || s[i-1] == p[j-1]) {
                    f[i][j] = (f[i][j] | f[i-1][j-1]);
                }
            }
        }
        return f[n][m];
    }
};
```

上面的算法时间复杂度是O(n m)，lintcode能轻松过，但是leetcode却超时，这意味着DP在leetcode是行不通了（据说本题是leetcode最难的题之一）。所以要想有更快的算法，就得跳出DP的思维模式，比如尝试贪心。

注意，wildcard matching这个问题可以理解为**字符串s中不含通配符，字符串p中含通配符**。（上面的动态规划方法可以处理两个字符串都含有通配符的情况）

参考这里: [http://www.cnblogs.com/yuzhangcmu/p/4116153.html](http://www.cnblogs.com/yuzhangcmu/p/4116153.html)
贪心算法的思路：
1. 用两个指针`posS`, `posP`分别指向两个字符串的开始位置；
2. 当`s[posS]`与`p[posP]`匹配时（相等或者一个为`?`），两个指针同时往前走一步；
3. 如果`posP`遇到了`*`，用两个变量`preS`,`preP`记录当前两个指针的位置，然后两个指针继续往前走，如果发生了不匹配，就折回记录的位置，然后`preS++`

算法的最坏时间复杂度似乎是O(n^2)，比如，考虑以下输入：
>s = "xyaaaa...aaab" (中间有5000个'a')
p = "xy\*aaaa...aaaaa" (有5001个'a')

s和p不能完全匹配，但是会用掉大量的时间来判断。

```cpp
class Solution {
public:
    /**
     * @param s: A string
     * @param p: A string includes "?" and "*"
     * @return: A boolean
     */
    bool isMatch(const char *s, const char *p) {
        if (s == NULL && p == NULL) {
            return true;
        }
        if (s == NULL || p == NULL) {
            return false;
        }

        int lenS = strlen(s);
        int lenP = strlen(p);

        int posS = 0;
        int posP = 0;

        int preS = 0;
        int preP = 0;

        bool back = false;

        while (posS < lenS) {
            if (posP < lenP && isMatchChar(s[posS], p[posP])) {
                posP++;
                posS++;
            } else if (posP < lenP && p[posP] == '*') {
                while (posP < lenP && p[posP] == '*') {
                    posP++;
                }

                if (posP == lenP) {    // 最后一个字符是*, 可以完全匹配
                    return true;
                }

                preS = posS;
                preP = posP;
                back = true;
            } else if (back) {
                posS = ++preS;
                posP = preP;
            } else {
                return false;
            }
        }

        while (posP < lenP && p[posP] == '*') {
            posP++;
        }
        return (posP == lenP);
    }

private:
    bool isMatchChar(char a, char b) {
        return (a == b || b == '?');
    }
};
```

这题据说是leetcode上最难的题之一。