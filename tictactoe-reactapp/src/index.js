import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//定义小方格组件
function Square(props) {
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
}

//定义棋盘组件
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
            value={this.props.squares[i]}
            onClick={() => {this.props.onClick(i)}}
            />
        );
    }

    render() {

        // return (
        //     <div>
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>
        //     </div>
        // );

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
        


    }
}

//定义游戏组件
class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{ //存储落棋的历史操作
                squares: Array(9).fill(null)
            }],
            xIsNext: true, //判断下一位玩家
            stepNumber: 0, //用于步骤重现
        };
    }

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

    //悔棋到某一步
    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) ? false : true, //偶数步是X

        });
    }

    render() {
        const history = this.state.history; //记录每一次点击时，九个方格的游戏状态，数组形式，里面填充对象
        const current = history[this.state.stepNumber]; //点击当前方格时，九个方格的填充状态，对象形式，对象的值为记录九个格子填充值的数组
        const winner = calculateWinner(current.squares); //记录是否有人获胜，返回'X'/'O'或null

        // 渲染列表
        const moves = history.map((step, move) => { //map(item, index, arr)
            const desc = move ? 'Go to move #' + move : 'Go to game start'; //move为0时，表示游戏已经退到开始第一步之前，九个格子的填充状态均为null
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="game-winner">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// 玩家获胜时的情况, squares=['X','O','X','X','O',...]
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