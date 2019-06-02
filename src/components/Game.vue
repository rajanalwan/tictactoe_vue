/* eslint-disable */
<template>
  <div class="game">
    <div class="taskButtons">
      <button type="button" class="btn btn-warning" v-on:click="clearBoard()">Clear Board</button>
    </div>
    <div class="column">
      <div class="row" v-for="i in (0,3)">
        <div class="button" v-for="j in (0,3)">
          <button
            type="button"
            class="btn"
            :class="{'btn-outline-light': boardStatus[3 * (i - 1) + j - 1] === blankStatus, 
            'btn-success': boardStatus[3 * (i - 1) + j - 1] === humanStatus,
            'btn-danger': boardStatus[3 * (i - 1) + j - 1] === computerStatus}"
            :id="3 * (i - 1) + j - 1"
            v-on:click="setPosition(3 * (i - 1) + j - 1)"
            :disabled="disabledState[3 * (i - 1) + j - 1]"
          ></button>
        </div>
      </div>
    </div>
    <div class="status">{{status}}</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { ApiService } from "../services/Api";

@Component
export default class Game extends Vue {
  private statusMessage = "";
  private blank = 0;
  private human = 1;
  private computer = 2;
  private gameOver = 3;
  private board = new Array(9).fill(0);
  private disabled = new Array(9).fill(false);

  private apiService = new ApiService();

  get status() {
    return this.statusMessage;
  }

  get boardStatus() {
    return this.board;
  }

  set boardStatus(value) {
    this.board = value;
  }

  get blankStatus() {
    return this.blank;
  }

  get humanStatus() {
    return this.human;
  }

  get computerStatus() {
    return this.computer;
  }

  get disabledState() {
    return this.disabled;
  }

  public setPosition(pos: number) {
    if (this.board[pos] === this.human || this.board[pos] === this.computer) {
      this.statusMessage = "Position already filled. Try another position.";
      return;
    }

    this.boardStatus[pos] = this.human;
    this.boardStatus = [...this.boardStatus];
    this.disabled[pos] = true;
    this.disabled = [...this.disabled];
    this.statusMessage = "Computer playing.";

    // let move = this.minimax(this.board, this.computer);

    this.apiService.minimax(this.board, this.computer).then(res => {
      let move = res;
      this.boardStatus[move.index] = this.computer;
      this.boardStatus = [...this.boardStatus];
      this.disabled[move.index] = true;
      this.disabled = [...this.disabled];

      let postComputerMove = this.checkWinMove(this.board);

      if (move.index === -1 || postComputerMove.index === -1) {
        if (move.score === 1 || postComputerMove.score === 1) {
          this.statusMessage = "Computer won!";
        } else if (move.score === -1 || postComputerMove.score === -1) {
          this.statusMessage = "You won!";
        } else if (move.score === 0 || postComputerMove.score === 0) {
          this.statusMessage = "It's a draw!";
        }

        this.disableAllButtons();
      } else {
        this.statusMessage = "Your turn.";
      }
    });
  }

  public enableAllButtons() {
    this.disabled = new Array(9).fill(false);
    this.disabled = [...this.disabled];
  }

  public disableAllButtons() {
    this.disabled = new Array(9).fill(true);
    this.disabled = [...this.disabled];
  }

  public clearBoard() {
    this.board = new Array(9).fill(0);

    this.enableAllButtons();
    this.statusMessage = "Board cleared.";
  }

  public win(board: number[], player: number) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  public findEmptySlotsLength(newBoard: number[]) {
    let emptySlots = [];
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === 0) {
        emptySlots.push(i);
      }
    }
    return emptySlots.length;
  }

  public compare(a: number, b: number) {
    return a > b;
  }

  public checkWinMove(board: number[]) {
    if (this.win(board, this.human)) {
      return { index: -1, score: -1 };
    } else if (this.win(board, this.computer)) {
      return { index: -1, score: 1 };
    } else if (this.findEmptySlotsLength(board) === 0) {
      return { index: -1, score: 0 };
    } else {
      return { index: -2, score: null };
    }
  }

  public minimax(board: number[], player: number) {
    if (this.win(board, this.human)) {
      return { index: -1, score: -1 };
    } else if (this.win(board, this.computer)) {
      return { index: -1, score: 1 };
    } else if (this.findEmptySlotsLength(board) === 0) {
      return { index: -1, score: 0 };
    }

    let move = -1;
    let score = -2;

    let moves = [];

    for (let i = 0; i < 9; i++) {
      if (board[i] === 0) {
        board[i] = player;

        let currentMove: { index: number; score: number } = this.minimax(
          board,
          player === this.human ? this.computer : this.human
        );

        moves.push({ index: i, score: currentMove.score });

        board[i] = this.blank;
      }
    }

    let bestMove: number = -1;

    if (player === this.computer) {
      let bestScore = -9;

      for (let move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = moves.findIndex(element => element === move);
        }
      }
    } else {
      let bestScore = 9;
      for (let move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = moves.findIndex(element => element === move);
        }
      }
    }

    return moves[bestMove];
  }
}
</script>

<style lang="scss">
.game {
  margin-top: 24px;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .row {
    flex-direction: row;
    justify-content: center;
    .btn {
      width: 10vh;
      height: 10vh;
      border-radius: 0px;
    }
  }
}

.taskButtons {
  margin: 16px;
  text-align: right;
  vertical-align: middle;
}

.status {
  font-size: 30px;
  color: #eee;
  text-align: center;
  margin: 24px 0px;
}
</style>