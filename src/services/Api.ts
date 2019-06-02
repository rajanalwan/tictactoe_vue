import axios from "axios";

export class ApiService {
  url = "http://192.168.10.129:8000";
  public minimax(board: number[], player: number) {
    // return Promise.resolve({ index: -1, score: -1 });
    return axios
      .get(this.url + "/minimax", {
        params: { board: board.join(", "), player }
      })
      .then(res => {
        console.log("Successful return", res.data);
        return res.data;
      })
      .catch(err => {
        console.error("Something went wrong - ", err);
      });
  }
}
