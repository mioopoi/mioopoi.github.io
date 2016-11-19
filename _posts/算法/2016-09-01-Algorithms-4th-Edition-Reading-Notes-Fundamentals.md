---
layout: post
title: "Algorithms (4th-Edition) Reading Notes: Fundamentals"
description: ""
category: "算法"
tags: [hackerrank]
summary:
---

作者: [小华](http://ihuafan.com/about.html)

- book site: http://algs4.cs.princeton.edu/home/
- 用Java语言描述
- 用到的第三方库下载地址: [algs4.jar](http://algs4.cs.princeton.edu/code/algs4.jar)
- 用到的所有数据下载地址: [algs4-data.zip](http://algs4.cs.princeton.edu/code/algs4-data.zip)
- 导入库时，用`import edu.princeton.cs.algs4.*`

---

本章开始阅读时间: `2016年8月25日`
本章结束阅读时间: `2016年8月31日`

注：本人阅读的是英文原版书籍。

**本章摘要**：第一章用了200+页，但并没有急于进入算法部分。由于全书是通过Java语言来描述算法，所以这一章主要是以Java为例来讲解基本的编程知识，不熟悉Java的同学完全可以将本章作为Java的入门学习材料。读完第一章我的感受是：这本书完全是面向编程和算法初学者，但又不失一定的深度。作者充分考虑了初学者的感受，用了大量的图表帮助读者理解算法的行为，文字描述也非常用心。这本书的配套网站上也有对每章主要内容的概述，读完每一节再利用网站的内容进行复习，效果非常好。

## 1 Fundamentals

### 1.1 Basic Programming Models

`p.23`上列举了几个静态方法的实现，其中素性测试、牛顿法求平方根挺有用，应该理解并记下来。


#### 方法（函数）的一些性质：

- Java中，参数默认是按值传递的(pass by value)
- 函数名可以被重载(overload)
- 一个方法只能有一个返回值（Matlab中，可以有多个返回值）
- 副作用（修改数组的值，输出等）

#### 递归的三要素：

- 要单独处理`base-case`，即问题不可划分的最小情形，在处理完后用`return`返回结果；
- 子问题：要合理地划分出子问题；
- 子问题不应该重叠。

#### 外部库

- `java.lang.*`是标准系统库，我们常用的Java类就在这个库中，比如`System`, `Math`, `Integer`, `Double`, `String`等等
- 需要手动导入的标准库：比如`java.util.Arrays`
- 第三方库

`p.32`上列举的`StdRandom`库里的几个静态方法很有学习价值，比如洗牌算法`shuffle()`。我想到的是它可以用在遗传算法种群初始化上~

- `StdDrew`的API介绍：`p.43`。`p.45`上有一些很有意思的小程序


##### Binary search

不多说了，经典的不能再经典的算法：

```java
public class BinarySearch {
    public static int rank(int key, int[] a) {
        int start = 0;
        int end = a.length - 1;
        while (start <= end) {
            int mid = start + (end - start) / 2;
            if (key < a[mid]) {
                end = mid - 1;
            } else if (key > a[mid]) {
                start = mid + 1;
            } else {
                return mid;
            }
        }
        return -1;
    }
}
```

在测试`p47`的`BinarySearch`时，由于我使用的是**IntelliJ IDEA**，无法像在命令行里那样通过`<`重定向输入流，试了在`Run/Debug Configurations`里设置`Program arguments`，比如这个语句`tinyW.txt < tinyT.txt`，`tinyW`可以读入，`tinyT.txt`就无法读入。在[SegmentFault](https://segmentfault.com/q/1010000004480734)找到了答案。可行的做法是要手动在获得输入前重定向一下标准输入：

```java
try {
    FileInputStream input = new FileInputStream("algs4-data/tinyT.txt");
    System.setIn(input);
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

需要引入的库：

```java
import java.io.FileInputStream;
import java.io.FileNotFoundException;
```

#### 常见问题

- 数组的重叠(Aliasing)：如果要对一个数组进行复制，不能简单地把一个已经存在的数组赋值给它，而应该重新声明一个新的数组，并为他分配内存，然后通过初始化来拷贝。比如，下面的方法就是错误的：

  ```java
  int[] a = new int[N];
  ...
  a[i] = 1234;
  ...
  int[] b = a;    // 这并不是拷贝，b仅仅是a的一个别名
  b[i] = 5678;    // 同时也会修改a[i]的内容
  ```

  所以，这是一个很容易犯错的地方，必须弄清楚概念。


- 整数溢出的一个典型例子：`Math.abs(-2147483648)`的结果是`-2147483648`。
- 整型的最大值和最小值：`Integer.MAX_VALUE`，`Integer.MIN_VALUE`；如何将`double`型初始化为无穷大？正无穷是`Double.POSITIVE_INFINITY`，负无穷是`Double.NEGATIVE_INFINITY`。
- `1/0`的结果是runtime异常，`1/0.0`的结果是`INFINITY`。
- 在Java中，以下两种定义方式：`int a[]`和`int[] a`是等价的，Java推荐后者。
- Java不支持函数式编程（无法将一个静态方法作为某个静态方法的参数传入）。

### 1.2 Data Abstraction

#### 静态方法和非静态方法的不同

- 主要目的：静态方法(static method)的首要目的是实现函数（单一功能），非静态方法或实例方法(non-static method, instance method)的首要目的是实现对数据类型的操作；
- 调用方式：静态方法的调用以类名开始（首字母大写），如`Math.sqrt(2.0)`；而实例方法的调用以对象名开始（首字母小写），如`dog.bark()`。
- 参数：静态方法是直接传入参数（值传递），实例方法是对象和参数的引用。

#### 使用对象

- 赋值。注意对引用的赋值不同于拷贝，和数组的Aliasing一样，仅仅是复制了引用，实体并没有复制。
- 参数传递。好好理解这句话：The convention is to pass the *reference* by value (make a copy of it) but to pass the *object* by reference. 对象作为参数传递时，都是通过引用。
- 返回值。对象可以作为返回值。这就相当于提供了返回多个变量的方法。
- 注意：数组是对象！Java中，除了基本数据类型(primitive type)，所有的类型都是对象。这也是为什么将数组作为参数传递时可以修改数组内部元素，因为数组是对象，而对象都是通过引用传递的。
- 小结：数据类型(data type)是一个值的集合以及定义在它们上面的操作集合。对象(object)是数据类型的实体。对象的三要素：状态(state)，身份(identity)，行为(behavior)。

#### 抽象数据类型的例子

- Java的`String`类。一个问题：为什么不使用字符数组而要使用`String`呢？答案与使用任何ADT的理由一样：为了让客户代码(client code)简洁明了。
- `p.81`列举了一些典型的Java字符串处理代码，比如回文串检测、文件名解析、按特殊字符分割、字典序检测等，很有用。

#### 实现抽象数据类型

- 实例变量(instance variables)。通常声明为`private`（否则就不是抽象类型了）；常量（初始化后就不再改变的量）用`final`修饰。
- 构造函数(constructors)。一个Java类至少有一个构造函数。构造函数的目的就是初始化实例变量。构造函数与类名保持一致。
- 实例方法(instance methods)。实例方法与静态方法的不同：实例方法可以访问和操作实例变量。
- 作用域(scope)。在实现实例方法时，会使用三种变量：参数变量、局部变量、实例变量。前两个与静态方法一样：参数变量的作用域是整个函数体；局部变量的作用域是从它被定义之后的块体。而实例变量的作用域是整个类。

#### 数据类型的设计

暂时先跳过。

#### 常见问题

- 创建对象数组：如果要创建一个有N个对象的数组，需要使用N+1次`new`——一次用来初始化数组，其他N次用来创建对象。正确的方法：

```java
Counter[] a = new Counter[2];
a[0] = new Counter("test");
```

- 什么是指针？`p.111`给出了详细的解释。

### 1.3 Bags, Queues, and Stacks

#### 一些基本概念

**泛型(generics)** 是一种参数化的数据类型，而不具体指明是哪种。这样可以简化类的实现（否则对每个数据类型都要实现一遍，就很麻烦）。

与泛型联系的概念是基本数据类型的**自动封装(autoboxing)**和解封装。

**Iterable collections** 不知道怎么翻译...迭代集？意思就是用迭代器遍历存放对象的数据结构，这是Java语言一种很方便的设计，因为我们在遍历时无需知道对象的具体结构了。很多高级编程语言也支持这种特性。

#### Bags

- 我理解的，bag是类似于set的东西，不同的是元素可以重复。


- bag不支持移除元素。bag的目的是为用户提供收集元素、访问已收集元素的服务。遍历元素的顺序是不确定的，对用户而言也是无关紧要的。

#### FIFO queues

基本的数据结构——先入先出队列。`p.126`举了一个连续读入整数存入整数数组的例子，就是利用了队列：先从输入流把数据存入队列，于是就可以根据队列大小申请数组大小；再让所有整数出队，并存入数组中。

不过个人感觉这样读入是不是效率低了些...因为有入队和出队的开销。但是好处似乎也是有的，就是不用事先知道有多少整数，而是通过建立队列知道数组要开多大；而如果直接用数组就无法准确知道预分配的大小。

#### Pushdown stacks

就是我们通常所说的栈。这里指的是“从上往下”压栈的方式，实际中还有“从下往上”压栈的方式。对应的就是大端存储和小端存储？

##### 算术表达式的模拟

`p.128`讲了如何用栈实现对算术表达式的解析。其实就是用栈模拟递归的一种形式。一个非常简单的算法是Dijkstra前辈于1960年提出来的。基本思想是维护两个栈，一个用来存放运算对象(operand stack)，一个用来存放运算符(operator stack)。从左到右遍历算术表达式，并执行如下操作：

- 把运算对象放入operand stack
- 把运算符放入operator stack
- 忽略左括号
- 一旦遇到一个右括号，pop出一个运算符，pop出对应的运算对象（单目运算符pop出一个，双目运算符pop出两个），然后把运算结果放入operand stack

最终operator stack空，operand stack中只有一个运算对象，它就是整个算术表达式的结果。

需要加载的库：

```java
import edu.princeton.cs.algs4.*;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
```

代码：

```java
public static void expressionEvaluate(String[] args) {
	Stack<String> ops = new Stack<String>();
	Stack<Double> vals = new Stack<Double>();
    // 重定向输入流：从文件输入
	try {
		FileInputStream input = new FileInputStream("tempString.txt");
		System.setIn(input);
	} catch (FileNotFoundException e) {
		e.printStackTrace();
	}

	while (!StdIn.isEmpty()) {
		String s = StdIn.readString();
		if (s.equals("("))         {}
		else if (s.equals("+"))    ops.push(s);
		else if (s.equals("-"))    ops.push(s);
		else if (s.equals("*"))    ops.push(s);
		else if (s.equals("/"))    ops.push(s);
		else if (s.equals("sqrt")) ops.push(s);
		else if (s.equals(")")) {
			String op = ops.pop();
			double v = vals.pop();
			if (op.equals("+"))         v = vals.pop() + v;
			else if (op.equals("-"))    v = vals.pop() - v;
			else if (op.equals("*"))    v = vals.pop() * v;
			else if (op.equals("/"))    v = vals.pop() / v;
			else if (op.equals("sqrt")) v = Math.sqrt(v);
			vals.push(v);
		}
		else vals.push(Double.parseDouble(s));
	}
	StdOut.println(vals.pop());
}
```

上面的处理假定表达式有完整的括号（最外层也有）。其中`tempString.txt`中即存放所要解析的算术表达式，如`( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) )`，对应输出为`101.0`；再如`( ( 1 + sqrt ( 5.0 ) ) / 2.0 )`，对应输出为`1.618033988749895`。

这个算法的复杂度是O(n)。

#### Implementing collections

本节讲的是在实现Bag, Stack和Queue之前，先实现一些基本的框架。这个"collections"大概就是对数据结构的一种统称吧，即存储同类对象的逻辑结构。

##### Fixed-capacity stack

一个非常简单的栈模型，只能存储String，要求用户定义容量，不支持迭代器。

文中说道：

> The primary choice in developing an API implementation is to choose a representation for the data.

一个显然的选择是用String数组。用一个数组`a[]`存放实例变量，用一个整数`N`统计栈中元素的个数。须满足的特性：

- 数组中的元素按插入的顺序排列
- 当`N`是`0`的时候，栈为空
- 栈不空时，栈顶是`a[N-1]`

实现：

```java
public class FixedCapacityStackOfStrings {
    private String[] a;
    private int N;

    public FixedCapacityStackOfStrings(int cap) {
        a = new String[cap];
    }

    public boolean isEmpty() {
        return N == 0;
    }

    public int size() {
        return N;
    }

    public void push(String item) {
        a[N++] = item;
    }

    public String pop() {
        return a[--N];
    }
}
```

上面的实现就是最简单的栈模型，但是这个实现只是玩具程序，有很多缺点，后面会在这个基础上设计更实用的数据结构。

##### 泛型

在`FixedCapacityStackOfStrings`的实现中，第一个要改进的地方就是适应所有的对象，而不仅仅是`String`，即使用泛型。方法是将代码中所有的`String`改为`Item`，另外在类名后面加一个后缀`<Item>`，于是将实现改为如下：

```java
public class FixedCapacityStack<Item> {
    private Item[] a;
    private int N;

    public FixedCapacityStack(int cap) {
        a = (Item[]) new Object[cap];
    }

    public boolean isEmpty() {
        return N == 0;
    }

    public int size() {
        return N;
    }

    public void push(Item item) {
        a[N++] = item;
    }

    public Item pop() {
        return a[--N];
    }
}
```

使用了Java中的关键词`Item`来表示泛型，是用来代表类型的参数。注意创建泛型数组的方式，有一个疑问：为什么不写成`a = new Item[cap]`来创建数组？书中说这是由于`历史和技术`的原因导致Java不允许这种方式。所以就有了这种写法：`a = (Item[]) new Object[cap]`。确实即使是这么写编译器也会警告，只不过我们可以安全地忽略它。我可以把它理解成强制类型转换嘛...而且是强制类型转换成泛型数组...

##### Array resizing

第二个要改进的地方就是尽量避免用户自己指定内存空间的大小（如果用户申请了很小的内存空间，则可能导致数组越界；而如果申请了很大的内存空间，则可能造成浪费），而是自适应地调整。

实现的思路很简单：当push元素时，将原数组的内容拷贝到一个空间更大的数组；当pop元素时，则将原数组的内容拷贝到一个空间更小的数组。这让我想到了C++里`vector`的实现，它的动态数组机制也是这样的方式。

首先，把数组的长度扩大为`max`。其实是将原数组的内容拷贝到另一个长度为`max`的数组：

```java
private void resize(int max) {
	// N <= max
	Item[] temp = (Item[]) new Object[max];
	for (int i = 0; i < N; i++) {
		temp[i] = a[i];
	}
	a = temp;
}
```

注意最后一句的引用赋值，`a`指向了新的内存空间，原来的内存空间并没有处理，Java的垃圾回收机制会完成这一工作。

然后，当push元素时，检查数组是否已满，即判断已经放入的元素数量有没有达到数组的长度，如果是，就把所有元素拷贝到一个长度为原来两倍的数组中，即执行`resize(2*a.length)`，之后再放入新的元素：

```java
public void push(Item item) {
	if (N == a.length) {
		resize(2*a.length);
	}
	a[N++] = item;
}
```

类似地，当pop元素时，先去掉栈顶元素(`--N`)。再检查数组是否盈余过多，是否「盈余过多」的标准不唯一，通常的做法是看已有元素数量是否小于数组长度的`1/4`，如果是，则表示盈余过多，就将数组长度减半，即`resize(a.length/2)`：

```java
public Item pop() {
	Item item = a[--N];
	a[N] = null;  // Avoid loitering
	if (N > 0 && N == a.length/4) {
		resize(a.length/2);
	}
	return item;
}
```

##### Loitering

这个单词是「闲逛，游手好闲」的意思，这是一种隐式的内存泄漏问题，就是指在上面的`pop()`函数中，我们用`a[--N]`模拟「弹出栈顶元素」这一动作，但是实际上数据还是保存在内存里的，而它也不会再被访问，Java的垃圾回收机制也无法处理这种现象，因此这个数据就成为了「孤儿」，即Loitering现象。要避免这种情况，只要把对应的元素置为`null`即可。其实，申请泛型数组的内存时，也是初始化为`null`的。

##### Iteration (迭代)

回顾使用`String`类的迭代器进行遍历的操作：

```java
Stack<String> collection = new Stack<String>();
...
Iterator<String> it = collection.iterator();
while (i.hasNext()) {
    String s = i.next();
    ...
}
```

或者用*foreach*操作：

```java
for (String s : collection)
    ...
```

类似地，为了让我们自己定义的类可迭代，须要完成以下两个工作：

- 实现方法`iterator()`，它返回对象的迭代器（迭代器也是一个类），对于泛型，为`Iterator<Item>`。
- 实现迭代器`Iterator`，它有两个方法：`hasNext()`（返回值是`boolean`类型），以及`next()`（返回对象）

为了让一个类是iterable的，首先须要在声明这个类时加上语句`implements Iterable<Item>`。然后，实现`iterator()`方法，我们将马上要实现的迭代器命名为`ReverseArrayIterator`（栈是反向遍历）：

```java
public Iterator<Item> iterator() {
	return new ReverseArrayIterator();
}
```

Java提供了实现迭代器的接口，定义如下（`java.util.Iterator`）：

```java
public interface Iterator<Item> {
    boolean hasNext();
    Item next();
    void remove();
}
```

通常，`remove()`方法可以不用实现。于是，按照上面的接口，我们的迭代器`ReverseArrayIterator`实现如下（直接写在大类中，声明为`private`，这是类的嵌套写法）：

```java
// 需要: import java.util.iterator;
private class ReverseArrayIterator implements Iterator<Item> {
	private int i = N;

	public boolean hasNext() {
		return i > 0;
	}

	public Item next() {
		return a[--i];    // 从栈顶往栈底遍历
	}

	public void remove() {}
}
```

通常为了保证迭代器的健壮性，还需要针对两个情形抛出异常(throw exception)：一是当用户调用`remove()`方法时，抛出`UnsupportedOperationException`，二是当`i`为`0`时，用户仍然试图调用`next()`方法，这时抛出`NoSuchElementException`。这里就省略了~

到这里，迭代器的实现就完成了。小结一下，改进的地方有：

- 泛型化
- 内存大小自适应调整
- 避免隐式内存泄漏
- 加上迭代器功能

完整的`ResizingArrayStack`实现：

```java
public class ResizingArrayStack<Item> implements Iterable<Item> {
    private Item[] a = (Item[]) new Object[1];  // 初始化数组大小为1
    private int N = 0;

    public boolean isEmpty() {
        return N == 0;
    }

    public int size() {
        return N;
    }

    private void resize(int max) {
        // N <= max
        Item[] temp = (Item[]) new Object[max];
        for (int i = 0; i < N; i++) {
            temp[i] = a[i];
        }
        a = temp;
    }

    public void push(Item item) {
        if (N == a.length) {
            resize(2*a.length);
        }
        a[N++] = item;
    }

    public Item pop() {
        Item item = a[--N];
        a[N] = null;  // Avoid loitering
        if (N > 0 && N == a.length/4) {
            resize(a.length/2);
        }
        return item;
    }

    public Iterator<Item> iterator() {
        return new ReverseArrayIterator();
    }

    private class ReverseArrayIterator implements Iterator<Item> {
        private int i = N;

        public boolean hasNext() {
            return i > 0;
        }

        public Item next() {
            return a[--i];    // 从栈顶往栈底遍历
        }

        public void remove() {}
    }
}
```

这个基本模型的实现可谓「麻雀虽小，五脏俱全」。

#### Linked lists

Linked list这个最基本且重要的数据结构就不多说了，再复习一下定义：

> A linked list is a recursive data structure that is either empty (null) or a reference to a node having a generic item and a reference to a linked list.

其抽象类为：

```java
private class Node {
    Item item;
    Node next;
}
```

##### 构建一个链表

以创建字符串节点为例，首先创建节点实体：

```java
Node first = new Node();
Node second = new Node();
Node third = new Node();
first.item = "to";
second.item = "be";
third.item = "or";
```

建立连接关系：

```java
first.next = second;
second.next = third;
```

##### 链表的基本操作

- 在头部插入节点
- 删除头结点(`first = first.next`)
- 在尾部插入节点
- 在任意位置插入/删除节点

##### 链表的遍历

```java
for (Node x = first; x != null; x = x.next) {
    ...
}
```

##### 用链表实现栈（链式栈）

栈顶位于链表的头部，栈的push通过在头部插入节点完成，栈的pop通过删除头节点完成。

之间用数组实现栈存在效率问题，主要是`resize()`函数导致的，因为涉及到对整个栈内存的拷贝。而如果用链表实现栈，就不存在这个问题了，对栈的操作与栈的大小是无关的。最优设计原则即：

- 适用于任何数据类型（支持泛型）
- 空间需求与放入的元素数量成正比（无空间浪费）
- 操作的时间效率与数据结构的规模无关（O(1)时间的基本操作）

> The algorithms and data structure go hand in hand.

完整的`Stack`类实现：

```java
public class Stack<Item> implements Iterable<Item> {
    private Node first;
    private int N;

    private class Node {
        Item item;
        Node next;
    }

    public boolean isEmpty() {
        return first == null;  // 或者: N == 0
    }

    public int size() {
        return N;
    }

    public void push(Item item) {
        Node oldfirst = first;
        first = new Node();
        first.item = item;
        first.next = oldfirst;
        N++;
    }

    public Item pop() {
        Item item = first.item;
        first = first.next;
        N--;
        return item;
    }

    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    private class ListIterator implements Iterator<Item> {
        private Node current = first;

        public boolean hasNext() {
            return current != null;
        }

        public Item next() {
            Item item = current.item;
            current = current.next;
            return item;
        }
    }
}
```

友情提醒：别忘了`import java.util.Iterator;`

##### 用链表实现队列（链式队列）

在链式栈的实现上稍加修改，就可以实现队列。链表的头、尾分别代表队列的头和尾，维护两个指针指向链表的头和尾，入队操作通过在链表尾部插入节点实现，出队操作通过删除链表头节点来实现。这也符合最优设计。

完整的`Queue`类实现：

```java
public class Queue<Item> implements Iterable<Item> {
    private Node first;
    private Node last;
    private int N;

    private class Node {
        Item item;
        Node next;
    }

    public boolean isEmpty() {
        return first == null;  // 或者: N == 0
    }

    public int size() {
        return N;
    }

    public void enqueue(Item item)  {
        Node oldLast = last;
        last = new Node();
        last.item = item;
        last.next = null;
        if (isEmpty()) first = last;
        else oldLast.next = last;
        N++;
    }

    public Item dequeue() {
        Node oldFirst = first;
        first = first.next;
        if (isEmpty()) last = null;
        N--;
        return oldFirst.item;
    }

    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    private class ListIterator implements Iterator<Item> {
        private Node current = first;

        public boolean hasNext() {
            return current != null;
        }

        public Item next() {
            Item item = current.item;
            current = current.next;
            return item;
        }
    }
}
```

##### 用链表实现包(bag)

`Bag`的实现其实比`Stack`和`Queue`都简单，只要把`Stack`的`push()`改为`add()`，另外去掉`pop()`方法即可。

完整的`Bag`实现：

```java
public class Bag<Item> implements Iterable<Item> {
    private Node first;
    private int N;

    private class Node {
        Item item;
        Node next;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public int size() {
        return N;
    }

    public void add(Item item) {
        Node oldFirst = first;
        first = new Node();
        first.item = item;
        first.next = oldFirst;
        N++;
    }

    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    private class ListIterator implements Iterator<Item> {
        private Node current = first;

        public boolean hasNext() {
            return current != null;
        }

        public Item next() {
            Item item = current.item;
            current = current.next;
            return item;
        }
    }
}
```

`Bag`, `Stack`和`Queue`类的迭代器实现部分都一样。

#### 常见问题

- 并不是所有的编程语言都有泛型（早期的Java也没有），怎么办？一种办法是对每一种类型都实现一次；还有一种是建立一个存放各种对象的栈。
- 为什么Java不支持泛型数组？历史问题。当前也正在研究中。
- 如何创建一个数组，其中每个元素是一个存放字符串的栈？`Stack<String>[] a = (Stack<String>[]) new Stack[N]`
- 对于数组，可以使用*foreach*遍历吗？可以。
- 对于`String`，可以使用*foreach*遍历吗？不可以。`String`没有实现迭代器。
- 为什么不创建一个这样的数据类型：它支持添加元素、删除元素、迭代、返回某个元素...以及所有我们想要的功能，这样不是就可以只实现一个类了吗？答：需要提醒的是，这样的实现被称为宽接口(wide interface)。Java其实提供了这样的实现，比如`java.util.ArrayList`, `java.util.LinkedList`等。为什么要尽量避免使用它们呢？一个原因是没法保证所有的操作都是高效的，另一个原因是*they enforce a certain discipline on client programs, which makes client code much easier to understand*。

### 1.4 Analysis of Algorithms

由于有基础，算法分析这一节可以快速阅读，里面的实验就省略了，都能理解（感觉这节还真是啰嗦啊~）。

书上`p.185`有一些级数的阶的近似，最好能够熟悉。

#### 2-sum快速算法

idea: 如果`a[i]`是一对2-sum中的一个，那么另一个一定是`-a[i]`。

- 首先对数组`a`按从小到大排序
- 遍历数组，对每个`a[i]`，二分搜索`-a[i]`，如果返回的下标大于`i`，就将计数器加`1`（要求大于`i`是为了避免重复统计）

算法复杂度是O(n log n)。

代码(要`import java.util.Arrays;`)：

```java
public class TwoSumFast {
    public static int count(int[] a) {
        Arrays.sort(a);
        int N = a.length;
        int cnt = 0;
        for (int i = 0; i < N; i++) {
            if (BinarySearch.rank(-a[i], a) > i) {
                cnt++;
            }
        }
        return cnt;
    }

    public static void main(String[] args) {
        int[] a = In.readInts(args[0]);
        StdOut.println(count(a));
    }
}
```

#### 3-sum快速算法

类似2-sum，idea: 如果`a[i], a[j]`是一个3-sum中的两个数，那么第三个数一定是`-(a[i]+a[j])`。

算法类似2-sum，这里不再描述。复杂度是O(n^2 log n)

代码：

```java
public class ThreeSumFast {
    public static int count(int[] a) {
        Arrays.sort(a);
        int N = a.length;
        int cnt = 0;
        for (int i = 0; i < N; i++) {
            for (int j = i + 1; j < N; j++) {
                if (BinarySearch.rank(-(a[i]+a[j]), a) > j) {
                    cnt++;
                }
            }
        }
        return cnt;
    }

    public static void main(String[] args) {
        int[] a = In.readInts(args[0]);
        StdOut.println(count(a));
    }
}
```

后面关于Memory分析的部分实在是没有阅读欲望，比较枯燥，有些部分就直接跳过了，以后有需要再回来补上。

### 1.5 Case Study: Union-Find

吐槽：第一章直接拿并查集来作为case study，与本章讲解的内容似乎并没有什么逻辑关系...难道不应该放在图论部分吗？

又想到了曾经看过的一篇文章，我至今认为它是对并查集最易懂且最有趣的讲解。文章的作者已无从考究，这是一篇转载: http://www.cnblogs.com/ACShiryu/archive/2011/11/24/unionset.html

#### Quick-union

这是最基本的并查集算法。

```java
public class UF {
    private int[] id;
    private int count;

    public UF(int N) {
        // 初始化连通分量
        count = N;
        id = new int[N];
        for (int i = 0; i < N; i++)
            id[i] = i;
    }

    public int count() {
        return count;
    }

    public boolean connected(int p, int q) {
        return find(p) == find(q);
    }

    public int find(int p) {
        while (id[p] != p) p = id[p];
        return p;
    }

    public void union(int p, int q) {
        int pRoot = find(p);
        int qRoot = find(q);
        if (pRoot == qRoot) return;

        id[pRoot] = qRoot;

        count--;
    }
}
```

quick-union算法中的`connected(), find(), union()`的平均时间复杂度是O(log n)。

#### Weighted quick-union

上面的算法有个缺陷：由于执行`union()`操作时是任意连接两个连通分量的，连通分量的连接受输入数据影响比较大，可能会造成很不均衡的状态。一个改进的思路是，用一个数组记录并跟踪每个连通分量（树）的节点数，每次连接两个树时，把节点数较少的树连到节点数较多的树上。

```java
public class WeightedQuickUnionUF {
    private int[] id;
    private int[] sz;
    private int count;

    public WeightedQuickUnionUF(int N) {
        count = N;
        id = new int[N];
        for (int i = 0; i < N; i++) id[i] = i;
        sz = new int[N];
        for (int i = 0; i < N; i++) sz[i] = 1;
    }

    public int count() {
        return count;
    }

    public boolean connected(int p, int q) {
        return find(p) == find(q);
    }

    public int find(int p) {
        while (p != id[p]) p = id[p];
        return p;
    }

    public void union(int p, int q) {
        int i = find(p);
        int j = find(q);
        if (i == j) return;

        if (sz[i] < sz[j]) { id[i] = j; sz[j] += sz[i]; }
        else               { id[j] = i; sz[i] += sz[j]; }
        count--;
    }
}
```

这样，如果有N个节点，最坏情况下，最后构造的森林中所有节点的深度也不会超过log n。从而的算法的`connected(), find(), union()`的最坏时间复杂度就被降到了O(log n)。

在实际中，真正实用的算法是weighted quick-union，其时间复杂度是O(m log n)，其中m是连接数（边数），n是节点数。

#### 路径压缩

观察上面的代码，可以看出，weighted quick-union的效率瓶颈就在于`find()`函数，怎样可以更快地查找呢？一个idea就是：修改`find()`函数，想办法将搜索根节点过程中遇到的节点直接连到根上。这就是所谓的**路径压缩(path compression)**。路径压缩的实现非常容易，只要稍稍修改一下`find()`函数即可：用一个变量保存根节点，再走一遍刚才的搜索路径，将路径上所有节点的`id[]`值为根节点即可：

```java
public int find(int p) {
	int r;  // 根节点
	int cur = p;
	while (cur != id[cur]) {
		cur = id[cur];
	}
	r = cur;
	// 路径压缩
	cur = p;
	int tmp;
	while (cur != r) {
		tmp = id[cur];
		id[cur] = r;
		cur = tmp;
	}

	return r;
}
```

虽然看起来是增加了一个循环，但是却能将搜索的效率大大提升，能使搜索的效率接近常数级（平摊复杂度并不是严格的常数级），尤其在数据规模很大的时候。带路径压缩的weighted quick-union的算法分析十分复杂，理论分析已经证明了它是union-find问题的**最优**算法。

#### 方法论

在这一节的最后总结了解决问题的一些基本步骤，还是挺好的：

- 彻底并且具体地明确问题，包括弄清楚问题内在的基本抽象操作，以及合理地设计API。
- 先考虑最直接的算法，仔细地设计一个简洁的实现；然后认真地设计测试，尽可能模拟实际场景下的输入。
- 要知道当前的实现无法解决什么样规模的问题。
- 通过一步步的提炼来改进算法，并结合经验和数学分析验证其效果。
- 寻找数据结构或算法更高级的抽象，以更好地优化算法。
- 保证对典型的输入能有好的性能，必要时也要努力保证最坏情况的性能。
- 知道何时应该将更深层的优化和研究细节交给研究者们，然后继续解决下一个问题（及时放手）。