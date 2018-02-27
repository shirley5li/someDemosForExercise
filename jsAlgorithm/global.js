/** 检测字符串是否为回文 **/
function checkPalindrome(str) {
    return str == str.split('').reverse().join('');
}

/** 整型数组去重 **/
function uniqueArr(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) === i) {
            result.push(arr[i]);
        }
    }
    return result;
}

/** 统计一个字符串中出现次数最多的字母 **/
function maxDuplicateLetter(str) {
    //如果字符串仅有一个字符，即为该字符
    if (str.length === 1) {
        return str;
    }
    var letterObj = {};
    for (var i = 0; i < str.length; i++) {
        if (!letterObj[str[i]]) { //存放字母的对象中还未记录过该字母出现的次数
            letterObj[str[i]] = 1;
        }
        letterObj[str[i]] += 1;
    }
    //接下来寻找存放字母的对象中最大的value所对应的key
    var maxValue = 1;
    var maxKey = '';
    for (var key in letterObj) {
        if (letterObj[key] > maxValue) {
            maxValue = letterObj[key];
            maxKey = key;
        }
    }
    return maxKey;
}

/** 冒泡排序 **/
function bubbleSort(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            // 由小到大排序
            if (arr[j] > arr[j + 1]) {
                var swap = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = swap;
            }
        }
    }
    return arr;
}

/** 快速排序 **/
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var referValue = arr[0];
    var leftArr = [];
    var rightArr = [];
    // 由小到大排序
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < referValue) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }
    return quickSort(leftArr).concat([referValue], quickSort(rightArr));
}

/** 不借助临时变量，进行两个整数的交换 **/
function swap([a, b]) {
    var b = b - a;
    var a = a + b;
    var b = a - b;
    return [a, b];
}

/** 生成长度为n的斐波那契数列 **/
function generateFibo(n) {
    var fiboArr = [];
    var i = 0;
    while (i < n) {
        if (i <= 1) {
            fiboArr.push(i);
        } else {
            fiboArr[i] = fiboArr[i - 1] + fiboArr[i - 2];
        }
        i++;
    }
    return fiboArr;
}

/** 找出正数组的最大差值 **/
function maxDifference(arr) {
    var minValue = arr[0];
    var maxDiffer = 0;
    for (var i = 0; i < arr.length; i++) {
        minValue = Math.min(minValue, arr[i]);
        currentDiffer = arr[i] - minValue;
        maxDiffer = Math.max(maxDiffer, currentDiffer);
    }
    return maxDiffer;
}

/** 随机生成指定长度的字符串 **/
function randomString(n) {
    var rangeStr = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var l = rangeStr.length;
    var randomStr = '';
    for (var i = 0; i < n; i++) {
        randomStr += rangeStr.charAt(Math.floor(Math.random() * l));
    }
    return randomStr;
}


/**  实现类似getElementsByClassName 的功能 **/
function queryClassName(node, name) {
    var starts = '(^|[ \n\r\t\f])',
        ends = '([ \n\r\t\f]|$)';
    var resultArr = [],
        reg = new RegExp(starts + name + ends),
        elements = node.getElementsByTagName("*");
    length = elements.length,
        i = 0;
    while (i < length) {
        var element = elements[i];
        if (reg.test(element.className)) {
            resultArr.push(element);
        }
        i++;
    }
    return resultArr;
}
// 方法2
function queryClassName2(node, name) {
    var elements = node.getElementsByTagName("*"),
        length = elements.length,
        resultArr = [];
    for (var i = 0; i < length; i++) {
        if (elements[i].className) {
            var classNames = elements[i].className.split(" "); /*这里其实还要考虑类名间隔大于一个空格的情况*/
            if (classNames.indexOf(name) !== -1) {
                resultArr.push(elements[i]);
            }
        }
    }
    return resultArr;
}
window.onload = function () {
    node = document.getElementById("ull");
    queryClassName(node, "box");
    queryClassName2(node, "box");
};

/** JS 实现二叉查找树(Binary Search Tree) **/
//设定每个节点的数据结构
class Node {
    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}
// 构建BST，具备一个根节点、以及添加、查找、删除节点的方法
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    // 插入节点的方法
    insert(data) {
        let n = new Node(data, null, null);
        if (!this.root) { //如果此二叉树为空，则数据项从树的root节点处开始插入
            return this.root = n;
        }
        let currentNode = this.root;
        let parent = null;
        while (true) {
            parent = currentNode; //保存当current变为null之前的那一个父节点
            if (data < currentNode.data) { //插在父节点的左节点
                currentNode = currentNode.left;
                if (currentNode === null) { //不断向左node寻找是否为null
                    parent.left = n;
                    break;
                }
            } else { //插在父节点的右节点
                currentNode = currentNode.right;
                if (currentNode === null) {
                    parent.right = n;
                    break;
                }
            }
        }
    }
    // 删除数据项
    remove(data) {
        this.root = this.removeNode(this.root, data);
    }
    // 删除节点
    // 删除树中与给定值相同的节点，如果树中没有相同值的节点，则不做处理，应该保证处理之后的树仍是二叉查找树。
    removeNode(node, data) {
        if (node === null) { // 如果根节点为空
            return null;
        }
        if (data === node.data) {
            // 没有子节点，即node为叶子节点
            if (node.left === null && node.right === null) {
                return null;
            }
            // 要删除的节点下只有右节点
            if (node.left === null) {
                return node.right;
            }
            // 要删除的节点下只有左节点
            if (node.right === null) {
                return node.left;
            }
            // 要删除的节点下有两个子节点的情况
            // getSmallest用于找到该节点右子树中的最小节点，用以替代要删除的节点，然后删除此最小节点
            let getSmallest = function (node) {
                if (node.left === null && node.right === null) {
                    return node;
                }
                if (node.left !== null) {
                    return node.left;
                }
                if (node.right !== null) {
                    return getSmallest(node.right);
                }
            }
            let temNode = getSmallest(node.right);
            node.data = temNode.data;
            node.right = this.removeNode(temNode.right, temNode.data);
            return node;
        } else if (data < node.data) {
            node.left = this.removeNode(node.left, data);
            return node;
        } else {
            node.right = this.removeNode(node.right, data);
            return node;
        }
    }
    // 查找方法
    find(data) {
        let currentNode = this.root;
        while (currentNode !== null) {
            if (data === currentNode.data) {
                return true;
            }
            if (data < currentNode.data) {
                if (currentNode.left !== null) {
                    currentNode = currentNode.left;
                } else {
                    return false;
                }
            } else {// data > currentNode.data
                if (currentNode.right !== null) {
                    currentNode = currentNode.right;
                } else {
                    return false;
                }
            }
        }
    }
}

// var q1result = document.getElementById("q1result");
// var q1test = document.getElementById("q1test");
// q1test.onclick = function() {
//     var str = document.getElementById("q1input").value;//获取输入文本框中的值
//     q1result.innerHTML = checkPalindrome(str);
// };

// window.onload = function() {
//     var arr = [1,13,24,11,11,14,1,2];
//     var result = uniqueArr(arr);
//     console.log(result);
// };