---
layout: post
title: "HackerRank Implementation"
description: ""
category: "算法"
tags: [hackerrank]
summary:
---

空闲时候做了hackerrank上的`implementation`章节，主要是一些有趣难度又不算大的实现题，调节调节心情。

## Non-Divisible Subset

https://www.hackerrank.com/challenges/non-divisible-subset

需要一点数论的知识。idea是：要使子集中任意两个数之和不能被k整除，等价于**任意两个数被k除的余数之和**不能被k整除。而所有余数的可能是比较少的，即0, 1, ..., k-1。用一个Hash统计每个余数出现的次数。

如果k=1，那么集合内所有数都能被k整除，子集最多只能有一个数；

然后用贪心的方法选择i和(k-i)出现次数较多的，需要提醒的是，对`0`和 `k/2`这两个余数要特殊处理，对`k/2`还要做奇偶判断。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <map>
using namespace std;

class Solution {
public:
    int n, k;
    vector<int> a;
    vector<int> cnt;

    void load() { 
        cin >> n >> k;
        a = vector<int>(n);
        cnt = vector<int>(100, 0);
        for (int i = 0; i < n; ++i) { 
            scanf("%d", &a[i]);
            a[i] %= k;
            cnt[a[i]]++; 
        }
    }

    int solve() { 
        int rst = 0;
        if (k == 1) { 
            return 1; 
        }
        if (cnt[0] > 0) rst++;
        for (int i = 1; i < k / 2; ++i) { 
            rst += max(cnt[i], cnt[k-i]); 
        }
        if (k % 2 == 0) rst += (cnt[k/2]? 1:0); 
        else rst += max(cnt[k/2], cnt[k/2+1]);
        return rst; 
    }
};


int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    Solution NonDivisibleSubset;
    NonDivisibleSubset.load();
    cout << NonDivisibleSubset.solve() << endl;
    return 0;
}
```

## Jumping on the Clouds

https://www.hackerrank.com/challenges/jumping-on-the-clouds

贪心。

```cpp
int main(){
    int n;
    cin >> n;
    vector<int> c(n);
    for(int c_i = 0;c_i < n;c_i++){
       cin >> c[c_i];
    }
    
    int pos = 0;
    int cnt = 0;
    while (pos < n - 1) {
        if (pos + 1 == n - 1) {
            pos += 1;
        } else if (c[pos+2] == 0) {
            pos += 2;
        } else {
            pos += 1;
        }
        cnt++;
    }
    
    cout << cnt << endl;
    
    return 0;
}
```

## Bigger is Greater

https://www.hackerrank.com/challenges/bigger-is-greater

字符串处理。要求输出下一个比给定字符串大的串，字母不能改变，并且是字母序最小的那个。

O(n)就可以做。思路：

1. 从字符串最后一位开始往前扫描，找到第一个不按字母序排列的字符，即不满足`w[i]<=w[i-1]`的
2. 再从后往前扫描一遍，找到第一个比1找到的字符小的字符，交换两个位置
3. 再将步骤1中位置之后的部分翻转

自己举几个例子就能发现做法了。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

int isNoSol(string &w) {
    for (int i = w.size()-1; i >= 1; --i) {
        if (w[i] > w[i-1]) {
            return (i-1);
        }
    }
    return -1;
}

string nextString(string w) {
    if (w.size() <= 1) {
        return "";
    }
    
    int pos = isNoSol(w);
    if (pos == -1) {
        return "";
    }
    
    for (int i = w.size()-1; i > pos; --i) {
        if (w[i] > w[pos]) {
            swap(w[pos], w[i]);
            break;
        }
    }
    reverse(w.begin()+pos+1, w.end());
    return w;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int t;
    string w, s;
    
    cin >> t;
    for (int i = 1; i <= t; ++i) {
        cin >> w;
        s = nextString(w);
        if (s.size() != 0) {
            cout << s << endl;
        } else {
            cout << "no answer" << endl;
        }
    }
    
    return 0;
}
```

做完之后看了论坛，发现自己的解法就是最好的！这里有相关资料：

https://www.nayuki.io/page/next-lexicographical-permutation-algorithm

我在论坛里的贴子：

> I'm happy that my solution is correct and efficient, before referring to any reference :) For C++ programmers, I suggest implementing the algorithm by yourself, instead of calling the `std:next_permutation`. Only through this can someone know how it works.

## Save the Prisoner!

https://www.hackerrank.com/challenges/save-the-prisoner

约瑟夫环问题。需要注意的是当余数为0时，应该输出`N`而不是0。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solveJosephus(int n, int m, int s) {
    return (s + m - 1) % n;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int T;
    int N, M, S;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        cin >> N >> M >> S;
        int ret = solveJosephus(N, M, S);
        if (ret == 0) {
            cout << N << endl;
        } else {
            cout << ret << endl;
        }
    }
    return 0;
}
```

## Jumping on the Clouds: Revisited

https://www.hackerrank.com/challenges/jumping-on-the-clouds-revisited

有个坑就是起点可能是雷电云，这样回到起点时能量还要多减去一个2.

```cpp
int main(){
    int n;
    int k;
    cin >> n >> k;
    vector<int> c(n);
    for(int c_i = 0;c_i < n;c_i++){
       cin >> c[c_i];
    }
    
    int pos = 0;
    int E = 100;
    while (pos < n) {
        if (c[pos+k] == 1) {
            E -= 3;
        } else {
            E -= 1;
        }
        pos += k;
    }
    if (c[0] == 1) E -= 2;
    cout << E << endl;
    return 0;
}
```

## Lisa's Workbook

https://www.hackerrank.com/challenges/lisa-workbook

分别统计每一章里存在的*sepcial problem*数量，统计的方法是遍历每一页，看当前页的问题编号范围是否包含页码数。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

// 统计每一章的special problem数量
// k-每一页最多问题数, t-该章节的问题数, start和end分别是该章节的页码起点和终点
int cntSp(int k, int t, int start, int end) {
    int cnt = 0;
    int problemID = 0;
    for (int page = start; page < end; ++page) {
        if (problemID+1 <= page && problemID+k >= page)
            cnt++;
        problemID += k;
    }
    if (problemID+1 <= end && t >= end)
        cnt++;
    return cnt;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int n, k;
    cin >> n >> k;
    int t;
    int pageStart = 1, pageEnd;
    int ret = 0;
    for (int i = 1; i <= n; ++i) {
        cin >> t;
        pageEnd = pageStart + ceil((double)t/k) - 1;
        ret += cntSp(k, t, pageStart, pageEnd);
        pageStart = pageEnd + 1;
    }
    cout << ret << endl;
    return 0;
}
```

## New Year Chaos

https://www.hackerrank.com/challenges/new-year-chaos

有点难度。下面是我第一次通过的代码，用了递归，还有交换操作，居然没有超时。

```cpp
int n;

int solve(vector<int> &q, vector<int> &bribe) {
    int ret = 0;
    bool flag = true;
    for (int i = 1; i <= n-1; ++i) {
        if (q[i] > q[i+1]) {
            bribe[q[i]]++;
            if (bribe[q[i]] > 2) {
                return -1;
            }
            swap(q[i], q[i+1]);
            ret++;
            flag = false;
        }
    }
    if (flag) {
        return ret;
    }
    int tmp = solve(q, bribe);
    if (tmp == -1) return -1;
    else return ret + tmp;
}

int main(){
    int T;
    cin >> T;
    for(int a0 = 0; a0 < T; a0++){
        cin >> n;
        vector<int> q(n+1);
        for(int q_i = 1;q_i <= n;q_i++){
           cin >> q[q_i];
        }
        // your code goes here
        vector<int>bribe(n+1, 0);
        int ret = solve(q, bribe);
        if (ret != -1) {
            cout << ret << endl;
        } else {
            cout << "Too chaotic" << endl;
        }
    }
    return 0;
}
```

## Absolute Permutation

https://www.hackerrank.com/challenges/absolute-permutation

1Y，开心。（这题的Submissions只有466次~）

其实举几个例子就能发现规律了。依次按下面的顺序判断：

1. 首先，如果`K=0`，显然数列是不会变的；
2. 如果数列有奇数个元素，是没有*absolute permutation*的，因为至少会有一个无法匹配；
3. 如果数列有偶数个元素，但是`K > N/2`，是无解的；
4. 如果`K`不能被`N`整除，也是无解的，原因同2。

如果通过了上面的检测，说明有解，遍历原数列，做相应的转换即可：`swap(P[i], P[i+K])`。注意对交换过的元素不要重复操作。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int N, K;
int P[100005];

void print() {
    for (int i = 1; i <= N; ++i) {
        printf("%d ", P[i]);
    }
    printf("\n");
}

void solve () {
    if (K == 0) {
        print();
        return;
    }
    if (N % 2 != 0 || K > N / 2 || N % K != 0) {
        cout << -1 << endl;
        return;
    }
    for (int i = 1; i <=  N; ++i) {
        if (P[i] >= i) {
            swap(P[i], P[i+K]);
        }
    }
    print();
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        cin >> N >> K;
        for (int i = 1; i <= N; ++i) {
            P[i] = i;
        }
        solve();
    }
    return 0;
}
```

## The Bomberman Game

https://www.hackerrank.com/challenges/bomber-man

模拟。从第3秒开始周期性变化，3,4,5,6, 3,4,5,6, ...

所以1~6秒的状态应该单独计算出来，然后用取模即可（模4）。当`N > 2`时，状态应该是`(N-3)%4 + 3`

如果直接递推铁定超时，因为N最大可取10^9

```cpp
#include <cmath>
#include <cstdio>
#include <cstring>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

char grid[7][205][205];    // the first dimension means status
int R, C, N;

void copy(int last, int now) {
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            grid[now][i][j] = grid[last][i][j];
        }
    }
}

void setFull(int status) {
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            grid[status][i][j] = 'O';
        }
    }
}

void detonate(int lastTwo, int now) {
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            if (grid[lastTwo][i][j] == 'O') {
                grid[now][i][j] = '.';
                if (i-1 >= 0) grid[now][i-1][j] = '.';
                if (i+1 < R) grid[now][i+1][j] = '.';
                if (j-1 >= 0) grid[now][i][j-1] = '.';
                if (j+1 < C) grid[now][i][j+1] = '.';
            } else {
                //grid[now][i][j] = '0';
            }
        }
    }

    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            if (grid[now][i][j] != '.') {
                grid[now][i][j] = 'O';
            }
        }
    }
}

void print(int status) {
    for (int i = 0; i < R; ++i) {
        printf("%s\n", grid[status][i]);
    }
}

void solve() {
    copy(0, 1);    // 1 s
    setFull(2);    // 2 s
    detonate(1, 3);// 3 s
    setFull(4);    // 4 s
    detonate(3, 5);// 5 s
    setFull(6);    // 6 s
    if (N <= 2) {
        print(N);
    } else {
        N = (N-3)%4 + 3;
        print(N);
    }
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    cin >> R >> C >> N;
    for (int i = 0; i < R; ++i) {
        scanf("%s", grid[0][i]);
    }
    
    solve();
    
    return 0;
}
```

## Ema's Supercomputer

https://www.hackerrank.com/challenges/two-pluses

暴力搜索。虽然问题挺复杂，但是搜索空间其实不大，`N`和`M`都在[2,15]的范围内。那么所有可能的*valid*图形一条线的长度就是：1, 3, 5, 7, 9, 11, 13, 15. 先根据`N, M`的大小定上界，再从大到小枚举。

对于每个长度，先搜索第一个*valid*图形，要把图中所有满足条件的位置都找出来并存储（如果仅仅找一个可能最后求出来的是局部最优解）；然后对每一个找到的*valid*图形，搜索第二个*valid*图形，也是按长度从大到小搜索，同时要满足不与第一个图形相重叠。

算上自己的两次提交，这题的提交数居然只有111次...

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int N, M;
char grid[16][16];
vector<vector<bool> > flag(16, vector<bool>(16, false));

struct Pos {
    int x, y;
    Pos(int i, int j): x(i), y(j) {}
};

void _initFlag_() {
    for (int i = 0; i < flag.size(); ++i) {
        for (int j = 0; j < flag.size(); ++j) {
            flag[i][j] = false;
        }
    }
}

bool isValid(int i, int j, int len) {
    if (grid[i][j] != 'G' || flag[i][j] == true) {
        return false;
    }
    for (int k = i - len/2; k <= i + len/2; ++k) {
        if (grid[k][j] != 'G' || flag[k][j] == true)
            return false;
    }
    for (int k = j - len/2; k <= j + len/2; ++k) {
        if (grid[i][k] != 'G' || flag[i][k] == true)
            return false;
    }
    return true;
}

void mark(int i, int j, int len) {
    for (int k = i - len/2; k <= i + len/2; ++k) {
        flag[k][j] = true;
    }
    for (int k = j - len/2; k <= j + len/2; ++k) {
        flag[i][k] = true;
    }
}

vector<Pos> search(int len) {
    int start = (len-1)/2, iend = N-1-(len-1)/2, jend = M-1-(len-1)/2;
    vector<Pos> validPos;
    for (int i = start; i <= iend; ++i) {
        for (int j = start; j <= jend; ++j) {
            if (isValid(i,j,len)) {
                Pos mypos(i,j);
                validPos.push_back(mypos);
            }
        }
    }
    return validPos;
}

int solve() {
    int longest = min(N, M);
    if (longest % 2 == 0) longest--;
    int ret = 1;
    for (int i = longest; i >= 1; i -= 2) {
        _initFlag_();
        vector<Pos> fstPos = search(i);
        if (!fstPos.empty()) {
            for (int iPos = 0; iPos < fstPos.size(); ++iPos) {
                _initFlag_();
                mark(fstPos[iPos].x, fstPos[iPos].y, i);
                for (int j = longest; j >= 1; j -= 2) {
                    if (!search(j).empty()) {
                        ret = max(ret, (2*i-1)*(2*j-1));
                        break;
                    }
                }
            }
        }
    }
    return ret;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    cin >> N >> M;
    for (int i = 0; i < N; ++i) {
        scanf("%s", grid[i]);
    }

    cout << solve() << endl;

    return 0;
}
```

我把代码也贴这里了: http://ideone.com/j9fNSY

## Minimum Distance

https://www.hackerrank.com/challenges/minimum-distances

开个哈希表。

```cpp
#include <vector>
#include <map>
#include <iostream>

using namespace std;

int solve(vector<int> &A) {
    int ret = 0x3f3f3f3f;
    map<int,int> myHash;
    for (int i = 0; i < A.size(); ++i) {
        if (myHash.find(A[i]) != myHash.end()) {
            ret = min(ret, i - myHash[A[i]]);
        } else {
            myHash[A[i]] = i;
        }
    }
    if (ret == 0x3f3f3f3f)
        return -1;
    return ret;
}

int main(){
    int n;
    cin >> n;
    vector<int> A(n);
    for(int i = 0;i < n;i++){
       cin >> A[i];
    }
    
    cout << solve(A) << endl;
    
    return 0;
}
```

## Find Digits

https://www.hackerrank.com/challenges/find-digits

数据范围不大，直接计算即可。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solve(int n) {
    int ori = n;
    int ret = 0;
    int digit;
    while (n > 0) {
        digit = n % 10;
        if (digit != 0) {
            ret += (ori % digit == 0? 1:0);
        }
        n /= 10;
    }
    return ret;
}

int main(){
    int t;
    cin >> t;
    for(int a0 = 0; a0 < t; a0++){
        int n;
        cin >> n;
        cout << solve(n) << endl;
    }
    return 0;
}
```

## Fair Rations

https://www.hackerrank.com/challenges/fair-rations

依次遍历数组，遇到奇数，就给他以及他后面的人面包，不能往前给（如果往前给，前面的又变成奇数了，还要回头多给，所以一定不是最少的）。这样下去直到最后一人，如果最后一人还是奇数，说明无法实现全部偶数。扫一遍数组即可。主要代码：

```cpp
int solve(vector<int> B) {
    int ret = 0;
    for (int i = 0; i < B.size(); ++i) {
        if (B[i] % 2 != 0) {
            B[i] += 1;
            if (i+1 < B.size())
                B[i+1] += 1;
            else
                return -1;
            ret += 2;
        }
    }
    return ret;
}

int main(){
    int N;
    cin >> N;
    vector<int> B(N);
    for(int B_i = 0;B_i < N;B_i++){
       cin >> B[B_i];
    }
    
    int ret = solve(B);
    if (ret == -1)
        cout << "NO" << endl;
    else
        cout << ret << endl;
    
    return 0;
}
```

## Sherlock and Squares

https://www.hackerrank.com/challenges/sherlock-and-squares

O(1)就能解。关键是边界的处理要细心。其实有公式可以套，不过本质是一样的。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solve(int A, int B) {
    int ret = 0;
    double start = sqrt(A), end = sqrt(B);
    if (start - (int)start < 1e-6) {
        ret++;
        start++;
    }
    if (end - (int)end < 1e-6) {
        ret++;
        end--;
    }
    start = ceil(start); end = floor(end);
    ret += (end - start + 1);
    return ret;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    int T;
    int A, B;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        cin >> A >> B;
        cout << solve(A, B) << endl;
    }
    return 0;
}
```

## Almost Sorted

https://www.hackerrank.com/challenges/almost-sorted

每种情况都判断一次即可，O(n)。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

bool isSorted(vector<int> &d) {
    int n = d.size() - 1;
    for (int i = 1; i <= n-1; ++i) {
        if (d[i] > d[i+1])
            return false;
    }
    return true;
}

void reverse(vector<int> &d, int start, int end) {
    for (int i = start, j = end; i < j; ++i, --j) {
        swap(d[i], d[j]);
    }
}

void solve(vector<int> &d) {
    int n = d.size() - 1;
    if (isSorted(d)) {
        cout << "yes" << endl;
        return;
    }
    
    int start, end;
    for (int i = 1; i <= n-1; ++i) {
        if (d[i] > d[i+1]) {
            start = i;
            break;
        }
    }
    for (int i = n; i >= 2; --i) {
        if (d[i] < d[i-1]) {
            end = i;
            break;
        }
    }
    swap(d[start], d[end]);
    if (isSorted(d)) {
        cout << "yes" << endl;;
        cout << "swap" << " " << start << " " << end << endl;
        return;
    } else {
        swap(d[start], d[end]);;
        goto next;
    }

    next:
    reverse(d, start, end);
    if (isSorted(d)) {
        cout << "yes" << endl;
        cout << "reverse" << " "<< start << " " << end << endl;
        return;
    }

    cout << "no" << endl;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    int n;
    cin >> n;
    vector<int> d(n+1);
    for (int i = 1; i <= n; ++i) {
        scanf("%d", &d[i]);
    }
    solve(d);
    return 0;
}
```

## Beautiful Triplets

https://www.hackerrank.com/challenges/beautiful-triplets

这题较好的做法是用哈希表存储下每个元素。然后遍历一遍数组，对每个元素`a[i]`，查找`a[i]+d`和`a[i]+d+d`是否存在，如果存在，计数加1。O(n)的时间复杂度。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <unordered_map>
using namespace std;

unordered_map<int,bool> myHash;

int solve(vector<int> &a, int d) {
    int ret = 0;
    for (int i = 0; i < a.size(); ++i) {
        if (myHash.find(a[i]+d) != myHash.end() && myHash.find(a[i]+d+d) != myHash.end()) {
            ret++;
        }
    }  
    return ret;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int n, d;
    cin >> n >> d;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) {
        scanf("%d", &a[i]);
        myHash[a[i]] = true;
    }
    cout << solve(a, d) << endl;
    return 0;
}
```

O(n^3)的暴力搜索也可以过~

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solve(vector<int> &a, int d) {
    int ret = 0;
    int n = a.size();
    for (int i = 0; i <= n-3; ++i) {
        for (int j = i+1; j <= n-2; ++j) {
            if (a[j] - a[i] == d) {
                for (int k = j+1; k <= n-1; ++k) {
                    if (a[k]-a[j] == d) {
                        ret++;
                        break;
                    } else if (a[k]-a[j] > d) {
                        break;
                    }
                }
            } else if (a[j] - a[i] > d) {
                break;
            }
        }
    }
    return ret;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int n, d;
    cin >> n >> d;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) {
        scanf("%d", &a[i]);
    }
    cout << solve(a, d) << endl;
    return 0;
}
```

## Chocolate Feast

https://www.hackerrank.com/challenges/chocolate-feast

模拟一下即可。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solve(int n, int c, int m) {
    int start = n / c;
    int ret = start;
    while (start >= m) {
        ret += (start/m);
        start  = start/m + start%m;
    }
    return ret;
}

int main(){
    int t;
    cin >> t;
    for(int a0 = 0; a0 < t; a0++){
        int n;
        int c;
        int m;
        cin >> n >> c >> m;
        cout << solve(n, c, m) << endl;
    }
    return 0;
}
```

## Larry's Array

https://www.hackerrank.com/challenges/larrys-array

我的方法是按照规则替换，有点冒泡的思想，扫一遍一个不在正确位置的元素至少往正确的方向移动一次，最多扫`N`遍，所以复杂度是O(N^2)的。据说这个问题其实不用真的去做`rotate`就可以判断是否有解。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

bool isSorted(vector<int> &A) {
    for (int i = 0; i < A.size() - 1; ++i) {
        if (A[i] > A[i+1])
            return false;
    }
    return true;
}

void scanOnce(vector<int> &A) {
    for (int i = 0; i <= A.size()-3; ++i) {
        if (A[i+2] < A[i] && A[i] < A[i+1]) {
            swap(A[i],A[i+2]);
            swap(A[i+1],A[i+2]);
        } else if (A[i+1] < A[i] && A[i] < A[i+2]) {
            swap(A[i],A[i+1]);
            swap(A[i+1],A[i+2]);
        } else if (A[i] > A[i+1] && A[i+1] > A[i+2]) {
            swap(A[i],A[i+2]);
            swap(A[i],A[i+1]);
        } else if (A[i] > A[i+2] && A[i+2] > A[i+1]) {
            swap(A[i],A[i+1]);
            swap(A[i+1],A[i+2]);
        }
    }
}

void solve(vector<int> &A) {
    if (isSorted(A)) {
        cout << "YES" << endl;
        return;
    }
    for (int i = 1; i <= A.size(); ++i) {
        scanOnce(A);
    }
    if (isSorted(A)) {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int T, N;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        cin >> N;
        vector<int> A(N);
        for (int i = 0; i < N; ++i) {
            scanf("%d", &A[i]);
        }
        solve(A);
    }
    return 0;
}
```

关于这题，*Discussions*里有人这么说：

> A "rotation" does not change the parity of the number of inversions. That's the key to solving this. The array can be sorted only if the initial number of inversions is even (this is because you want 0 inversions at the end, which is even).

## The Grid Search

https://www.hackerrank.com/challenges/the-grid-search

二维字符串匹配，暴力搜索即可过。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

bool isMatch(vector<string> &G, vector<string> &P, int i, int j) {
    int k = 0;
    for (int r = i; r <= i + P.size() - 1; ++r) {
        if (G[r].substr(j, P[0].size()) != P[k++]) {
            return false;
        }
    }
    return true;
}

void solve(vector<string> &G, vector<string> &P) {
    int R = G.size(), C = G[0].size();
    int r = P.size(), c = P[0].size();
    for (int i = 0; i <= R-r; ++i) {
        for (int j = 0; j <= C-c; ++j) {
            if (isMatch(G, P, i, j)) {
                cout << "YES" << endl;
                return;
            }
        }
    }
    cout << "NO" << endl;
}

int main(){
    int t;
    cin >> t;
    for(int a0 = 0; a0 < t; a0++){
        int R;
        int C;
        cin >> R >> C;
        vector<string> G(R);
        for(int G_i = 0;G_i < R;G_i++){
           cin >> G[G_i];
        }
        int r;
        int c;
        cin >> r >> c;
        vector<string> P(r);
        for(int P_i = 0;P_i < r;P_i++){
           cin >> P[P_i];
        }
        solve(G, P);
    }
    return 0;
}
```

## Cavity Map

https://www.hackerrank.com/challenges/cavity-map

搜索一遍即可。遇到一个问题，当二维数组A只有一个元素时，`A.size()-2`不是-1，而是发生了溢出！原因在于，vector::size的类型并不是`int`而是`unsigned`。`unsigned`类型和`int`类型相减，可能会导致溢出。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

bool isHole(vector<string> &grid, int i, int j) {
    char x = grid[i][j];
    if (grid[i-1][j] < x && grid[i+1][j] < x && grid[i][j-1] < x && grid[i][j+1] < x) {
        return true;
    }
    return false;
}

void solve(vector<string> &grid) {
    int n = grid.size();
    for (int i = 1; i <= n-2; ++i) {
        for (int j = 1; j <= grid[i].size()-2; ++j) {
            if (isHole(grid,i,j)) {
                grid[i][j] = 'X';
            }
        }
    }
    for (int i = 0; i < grid.size(); ++i) {
        cout << grid[i] << endl;
    }
}

int main(){
    int n;
    cin >> n;
    vector<string> grid(n);
    for(int grid_i = 0;grid_i < n;grid_i++){
       cin >> grid[grid_i];
    }
    solve(grid);
    return 0;
}
```

## Library Fine

https://www.hackerrank.com/challenges/library-fine

水题。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int solve(int D, int M, int Y, int D0, int M0, int Y0) {
    int fine = 0;
    if (Y < Y0) {
        return fine;
    }
    
    if (Y == Y0) {
        if (M < M0) {
            return fine;
        }
        if (M == M0) {
            fine = max(15 * (D - D0), 0);
            return fine;
        }
        return 500 * (M - M0);
    }
    
    return 10000;
}

int main(){
    int d1;
    int m1;
    int y1;
    cin >> d1 >> m1 >> y1;
    int d2;
    int m2;
    int y2;
    cin >> d2 >> m2 >> y2;
    
    cout << solve(d1, m1, y1, d2, m2, y2) << endl;
    
    return 0;
}
```

## Manasa and Stones

https://www.hackerrank.com/challenges/manasa-and-stones

写写就能找出规律了。公式是：`i*b + (n-1-i)*a`，其中，`a<b`，`i`从`0`到`n-1`。需要注意的是当`a=b`时，只有一种可能，就是`(n-1)*a`，没有必要重复输出。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

void solve(int n, int a, int b) {
    if (a == b) {
        cout << (n-1)*a << endl;
        return;
    }
    for (int i = 0; i <= n-1; ++i) {
        cout << (i*b + (n-1-i)*a) << " ";
    }
    cout << endl;
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int T;
    int n, a, b;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        cin >> n >> a >> b;
        if (a > b) {
            swap(a, b);
        }
        solve(n, a, b);
    }
    return 0;
}
```

## ACM ICPC Team

https://www.hackerrank.com/challenges/acm-icpc-team

两两遍历字符串，做类似`或`的操作来计算一个team的topic数，同时用Hash存起来，便于O(1)输出能达到最大topic数的队伍数量。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
#include <unordered_map>
using namespace std;

int numTopic(string a, string b) {
    int cnt = 0;
    for (int i = 0; i < a.size(); ++i) {
        if (a[i] == '1' || b[i] == '1') {
            cnt++;
        }
    }
    return cnt;
}

void solve(vector<string> &topic) {
    int n = topic.size();
    int maxTopic = 0, numTeam = 0;
    unordered_map<int,int> myHash;
    for (int i = 0; i < n - 1; ++i) {
        for (int j = i+1; j < n; ++j) {
            int tmp = numTopic(topic[i], topic[j]);
            maxTopic = max(maxTopic, tmp);
            if (myHash.find(tmp) != myHash.end()) {
                myHash[tmp]++;
            } else {
                myHash[tmp] = 1;
            }
        }
    }
    cout << maxTopic << "\n" << myHash[maxTopic] << endl;
}

int main(){
    int n;
    int m;
    cin >> n >> m;
    vector<string> topic(n);
    for(int topic_i = 0;topic_i < n;topic_i++){
       cin >> topic[topic_i];
    }
    solve(topic);
    return 0;
}
```

## Extra Long Factorials

https://www.hackerrank.com/challenges/extra-long-factorials

用Java的`BigInteger`偷个懒。

```java
import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;


public class Solution {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(solve(n));
    }

    public static BigInteger solve(int N) {
        BigInteger ret = BigInteger.ONE;
        for (int i = 1; i <= N; ++i) {
            ret = ret.multiply(BigInteger.valueOf(i));
        }
        return ret;
    }
}
```

## TaumB

https://www.hackerrank.com/challenges/taum-and-bday

其实是个二元函数求极值的问题，这个问题下的二元函数很简单，是线性的，所以最小值一定在极端情况获取，即都买黑色礼物或者白色礼物。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>

using namespace std;

long long threeMin(long long a, long long b, long long c) {
    return min(a, min(b,c));
}

long long solve(long b, long w, long x, long y, long z) {
    return threeMin(b*x+w*y, (b+w)*x+w*z, (b+w)*y+b*z);
}

int main(){
    int t;
    cin >> t;
    for(int a0 = 0; a0 < t; a0++){
        long b;
        long w;
        cin >> b >> w;
        long x;
        long y;
        long z;
        cin >> x >> y >> z;
        cout << solve(b, w, x, y, z) << endl;
    }
    return 0;
}
```

## The Time in Words

https://www.hackerrank.com/challenges/the-time-in-words

老老实实写。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <unordered_map>
using namespace std;

unordered_map<int, string> W;

void makeConvert() {
    W[1] = "one";
    W[2] = "two";
    W[3] = "three";
    W[4] = "four";
    W[5] = "five";
    W[6] = "six";
    W[7] = "seven";
    W[8] = "eight";
    W[9] = "nine";
    W[10] = "ten";
    W[11] = "eleven";
    W[12] = "twelve";
    W[13] = "thirteen";
    W[14] = "fourteen";
    W[15] = "fifteen";
    W[16] = "sixteen";
    W[17] = "seventeen";
    W[18] = "eighteen";
    W[19] = "ninteen";
    W[20] = "twenty";
}

void solve(int h, int m) {
    if (m == 0) {
        cout << W[h] << " o' clock" << endl;
    } else if (m == 15) {
        cout << "quarter past " << W[h] << endl;
    } else if (m==10 || m==20) {
        cout << W[m] << " minutes past " << W[h] << endl;
    } else if (m < 30) {
        cout << W[m-m%10] << " " << W[m%10] << " minutes past " << W[h] << endl;
    } else if (m == 30) {
        cout << "half past " << W[h] << endl;
    } else if (m == 45) {
        cout << "quarter to " << W[h+1] << endl;
    } else if (m % 10 == 0 || m >= 40){
        cout << W[60-m] << " minutes to " << W[h+1] << endl;
    } else {
        cout << W[(60-m)-(60-m)%10] << " " << W[(60-m)%10] << " minutes to " << W[h+1] << endl;
    }
}

int main(){
    int h;
    cin >> h;
    int m;
    cin >> m;
    
    makeConvert();
    solve(h, m);
    
    return 0;
}
```

## Modified Kaprekar Numbers

https://www.hackerrank.com/challenges/kaprekar-numbers

O(n)水过。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

bool isKaprekar(int x) {
    if (x == 1) return true;
    if (x < 9) return false;
    long long square = (long long)x * x;
    string s = to_string(square);
    int len = s.size();
    int tmp1 = stoi(s.substr(0,len/2)) + stoi(s.substr(len/2,len-len/2));
    //int tmp2 = stoi(s.substr(0,len/2-1)) + stoi(s.substr(len/2,len-1));
    if (tmp1 == x) {
        return true;
    } else {
        return false;
    }
}

int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   
    int p, q;
    cin >> p >> q;
    bool flag = false;
    for (int i = p; i <= q; ++i) {
        if (isKaprekar(i)) {
            flag = true;
            cout << i << " ";
        }
    }
    if (!flag) {
        cout << "INVALID RANGE" << endl;
    }
    return 0;
}
```

其实也可以O(1)水过。。

`1`到`99999`的`Kaprekar Numbers` :)

`1 9 45 55 99 297 703 999 2223 2728 4950 5050 7272 7777 9999 17344 22222 77778 82656 95121 99999`

## Encryption

https://www.hackerrank.com/challenges/encryption

模拟。先构造矩阵，再按列构造密文。须要注意的是，求出`rows = floor(sqrt(L))`和`colums = ceil(sqrt(L))`之后还应判断`rows * colums`是否小于`L`，如果是，应将`rows`加1。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

vector<string> convert(string s) {
    int L = s.size();
    double tmp = sqrt(L);
    int r = floor(tmp), c = ceil(tmp);
    if (r*c < L) {
        r++;
    }
    vector<string> grid(r);
    int pos = 0, k = 0;
    for (int i = 0; i < r; ++i, pos += c) {
        if (pos + c - 1 >= L - 1) {
            grid[i] = s.substr(pos);
        } else {
            grid[i] = s.substr(pos, c);
        }
    }
    return grid;
}

void encode(vector<string> &grid) {
    int r = grid.size(), c = grid[0].size();
    for (int j = 0; j < c; ++j) {
        for (int i = 0; i < r; ++i) {
            if (grid[i].size() < j+1) {
                break;
            }
            cout << grid[i][j];
        }
        cout << " ";
    }
    cout << endl;
}

void solve(string s) {
    vector<string> grid = convert(s);
    encode(grid);
}

int main(){
    string s;
    cin >> s;
    solve(s);
    return 0;
}
```

## Matrix Layer Rotation

https://www.hackerrank.com/challenges/matrix-rotation-algo

这题的难度级别是*difficult*，但是提交却有`10232`次。模拟矩阵旋转（不同于转置），逻辑其实很简单，但是实现起来要费一番脑筋。基本idea就是从外向内一层一层旋转。重要信息是M,N当中较小的是偶数，这说明一个M*N的矩阵有`min(M,N)/2`层，然后可以确定每一层矩形四个顶点的公式。旋转次数`R`可以很大，要对每一层的矩形周长取模。另外就是无需直接模拟旋转，而是找到旋转后的起点和终点，然后有序的重排元素。肯定有更简洁的写法，暂时先放着吧。

这是`HackerRank-Implementation`章节的最后一题。2016.7.30 完结撒花~

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

struct Point {
    int x;
    int y;
    Point(int x1,int x2) : x(x1), y(x2) {}
};

vector<int> copy(vector<vector<int> > &a, int id) {
    int M = a.size(), N = a[0].size();
    int len = 2 * (M+N-4*id-2);
    vector<int> snake(len);
    int k = 0;
    for (int j = id; j <= N-1-id; ++j)    // up
        snake[k++] = a[id][j];
    for (int i = id+1; i <= M-2-id; ++i)  // right
        snake[k++] = a[i][N-1-id];
    for (int j = N-1-id; j >= id; --j)    // bottom
        snake[k++] = a[M-1-id][j];
    for (int i = M-2-id; i >= id+1; --i)  // left
        snake[k++] = a[i][id];
    return snake;
}

Point getNewPos(vector<vector<int> > &a, int id, int R) {
    int M = a.size(), N = a[0].size();
    int len = 2 * (M+N-4*id-2);
    R %= len;
    if (R == 0)
        return Point(id, id);
    int x = id, y = id;
    while (R > 0) {
        while (R > 0 && x < M-1-id) {
            x++; R--;
        }
        while (R > 0 && y < N-1-id) {
            y++; R--;
        }
        while (R > 0 && x > id) {
            x--; R--;
        }
        while (R > 0 && y > id) {
            y--; R--;
        }
    }
    return Point(x, y);
}

void rotateCircle(vector<vector<int> > &a, int id, int R) {
    int M = a.size(), N = a[0].size();
    vector<int> snake = copy(a, id);
    Point posHead = getNewPos(a, id, R);
    if (posHead.x == id && posHead.y == id)
        return;
    int k = 0, len = snake.size();
    if (posHead.y == id) {
        for (int i = posHead.x; i >= id && k < snake.size(); --i)
            a[i][id] = snake[k++];
        for (int j = id+1; j <= N-1-id && k < snake.size(); ++j)
            a[id][j] = snake[k++];
        for (int i = id+1; i <= M-1-id && k < snake.size(); ++i)
            a[i][N-1-id] = snake[k++];
        for (int j = N-2-id; j >= id && k < snake.size(); --j)
            a[M-1-id][j] = snake[k++];
        for (int i = M-2-id; i > posHead.x && k < snake.size(); --i)
            a[i][id] = snake[k++];
    } else if (posHead.x == M-1-id) {
        for (int j = posHead.y; j >= id && k < snake.size(); --j)
            a[M-1-id][j] = snake[k++];
        for (int i = M-2-id; i >= id && k < snake.size(); --i)
            a[i][id] = snake[k++];
        for (int j = id+1; j <= N-1-id && k < snake.size(); ++j)
            a[id][j] = snake[k++];
        for (int i = id+1; i <= M-1-id && k < snake.size(); ++i)
            a[i][N-1-id] = snake[k++];
        for (int j = N-2-id; j > posHead.y && k < snake.size(); --j)
            a[M-1-id][j] = snake[k++];
    } else if (posHead.y == N-1-id) {
        for (int i = posHead.x; i <= M-1-id && k < snake.size(); ++i)
            a[i][N-1-id] = snake[k++];
        for (int j = N-2-id; j >= id && k < snake.size(); --j)
            a[M-1-id][j] = snake[k++];
        for (int i = M-2-id; i >= id && k < snake.size(); --i)
            a[i][id] = snake[k++];
        for (int j = id+1; j <= N-1-id && k < snake.size(); ++j)
            a[id][j] = snake[k++];
        for (int i = id+1; i < posHead.x && k < snake.size(); ++i)
            a[i][N-1-id] = snake[k++];
    } else {
        for (int j = posHead.y; j <= N-1-id && k < snake.size(); ++j)
            a[id][j] = snake[k++];
        for (int i = id+1; i <= M-1-id && k < snake.size(); ++i)
            a[i][N-1-id] = snake[k++];
        for (int j = N-2-id; j >= id && k < snake.size(); --j)
            a[M-1-id][j] = snake[k++];
        for (int i = M-2-id; i >= id && k < snake.size(); --i)
            a[i][id] = snake[k++];
        for (int j = id+1; j < posHead.y && k < snake.size(); ++j)
            a[id][j] = snake[k++];
    }
}

void print(vector<vector<int> > &a) {
    for (int i = 0; i < a.size(); ++i) {
        for (int j = 0; j < a[0].size(); ++j) {
            printf("%d ", a[i][j]);
        }
        cout << endl;
    }
}

void solve(vector<vector<int> > &a, int R) {
    int M = a.size(), N = a[0].size();
    int numCircle = min(M,N) / 2;
    for (int i = 0; i < numCircle; ++i) {
        rotateCircle(a, i, R);
    }
    print(a);
}

int main() {
    int M, N, R;
    cin >> M >> N >> R;
    vector<vector<int> > a(M, vector<int>(N));
    for (int i = 0; i < M; ++i) {
        for (int j = 0; j < N; ++j) {
            scanf("%d", &a[i][j]);
        }
    }
    solve(a, R);
    return 0;
}
```

