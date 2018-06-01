dva GettingStarted项目，用来显示一秒内鼠标的点击次数。
# 环境准备 #
## 安装 dva-cli ##
```bash
$ npm install -g dva-cli
```
查看版本：`dva -v`，查看帮助：`dva -h`
```bash
$ dva -v
dva-cli version 0.9.2
    dva version 2.2.3
roadhog version 2.4.2
```
## Create new App ##
```bash
$ dva new countClickApp --demo
```
`--demo`表示创建一个demo水平的app，若要创建正常水平的app，不要使用该选项。
```bash
$ cd myapp
$ npm start
```
# 定义 models #
dva数据流向如下：
![dva数据流向](http://ou3oh86t1.bkt.clouddn.com/dvaGettingStarted/dva%E6%95%B0%E6%8D%AE%E6%B5%81%E5%90%91.png)
项目进行的步骤：
- 设计 models
- 设计组件 components
- connect models 和 components

定义models如下：
index.js
``` js
app.model({
  namespace: 'count',
  state: {
    record : 0,
    current: 0,
  },
});
```
`namespace` 表示在全局 state 上的 key，`state` 是该 model 的初始值。`record`表示最高纪录，`current`表示当前点击速度。
# 编写 components #
设计完model之后，现在来编写组件，推荐使用无状态函数组件，因为在dva架构下不需要state。
index.js
```jsx
// 3. Component
// 定义 容器组件兼页面展示组件 CountApp
import styles from './index.less';
const CountApp = ({count, onClickAdd}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={onClickAdd}>+</button>
      </div>
    </div>
  );
};
```
**注意：**
1. `import styles from './index.less';`，然后使用`styles.xxx`来定义css类名，来自于[css-modules](https://github.com/css-modules/css-modules)用法。
2. 给组件传递了两个属性，其中`count`是model中的state，通过connet与组件进行绑定，`onClickAdd`用来触发一个action对象。

# 更新 state #
`reducer`是唯一可以用来更新state的，这使得我们的app更稳健，所有的数据修改都可追踪。`reducer`是一个纯函数，接收两个参数，当前`state`和`action`对象，然后返回一个新的state。

该应用需要两个`reducer`，`add`和`minus`。**注意：** 在`count` model 中`add`和`minus`不需要加命名空间前缀，但在model之外，action对象必须分别添加命名空间前缀，例如`count/add`。
index.js
```js
// 2. Model
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0
  },
  // Update state
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return {...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent
      };
    },
    minus(state) {
      return {...state, current: state.current - 1};
    }
  }
});
```
# 绑定 Data #
编写组件`CountApp`时为其传入了属性`count`, `onClickAdd`，这两个属性的数据从何而来呢？？？
在定义完 Model 和 Component 后，需要将二者connect起来，connect 之后 Component 就可以使用来自 Model 的数据了， Model 也可以接收组件 dispatch 的 action。
通过redux connect 对页面展示组件进行数据绑定：
index.js
```
// 4. Bind Data
import { connect } from 'react-redux';
function mapStateToProps(state) {
  return {count: state.count};
}

function mapDispatchToProps(dispatch) {
  return {
    onClickAdd: function() {
      dispatch({type: 'count/add'});
    }
  };
}
const HomePage = connect(mapStateToProps, mapDispatchToProps)(CountApp); //数据绑定

```
`mapStateToProps`和`mapDispatchToProps`都是函数，`mapStateToProps`负责从全局应用状态state取出所需数据，映射到展示组件的props;`mapDispatchToProps`负责把需要用到的action映射到展示组件的props上。
`mapDispatchToProps`接收`store.dispatch`方法作为参数，返回展示组件用来修改state的函数。
# 定义 Router #
Router定义了接收到一个url后该渲染哪个组件。由于该app只需要一个页面，所以不必修改router部分。
index.js
``` 
// 5. Router
import { Router, Route, Switch } from 'dva/router';
app.router(({ history }) =>
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={HomePage} />
    </Switch>
  </Router>
);
```
`history`默认为带有`_k`参数的 hashHistory，可以设置为 browserHistory，或者去掉`_k`参数。(PS:应该是版本不一致，我使用的这一版hashHistory不带 `_k` 参数了。)
# 添加样式表 #
通过[css-modules](https://github.com/css-modules/css-modules)定义样式表，跟使用平时的css样式一样。index.less如下：
```less
.normal {
  width: 200px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 20px #ccc;
}

.record {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  color: #ccc;
}

.current {
  text-align: center;
  font-size: 40px;
  padding: 40px 0;
}

.button {
  text-align: center;
  button {
    width: 100px;
    height: 40px;
    background: #aaa;
    color: #fff;
  }
}
```
然后在index.js中将index.less引入：`import styles from './index.less';`。
# 异步逻辑 effects #
在这之前的逻辑都是同步的，当点击`+`按钮，值会加1。
dva 通过在 model 中使用 effects来处理 side effects（异步逻辑），实现基于 redux-saga，使用了 ES6 Generator 语法。
![effects使用](http://ou3oh86t1.bkt.clouddn.com/dvaGettingStarted/effects%E6%A0%BC%E5%BC%8F.png)
在该 app 中，当用户点击 `+` 值会加 1，并且触发一个 side effect(即 1 秒后减 1)。修改 model 如下，添加`effects`部分：
index.js
```js
// index.js头部引入
import { delay } from 'redux-saga';

// 2. Model
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0
  },

  // Update state
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return {...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent
      };
    },
    minus(state) {
      return {...state, current: state.current - 1};
    }
  },

  // side effects
  effects: {
    *addThenMinus(action, {call, put}) {
      yield put({type: 'add'});
      yield call(delay, 1000);
      yield put({type: 'minus'});
    }
  }
});
```
接下来修改组件的按钮`onClick`属性的值，以及绑定数据的`mapDispatchToProps`函数，使得点击组件 dispatch action 时，dispatch `{type: 'count/addThenMinus'}`对象经过 redux-saga 中间件异步处理，不再是通过dispatch `{type: 'count/add'})`同步改变state。
```jsx
// 3. Component
// 定义 容器组件兼页面展示组件 CountApp
const CountApp = ({count, onClickAddMinus}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={onClickAddMinus}>+</button>
      </div>
    </div>
  );
};

// 4. Bind Data
function mapStateToProps(state) {
  return {count: state.count};
}

function mapDispatchToProps(dispatch) {
  return {
    onClickAddMinus: function() {
      dispatch({type: 'count/addThenMinus'});
    }
  };
}
const HomePage = connect(mapStateToProps, mapDispatchToProps)(CountApp); //数据绑定
```
**注意：** 
- `*addThenMinus() {}` 等同于 `addThenMinus: function*(){}`
- `call`和`put`是 redux-saga 的 effect命令，`call`用于异步逻辑，`put` 用户dispatch actions。

# Subscribe 键盘事件 #
在实现测试鼠标点击速度后，如何实现键盘敲击速度测试？？？
利用 dva 的 `subscriptions` 概念，Subscription 通常用来订阅数据源，必要的时候也会 dispatch action。数据源可以是当前时间、服务器的 websocket 连接、键盘输入、地理位置改变、history router变化等。
在 model 中定义 `subscriptions`:
```jsx
+import key from 'keymaster';
...
app.model({
  namespace: 'count',
+ subscriptions: {
+   keyboardWatcher({ dispatch }) {
+     key('⌘+up, ctrl+up', () => { dispatch({type:'addThenMinus'}) });
+   },
+ },
});
```
此处不需手动安装`keymaster`依赖，当写入`import key from 'keymaster';`并保存，`dva-cli`会自己安装并保存到`package.json`中。
# 完整代码 #
index.js
```jsx
import dva from 'dva';
import { Router, Route, Switch } from 'dva/router';
import { connect } from 'react-redux';
import { delay } from 'redux-saga';
import key from 'keymaster';
import styles from './index.less';

// 1. Initialize
const app = dva();

// 2. Model
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0
  },

  // Update state
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return {...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent
      };
    },
    minus(state) {
      return {...state, current: state.current - 1};
    }
  },

  // side effects
  effects: {
    *addThenMinus(action, {call, put}) {
      yield put({type: 'add'});
      yield call(delay, 1000);
      yield put({type: 'minus'});
    }
  },

  // subscriptions键盘点击
  subscriptions: {
    keyboardWatcher({dispatch}) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'addThenMinus'}) });
    }
  }
});

// 3. Component
// 定义 容器组件兼页面展示组件 CountApp
const CountApp = ({count, onClickAddMinus}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={onClickAddMinus}>+</button>
      </div>
    </div>
  );
};

// 4. Bind Data
function mapStateToProps(state) {
  return {count: state.count};
}

function mapDispatchToProps(dispatch) {
  return {
    onClickAddMinus: function() {
      dispatch({type: 'count/addThenMinus'});
    }
  };
}
const HomePage = connect(mapStateToProps, mapDispatchToProps)(CountApp); //数据绑定

// 5. Router
app.router(({ history }) =>
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={HomePage} />
    </Switch>
  </Router>
);

// 6. Start
app.start('#root');
```
# Build #
```bash
npm run build
```
编译后的文件在dist目录下。上传到github时，记得将`/dist`注释掉，否则上传不上去，无法看demo效果

# 遇到的问题，未解决 #

当写入`import key from 'keymaster';`并没有自动安装`keymaster`，按键盘数字并没变化，看了下issues才知道他们工具层有变动，需要手动添加依赖。
还有不知道为什么，当手动引入依赖`cnpm install keymaster --save`时，在`node_modules`下发现该依赖，引入包名`_keymaster@1.6.2@keymaster`，即使引入了，但是当按`ctrl+up`时，还是没反应。

如果有知道的小伙伴，请issue。

**[demo效果](http://shirley5li.me/someDemosForExercise/countClickApp/dist/index.html)**