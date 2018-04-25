# [demo展示](http://shirley5li.me/someDemosForExercise/tictactoe-app/public/index.html) #

# 开发环境准备 #
**1、** 创建一个新的项目。

新建文件夹`TicTacToe-ReactApp`，然后git bash到该文件夹，使用以下命令创建react app `tictactoe-app`。

``` js
create-react-app tictactoe-app
```

---

**注意：** 由于之前已经全局安装过`create-react-app`命令行工具了，所以此处可以直接使用`create-react-app tictactoe-app`命令创建react应用，若没有事先安装`create-react-app`命令行工具,先通过`npm install -g create-react-app`全局安装。

---

**2、** 删除新项目 `src/` 文件夹中的所有文件（不要删除文件夹，只删除里面的文件）。

**3、** 在 `src/` 文件夹中添加一个名为 `index.css` 的文件，这个文件中包含 CSS代码 。

**4、** 在 `src/` 文件夹中添加一个名为 `index.js` 的文件，这个文件中包含的 JS 代码。 

**5、** 在 src/ 文件夹 index.js 的文件中，在其顶部添加以下几行代码：

	import React from 'react';
	import ReactDOM from 'react-dom';
	import './index.css';

	ReactDOM.render(
    <h1>hello world</h1>,
    document.getElementById('root')
	);


---

** <font color="red">补充：</font>** [git bash下操作文件及文件夹命令](https://www.cnblogs.com/SamWeb/p/6516784.html)，常用命令如下：

`cd` -->切换到哪个目录下， 如 `cd e:\fff`，表示切换 E 盘下面的fff 目录。

`cd .. ` -->回退到上一个目录。

`pwd` -->打印工作目录(print working directory)，它会显示我们当前所在的目录路径。

`ls` -->列出当前目录中的所有文件，只不过ll(两个ll)列出的内容更为详细。。

`touch` -->新建一个文件， 如 `touch index.js` 就会在当前目录下新建一个index.js文件。

`rm` -->删除一个文件, `rm index.js` 就会把index.js文件删除。

`mkdir` -->新建一个目录，即新建一个文件夹. 如 `mkdir src` 新建src 文件夹。

`rm -r` -->删除一个文件夹，如 `rm -r src` 删除src目录。 r (recusive，递归)， 删除用的就是递归，先删除文件夹里面的内容，再删除文件夹。

`mv` -->移动文件，如 `mv index.html src`，index.html为要移动的文件, src 是目标文件夹,当然, 这样写,必须保证文件和目标文件夹在同一目录下。

`reset` --> 清屏，把git bash命令窗口中的所有内容清空。

---


**6、** 在项目文件夹中，即cd到`/tictactoe-app`下，运行`npm start`，在浏览器打开 `http://localhost:3000`，会看到一个`hello world`。

---

**注意：** 此处运行`npm start`后，提示我说3000端口被占用了，我以为是之前的react项目直接关掉，端口还在占用中的缘故，但查看了下任务管理器，没有进程在占用3000端口，就不知道为何了，只好选择修改react应用的默认启动端口.....

于是取搜索了一波修改react项目默认端口的方法，以下博客讲的不错[React启动查看http://localhost:3000的原因](https://www.jianshu.com/p/6effa6f8059b)，该博客中讲了两种方法：

第一种：在`\node_modules\react-scripts\scripts/start.js`中，修改默认的端口号为3001，`const DEFAULT_PORT=parseInt(process.env,PORT,10)||3001;`。

第二种：在packjson.json中将`"scripts"`中的`"start": "react-scripts start"`改为`"start": "set PORT=3001&&react-scripts start"`。其实，第二种方法追本溯源也是修改了第一种方法中的start.js文件。使用第二种方法解决了端口被占用的问题。

**这里又遇到问题：**

(1) 在ReactDOM.render()方法中，html标签支持jsx语法自动补全的问题，修改emmet的配置文件，在`文件->首选项->设置`中，修改以下用户设置：


	"emmet.triggerExpansionOnTab": true,
	    "emmet.includeLanguages": {
	        "javascript": "javascriptreact"
	    }


(2) jshint 提示reactDOM.render()中的html标签尖括号有问题，但是搜索了下也还没找到解决办法。[前端系列——React开发必不可少的eslint配置](https://segmentfault.com/a/1190000013062992)。

---

# React学习 #
React是一个声明式的，高效的，并且灵活的用于构建用户界面的 JavaScript 库。

## 组件 ##
自定义组件类继承自`React.Component`，组件接收参数，称为 props(属性)，并通过 render 方法返回一个显示的视图层次结构。如下所示：

``` js

	class ShoppingList extends React.Component {
	  render() {
	    return (
	      <div className="shopping-list">
	        <h1>Shopping List for {this.props.name}</h1>
	        <ul>
	          <li>Instagram</li>
	          <li>WhatsApp</li>
	          <li>Oculus</li>
	        </ul>
	      </div>
	    );
	  }
	}
```

`render` 返回一个 React 元素。

**PS：** React的知识点较多，具体可参考[React开发文档](http://www.css88.com/react/docs/hello-world.html)。

# 开始游戏项目 #
## 构建应用的外壳 ##
由三部分组成，即由三个组件组成，分别是`Square(方格)`、`Board(棋盘)`、`Game(游戏)`，使用类的方法定义组件。

`Square(方格)` 组件渲染一个单独的 `<button>`， `Board(棋盘)` 会渲染 9 个 `Square(方格)` ，而 `Game(游戏)` 组件会渲染一个 `Board(棋盘)`。该阶段设计的组件均渲染的静态结构，还没有涉及交互功能。

在`src/index.js`文件中，写以上三个组件，将样式定义在`index.css`文件中。

js代码如下：

``` js
	import React from 'react';
	import ReactDOM from 'react-dom';
	import './index.css';
	
	//定义小方格组件
	class Square extends React.Component {
	    render() {
	        return (
	            <button className="square">
	                {/* TODO */}
	            </button>
	        );
	    }
	}
	
	//定义棋盘组件
	class Board extends React.Component {
	    renderSquare(i) {
	        return <Square />;
	    }
	
	    render() {
	        const status = 'Next player: X';
	        return (
	            <div>
	                <div className="status">{status}</div>
	                <div className="board-row">
	                    {this.renderSquare(0)}
	                    {this.renderSquare(1)}
	                    {this.renderSquare(2)}
	                </div>
	                <div className="board-row">
	                    {this.renderSquare(3)}
	                    {this.renderSquare(4)}
	                    {this.renderSquare(5)}
	                </div>
	                <div className="board-row">
	                    {this.renderSquare(6)}
	                    {this.renderSquare(7)}
	                    {this.renderSquare(8)}
	                </div>
	            </div>
	        );
	    }
	}
	
	//定义游戏组件
	class Game extends React.Component {
	    render() {
	        return (
	            <div className="game">
	                <div className="game-board">
	                    <Board />
	                </div>
	                <div className="game-info">
	                    <div>{/* status */}</div>
	                    <ol>{/* TODO */}</ol>
	                </div>
	            </div>
	        );
	    }
	}
	
	ReactDOM.render(
	    <Game />,
	    document.getElementById('root')
	);
	
	// 玩家获胜时的情况
	function calculateWinner(squares) {
	
	    //三个子落在一条直线上即获胜
	    const lines = [
	        [0, 1, 2],
	        [3, 4, 5],
	        [6, 7, 8],
	        [0, 3, 6],
	        [1, 4, 7],
	        [2, 5, 8],
	        [0, 4, 8],
	        [2, 4, 6]
	    ];
	    for (let i = 0; i < lines.length; i++) {
	        const [a, b ,c] = lines[i];
	        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
	            return squares[a];
	        }
	    }
	    return null;
	}
```

此阶段的静态效果如图:

![组件静态结构](http://ou3oh86t1.bkt.clouddn.com/react-tictactoe/%E7%BB%84%E4%BB%B6%E9%9D%99%E6%80%81%E7%BB%93%E6%9E%84.png)

## 通过props传递数据 ##
从`Board	(棋盘)` 组件传递一些数据到 `Square(方格)` 组件。

在 `Board(棋盘)` 组件的 `renderSquare` 方法中，更改代码以将 `value` prop(属性) 传递给 `Square(方格)` 组件：

``` js
	class Board extends React.Component {
	  renderSquare(i) {
	    return <Square value={i} />;
	  }
```

然后修改 `Square(方格)` 的`render`方法，通过使用 `{this.props.value}` 替换 `{/* TODO */}` 来显示该值。

## 交互式组件 ##
更改 `Square(方格)`组件 的`render()`方法，给`<button>`标签添加`onClick`属性，可以增加点击方格的互动效果。

React 组件可以通过在构造函数中设置 `this.state` 来拥有 state(状态) ，构造函数应该被认为是组件的私有。

可以在 `Square(方格)` 组件的 `state(状态)` 中存储当前值，并在单击方格时更改它,然后通过`<button>{this.state.value}</button>`显示出`X`。修改`Square`组件如下：

``` js

	//定义小方格组件
	class Square extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            value: null
	        };
	    }
	    render() {
	        return (
	            <button className="square" onClick={() => {this.setState({value: 'X'})}}>
	                {this.state.value}
	            </button>
	        );
	    }
	}
```

**注意：** 在 JavaScript classes(类)中，当定义子类的构造函数时，你需要显式调用 `super()`; 

每当 `this.setState` 被调用时，都会计划对组件的更新，导致 React 合并传递的 `state`(状态) ，更新和渲染组件及其子组件。 当组件渲染完成时，`this.state.value` 的值将是 `'X'` ，所以你会在网格中看到一个 `X` 。

## state(状态)提升 ##
现在拥有一个 tic-tac-toe 游戏的基本构建块。但是现在， `state(状态)` 被封装在每个 `Square(方格)` 组件中。要做一个完整的游戏，我们现在需要将 `X` 和 `O` 放置在方格中，并且检查一个玩家是否赢得了比赛。要检查有人是否赢了比赛，我们需要在一个地方能获取所有 9 个方格的值，而不是分裂在每个 `Square(方格)` 组件上。

最好的解决办法是将 `state(状态)` 存储在 `Board(棋盘)` 组件中，而不是在每个 `Square(方格) `组件中，而 `Board(棋盘)` 组件可以告诉每个 `Square(方格)` 组件要显示什么。

**当要聚合来自多个子节点的数据 或 使两个子组件之间相互通信时，提升 `state(状态)` ，使其存储在父组件中。父组件可以通过 `props`(属性) 把 `state`(状态) 传递回子组件，以使子组件始终与父组件同步。**

在 `Board(棋盘)` 组件中添加一个构造函数，并设置其初始 `state(状态)` 为包含一个具有 9 个空值的数组，对应 9 个方格。`Board(棋盘)` 组件现在存储了那些已经填充的方格，需要一些方法来使 `Square(方格)` 组件 更新 `Board(棋盘)` 组件的 `state`(状态) 。由于组件的 `state`(状态) 被认为是私有的，不能从 `Square`(方格) 组件直接更新 `Board`(棋盘) 的 `state`(状态) 。

通常的模式是将一个函数从 `Board(棋盘) `组件 传递到 `Square(方格)` 组件上，该函数在方格被点击时调用。修改 `Board(棋盘)` 组件中 `renderSquare`为： 

``` js
	
	  renderSquare(i) {
	    return (
	      <Square
	        value={this.state.squares[i]}
	        onClick={() => this.handleClick(i)}
	      />
	    );
	  }
```

以上代码，把 `Board(棋盘)` 组件中 2 个的 `props`(属性) 传递给 `Square(方格` 组件：`value` 和 `onClick`。后者是一个函数，`Square(方格)` 组件 可以调用该函数。然后对 `Square(方格)` 组件进行以下更改：

    在 Square(方格) 组件的 render 中用 this.props.value 替换 this.state.value 。
    在 Square(方格) 组件的 render 中用 this.props.onClick() 替换 this.setState() 。
    从 Square(方格) 组件删除 constructor(构造函数) 定义，因为它不再需要 state(状态) 。
修改完后， `Square(方格)` 组件为：

``` js

	class Square extends React.Component {
	  render() {
	    return (
	      <button className="square" onClick={() => this.props.onClick()}>
	        {this.props.value}
	      </button>
	    );
	  }
	}

```

现在当方格被点击时，它调用由 `Board(棋盘)` 组件传递的 `onClick` 函数。点击`Square(方格)` 组件时，即点击我们的每一个小方格时，发生的事情如下：

- 内置 DOM 的 `<button>` 组件上的 `onClick` prop(属性) 告诉 React 设置一个 click 事件侦听器。
    
- 当点击按钮时，React 将调用在 `Square(方格)` 组件 `render()` 方法中定义的 onClick 事件处理程序。
    
- 这个事件处理程序调用 `this.props.onClick()` 。 `Square(方格)` 组件的 props(属性) 由 `Board(棋盘)` 组件指定。
    
- Board(棋盘) 组件将 `onClick={() => this.handleClick(i)}` 传递给 Square(方格) 组件，所以当被调用时，它会在 Board(棋盘) 组件 上运行 `this.handleClick(i)` 。
    
- 我们还没有在 Board(棋盘) 组件 上定义 `handleClick()` 方法，所以导致代码崩溃。

**注意：** DOM `<button>` 组件上的 `onClick` 对 React 而言有特殊的含义，但是我们可以在 Square(方格) 组件中调用 `onClick` prop(属性)，以及在 Board(棋盘) 组件中调用 `handleClick` 。所以，在 React 应用程序中，使用 `on*` 名称作为处理程序 prop(属性) 名称 ，`handle*`作为其实现的名称是一个常见的约定。

在 Board(棋盘) 组件 上定义 `handleClick()` 方法如下：

``` js

    handleClick(i) {
        const squares = this.state.squares.slice(); //得到this.state.squares的一份拷贝
        squares[i] = 'X';
        this.setState({square: squares});
    }
```

**注意：** 调用 `.slice()` 来复制 `squares` 数组，而不是突然改变现有的数组，[不可变数据的重要性](http://www.css88.com/react/tutorial/tutorial.html#why-immutability-is-important)。

此时，每当 Board(棋盘) 组件的 state(状态) 发生变化时， Square(方格) 组件会自动重新渲染。Square(方格) 组件不再保持自己的 state(状态) ，它从父级 Board(棋盘) 组件中接收其值，并在点击时通知其父级组件。我们称这些组件为 **受控组件**。

### 不可变数据的重要性 ###

通常有两种方式来更改数据：第一种方法是通过直接更改变量的值来改变数据。第二种方法是用包含所需更改对象的新副本来替换数据。

不直接改变数据（或更改底层数据）有一个额外的好处，可以帮助我们增强组件和整体应用性能。如下：

- 更简单的撤消/重做和步骤重现

不可变数据（Immutability）还使一些复杂的功能更容易实现。例如，在本教程中，我们将在游戏的不同阶段之间实现时间旅行。避免数据改变使我们能够保留对旧数据的引用，如果我们需要在它们之间切换。

- 追踪变更

确定可变对象是否已更改是复杂的，因为直接对对象进行更改。这样就需要将当前对象与先前的副本进行比较，遍历整个对象树，并比较每个变量和值。这个过程可能变得越来越复杂。

确定不可变对象如何改变是非常容易的。如果被引用的对象与之前不同，那么对象已经改变了。仅此而已。

- 确定何时重新渲染

React 中不可变数据最大好处在于当您构建简单的 纯(pure)组件 时。由于不可变数据可以更容易地确定是否已经进行了更改，这也有助于确定组件何时需要重新渲染。[优化性能](http://www.css88.com/react/docs/optimizing-performance.html#examples)

### 函数式组件 ###

组件分为函数式组件和类组件。函数式组件只需编写一个函数，传入 props(属性) 并返回应该渲染的内容就可以了。例如 Square(方格)组件可以写成函数式组件的形式：

``` js
	
	function Square(props) {
	  return (
	    <button className="square" onClick={props.onClick}>
	      {props.value}
	    </button>
	  );
	}
```

应用程序中的许多组件可以被改写为函数式组件：这些组件往往易于编写，而且 React 将来会更加优化它们。

## 轮流下棋 ##
默认第一个下棋动作为 ‘X’，修改 Board(棋盘) 组件 构造函数中的初始 state(状态)。

``` js

	class Board extends React.Component {
	  constructor() {
	    super();
	    this.state = {
	      squares: Array(9).fill(null),
	      xIsNext: true,
	    };
	  }
```
每次下棋，应该切换 `xIsNext` 布尔值，并保存 state(状态) 。现在更新 Board(棋盘) 组件的 `handleClick` 函数来反转 `xIsNext` 的值。

``` js

	handleClick(i) {
	        const squares = this.state.squares.slice(); //得到this.state.squares的一份拷贝
	        squares[i] = this.state.xIsNext ? 'X' : 'O';
	        this.setState({
	            squares: squares,
	            xIsNext: !this.state.xIsNext
	        });
	    }
```

现在 X 和 O 可以轮流下棋。接下来，修改 Board(棋盘) 组件 `render` 方法中的 “status” 文本，以便它还显示下一个下棋的是谁:

``` js
	const status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
```

## 获胜判断 ##
可以在 Board(棋盘) 组件的 `render` 函数中调用 `calculateWinner()` 函数来检查是否有人赢得了比赛，并且当有人获胜时，使 “status” 文本显示为 “Winner: [X/O]” ：

``` js

	  render() {
	    const winner = calculateWinner(this.state.squares);
	    let status;
	    if (winner) {
	      status = 'Winner: ' + winner;
	    } else {
	      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	    }
```

如果有人已经赢得了比赛，或者当一个方格已经被填充时，需要提前返回(即有人赢得游戏或者当前点击的方格已被填充过，需要忽略掉当前的点击)，并且忽略该点击。 可以修改 Board(棋盘) 组件的 handleClick ：

``` js

    handleClick(i) {
        const squares = this.state.squares.slice(); //得到this.state.squares的一份拷贝

        // 若有人赢得比赛或者当前点击方格已被填充过，则忽略掉当前点击
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        });
    }
```

## 存储历史记录 ##
重新访问 Board(棋盘) 组件的旧 state(状态) ，那么我们可以看到之前的任何一个动作之后的棋面。每下一步棋，我们创建一个新的 `squares` 数组，并将该 `squares`数组存到同一个对象中，即可存储 Board(棋盘) 组件过去的 state(状态)，该对象存储每一步棋的 state(状态)。

希望顶级的 `Game(游戏)` 组件负责显示动作列表。之前我们把这个 state(状态) 从 Square(方格) 组件拉到 Board(棋盘) 组件上，现在我们再将它从 Board(棋盘) 组件拉到 Game(游戏) 组件上， 所以顶级 Game(游戏) 组件拥有所需的所有信息。

首先，通过添加一个构造函数来设置 Game(游戏) 组件的初始 state(状态) ：

``` js

    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true
        };
    }
```
然后改变 Board(棋盘) 组件，使它通过 props(属性) 取到 squares ，其 `renderSquare`方法的 `onClick` prop(属性) 由 Game(游戏) 组件指定，可以将每个方格的位置传递到点击处理程序中，以便我们仍然知道哪个方格被点击：


    删除 Board(棋盘) 组件中的 constructor (构造函数)。
    在 Board(棋盘) 组件的 renderSquare 中用 this.props.squares[i] 替换 this.state.squares[i] 。
    在 Board(棋盘) 组件的 renderSquare 中用 this.props.onClick(i) 替换 this.handleClick(i) 。

Game(游戏) 组件的 `render` 应该可以获取最近的历史记录，并可以接管计算游戏状态，在Game组件的`render`方法中，更新`history`，并计算游戏状态。

由于 Game(游戏) 组件现在渲染 status，可以删除`Board`组件`render`方法中的 `<div className="status">{status}</div>` 。

接下来，将 `handleClick` 方法的实现从 Board(棋盘) 组件移动到 Game(游戏) 组件。 Game(游戏) 组件的 `handleClick` 可以通过连接（数组的 `.concat()` 方法）新的历史记录条目来创建一个新的历史记录数组的方式，来将新条目推入堆栈。

现在，Board(棋盘) 组件只需要 `renderSquare` 和 `render`; state(状态) 初始化和点击处理程序应该都在 Game(游戏) 组件中。

### 显示下棋步骤 ###
React 元素是一类JS对象，我们可以存储它们或传递它们。

要在 React 中渲染多个项目，我们传递一个 React 元素数组。构建该数组的最常见方法是 映射(map) 数据数组。在 Game(游戏) 组件的 `render` 方法中实现该方式：

**Keys--渲染列表**

当渲染一个项目列表时，React 总是存储有关列表中每个项目的一些信息。如果渲染具有 state(状态) 的组件，则需要存储该 state(状态) - 无论如何实现组件，React 存储一个引用来支持本地视图。

React 要求在列表中的每个元素上指定一个 `key` 属性(property)，一个字符串来区分每个组件与其兄弟组件，如果项目对应于数据库中的对象，数据库 ID 通常是一个不错的选择。

`key` 是由 React 保留的特殊属性（以及 `ref`，更高级的功能）。创建元素时，React 将拉离 `key` 属性并将其直接存储在返回的元素上。虽然它可能看起来像是 props(属性) 的一部分，但是它不能通过 `this.props.key` 引用。React 在决定哪些子元素要更新时自动使用该 `key`;组件无法查询自己的 `key`。

当一个列表重新渲染时， React 使用新版本中的每个元素，并在上一个列表中查找具有匹配 `key` 的元素。当一个 `key` 被添加到集合中时，创建一个组件;当一个 `key` 被删除时，一个组件将会被销毁。 `key` 用来告诉 React 关于每个组件的身份标识 ，因此他可以维持 state(状态) 到重新渲染。如果更改组件的 `key`，它将被完全毁灭，并重新建立一个新的 state(状态) 。

**强烈建议你在构建动态列表时分配适当的 key。** 组件 key不需要是全局唯一的，只要相对于直系兄弟元素是唯一的就行。

### 步骤重现 ###
对于下棋步骤的列表，我们已经有了每个步骤的唯一ID：每个步骤发生时的次数。在 Game(游戏) 组件的 `render` 方法中，将 `key` 添加为 `<li key={move}>` ，key警告消失。

接下来实现`jumpTo`：

首先，在 Game(游戏) 组件 `constructor`(构造函数)的初始 state(状态) 中添加 `stepNumber: 0`；

接下来，将在 Game(游戏) 组件中定义 `jumpTo` 方法来更新该 state(状态) 。我们也想更新 xIsNext 。如果步骤编号的索引为偶数，则将 xIsNext 设置为 true,在 Game(游戏) 类中添加一个名为 `jumpTo` 的方法：

``` js

    //悔棋到某一步
    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) ? false : true //偶数步是X
        });
    }
```
然后在 Game(游戏) 的 `handleClick` 中，通过添加 `stepNumber: history.length` 到该 state(状态) 中来更新 `stepNumber` 。 当阅读当前 棋盘(board) 的 state(状态) 时，我们还会通过 `handleClick` 更新 `stepNumber` ，因此你可以后退，然后点击 棋盘(board) 创建一条新的记录：

``` js

handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //得到current.squares的一份拷贝

        // 若有人赢得比赛或者当前点击方格已被填充过，则忽略掉当前点击
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
			stepNumber: history.length
        });
    }
```
修改 Game(游戏) 的 `render`，来从历史记录中读取该步骤：

``` js

	 render() {
	    const history = this.state.history;
	    const current = history[this.state.stepNumber];
	    const winner = calculateWinner(current.squares);
```

**优化：**

(1)重写 Board(棋盘) 使用两个循环来制作方格，而不是对它们进行硬编码。

	 const rows = [1, 2, 3];
	        const cols = [1, 2, 3];
	        return (
	            <div>
	                {rows.map((item1, index1) => {
	                    return (
	                        <div className="board-row" key={index1}>
	                            {cols.map((item2, index2) => {
	                                return (
	                                    this.renderSquare(3 * index1 + index2)
	                                )
	                            })}
	                        </div>);                   
	                })}
	            </div>
	        );



# node进程管理 #
cd 到 `E:\someDemosForExercise\tictactoe-app`，执行 `npm start`后又提示3001端口被占用。

这是因为之前启用过3001端口测试该app，但是关掉node窗口后，并没有杀死node进程。在[论坛](https://segmentfault.com/q/1010000010012292)看到，**`git bash here` 在WIN10下面 `CTRL+C` 是关闭不掉 node进程的**，所以需要手动关掉node进程，解除端口占用。

## windows查看端口占用命令 ##
1.查看端口对应的进程PID `netstat -ano | findstr "3001"`

2.查看进程PID对应的进程名称 `tasklist | findstr "20708"`

3.结束该进程 `taskkill /f /t /im node.exe`

![杀死node进程](http://ou3oh86t1.bkt.clouddn.com/react-tictactoe/%E6%9D%80%E6%AD%BBnode%E8%BF%9B%E7%A8%8B.png)

# 上传到github pages #
参考[博客](https://www.cnblogs.com/liuboyingblog/p/8260233.html)

1.修改package.json,添加 `"homepage" : "http://myname.github.io/app_name"`。

其中`app_name`字段为使用命令 `create-react-app tictactoe-app`创建的app名字，例如此处我的app名字为 `tictactoe-app`。`myname.github.io`字段为该项目所在的github pages目录，比如我给 `E:\someDemosForExercise`开启github pages功能，`tictactoe-app`项目对应在github pages的根目录为
`http://shirley5li.me/someDemosForExercise/tictactoe-app`。

所以我需要在package.json,添加 `"homepage" : "http://shirley5li.me/someDemosForExercise/tictactoe-app"`

2.执行 `npm run build`

3.将pages地址贴在readme中，即`http://shirley5li.me/someDemosForExercise/tictactoe-app/build/#`

**注意：**记得将.gitignore文件中的忽略build文件夹注释掉，不然build文件夹无法上传上去。