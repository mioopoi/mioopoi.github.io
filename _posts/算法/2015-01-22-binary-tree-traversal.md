---
layout: post
title: "二叉树的遍历"
description: ""
category: "算法"
tags: [分治,Divide & Conquer,二叉树]
summary:
---

二叉树三种遍历方法的递归实现很简单，但是有必要掌握非递归实现，因为非递归实现不会有栈溢出的问题，通常效率也更高一些。

二叉树的数据结构说明: (如未说明，后面贴出的代码均是C++代码)

```c++
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
```

## 前序遍历
二叉树的前序遍历，先访问根节点，然后访问左子树，最后访问右子树（根-左-右）。在子树上也用同样的顺序进行遍历。

### 递归实现
在实现二叉树的遍历之前，将会用到直接遍历(Traverse)和分治(Divide & Conquer)，这里简要提一下直接遍历和分治的异同。
相同点：
- 都属于递归算法

不同点：
- 一般来说，直接遍历是自顶向下(Top-down)，而分治是自底向上(Bottom-up)
- 直接遍历通常无返回值，往往通过对传入的参数进行修改来实现目标；而分治通常有返回值，不修改传入的参数

直接遍历：

```c++
void preOrderTraversal(TreeNode *root)
{
    if (root == NULL) {
        return;
    }
    cout << root->val << " ";
    preOrderTraversal(root->left);
    preOrderTraversal(root->right);
}
```

分治：

```c++
vector<int> preorderTraversal(TreeNode *root) {
    // recursion version, Divide & Conquer
    vector<int> rst;
    if (root == NULL) {
        return rst;
    }
    // Divide
    vector<int> left = preorderTraversal(root->left);
    vector<int> right = preorderTraversal(root->right);
    // Conquer
    rst.push_back(root->val);
    rst.insert(rst.end(), left.begin(), left.end());
    rst.insert(rst.end(), right.begin(), right.end());
    return rst;
}
```

为了表现分治和直接遍历的不同，用一个`vector`容器来存储遍历时访问的节点，可见在进行递归时，每次调用自己都有返回值。`left`即存储了对左子树进行前序遍历的节点值，`right`即存储了对右子树进行前序遍历的节点值，然后**合并**这些结果，即先放入根节点，然后放入`left`，最后放入`right`。这里用到了`std::vector::insert`函数来将一个容器的内容放入另一个容器。

分治的时间复杂度和直接遍历差不多，但是由于不像直接遍历那样对指针进行操作，多了一个合并的过程，所以耗时会相对多些。其好处则是思路很清晰。

### 非递归实现
非递归实现一般用**栈**来模拟递归的过程。

思路1：
1. 用一个栈来辅助；先将根节点入栈；
2. 以栈顶节点为根进行DFS (每次往左)，把经过的节点都压入栈中，同时输出节点的值，直到最左下的节点；
3. 弹出栈顶节点（因为这时该节点和其左子树都已经被访问过），如果被弹出的栈顶节点有右儿子，则将其压入栈；
4. 重复步骤2和3，直到栈为空。

```c++
void preorderTraversal(TreeNode *root) {
    // non-recursion version 1
    stack<TreeNode*> stacknode;
    TreeNode *curt = root;

    if (root == NULL) {
        return rst;
    }

    while (curt != NULL || !stacknode.empty()) {
        while (curt != NULL) {
            cout << curt->val << " ";
            stacknode.push(curt);
            curt = curt->left;
        }
        curt = stacknode.top();
        stacknode.pop();
        curt = curt->right;
    }
}
```

还有一种实现方法是在访问栈顶元素时（先将根节点入栈），输出其值后立即将其弹出栈，然后**先将其右儿子入栈，再将其左儿子入栈**，虽然看起来违反直觉，而其实是保证了前序遍历的顺序，请仔细思考这么做的原因。

```c++
void preorderTraversal(TreeNode *root) {
    // non-recursion version 2
    stack<TreeNode*> stacknode;
    TreeNode *tmp;

    if (root == NULL) {
        return rst;
    }

    stacknode.push(root);
    while (!stacknode.empty()) {
        tmp = stacknode.top();
        cout << tmp->val << " ";
        stacknode.pop();
        if (tmp->right != NULL) {
            stacknode.push(tmp->right);
        }
        if (tmp->left != NULL) {
            stacknode.push(tmp->left);
        }
    }
}
```

## 中序遍历
二叉树的中序遍历，先访问左子树，然后访问根节点，最后访问右子树（左-根-右）。在子树上也用同样的顺序进行遍历。

### 递归实现
这里就不贴出分治的代码了。

```c++
 void inorderTraversal(TreeNode *root)
 {
	 if (root != NULL) {
		 inorderTraversal(root->left);
		 printf("%d ", root->val);
		 inorderTraversal(root->right);
	 }
 }
```

### 非递归实现
思路：
1. 用一个栈来辅助；先将根节点入栈；
2. 以栈顶节点为根进行DFS (每次往左)，把经过的节点都压入栈中，直到最左下的节点；
3. 输出栈顶节点的值，然后弹出栈顶节点，如果被弹出的栈顶节点有右儿子，则将其压入栈；
4. 重复步骤2和3，直到栈为空。

p.s. 以上思路其实就是模拟递归的过程。

代码:
```c++
void inorderTraversal(TreeNode *root) {
    // non-recursion version
    stack<TreeNode*> mystack;
    TreeNode *curt = root;
    while (curt != NULL || !mystack.empty()) {
        while (curt != NULL) {
            mystack.push(curt);
            curt = curt->left;
        }
        curt = mystack.top();
        printf("%d ", curt->val);
        mystack.pop();
        curt = curt->right;
    }
}
```

还有一种非递归实现方法是不采用栈，但是需要知道一个节点的父节点信息，思路和用栈的方法一样，只不过有一个回溯的过程，这里就不详细说了，具体可以参考<a href="http://www.cnblogs.com/shuaiwhu/archive/2011/04/20/2065055.html", target="_blank">http://www.cnblogs.com/shuaiwhu/archive/2011/04/20/2065055.html</a>

## 后序遍历
二叉树的后序遍历，先访问左子树，然后访问右子树，最后访问根节点（左-右-根）。在子树上也用同样的顺序进行遍历。

### 递归实现

```c++
void postorderTraversal(TreeNode *root)
{
    if (root == NULL) {
        return;
    }
    postorderTraversal(root->left);
    postorderTraversal(root->right);
    cout << root->val << " ";
}
```

### 非递归实现
相比前两种遍历方法的非递归版本，非递归的后序遍历是最困难的。因为要访问完左子树和右子树之后才能访问根节点，而要想访问左子树和右子树，就必须先到达根节点才行，这意味着，在用栈实现时，一个节点将两次出现在栈顶，只有第二次出现在栈顶时，才能出栈并访问。

思路：
用一个变量`lastVisited`标记上一次访问的节点，据此可判断一个节点的右子树是否已经被访问过。
1. 先将根节点入栈，然后一直沿左子树进行DFS，中途将所有节点入栈，直到叶子节点；
2. 此时不能立即弹出栈顶元素并输出其值，因为其右孩子还没有被访问；
3. 如果栈顶元素的右孩子不为空，则按步骤1的方法处理右子树；
否则可以弹出栈顶元素并输出其值，注意更新`lastVisited`变量（指向被弹出的栈顶节点）

```c++
void postorderTraversal(TreeNode *root) {
    // non-recursion
    stack<TreeNode *> stacknode;

    TreeNode *curt = root, *lastVisited = NULL;

    while (curt != NULL || !stacknode.empty()) {
        while (curt != NULL) {
            stacknode.push(curt);
            curt = curt->left;
        }
        curt = stacknode.top();
        if (curt->right == NULL || lastVisited == curt->right) {
            stacknode.pop();
            cout << curt->val << " ";
            lastVisited = curt;
            curt = NULL;    // 这句很关键，不能漏
        } else {
            curt = curt->right;
        }
    }
}
```

参考:
[1] 二叉树的非递归遍历: http://www.cnblogs.com/dolphin0520/archive/2011/08/25/2153720.html