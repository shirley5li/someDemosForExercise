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
// 定义 页面展示组件 CountApp
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


