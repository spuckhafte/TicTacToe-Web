function win(v, oLoc, options, winning_rows) {
  let first = true;
  let second = false;
  let target = "o";
  while (true) {
    if (first) {
      first = false;
      for (let _row in winning_rows) {
        let row = winning_rows[_row];
        for (let _element in row) {
          let element = row[_element];
          let position1 = element;
          for (let _position2 in row) {
            let position2 = row[_position2];
            if (
              position1 !== position2 &&
              v[position1] === v[position2] &&
              v[position1] === target
            ) {
              row.splice(row.indexOf(position1), 1);
              row.splice(row.indexOf(position2), 1);
              if (options.every((el) => el !== v[row[0]])) oLoc = row[0];
              return oLoc;
            }
          }
        }
      }
      if (second) return oLoc;
    } else {
      first = true;
      second = true;
      target = "x";
    }
  }
}

function hard_2(v, options, xLoc, oLoc, i, locations) {
  if (i === 1) oLoc = xLoc === 5 ? choose([7, 3]) : 5;
  if (i === 2) {
    while (true) {
      if (v[7] === "o" || v[3] === "o") {
        oLoc = choose([1, 9]);
        break;
      } else {
        oLoc = choose([2, 8, 4, 6]);
        if (options.every((el) => el !== v[oLoc])) break;
      }
    }
  }
  if (i !== 1 && i !== 2) oLoc = choose(locations);
  return oLoc;
}

function hard_1(v, oLoc, i, locations) {
  if (i === 1) oLoc = choose([5, 1, 3, 7, 9]);
  if (i === 2) {
    if (v[5] === "o") {
      while (true) {
        oLoc = choose([1, 3, 7, 9]);
        if (v[oLoc] !== "x") break;
      }
    } else {
      while (true) {
        if (v[1] === "o" || v[9] === "o") {
          oLoc = choose([3, 7]);
          if (v[oLoc] !== "x") break;
        }

        if (v[3] === "o" || v[7] === "o") {
          oLoc = choose([1, 9]);
          if (v[oLoc] !== "x") break;
        }
      }
    }
  }
  if (i === 3) {
    if (v[5] === "o") {
      while (true) {
        if (v[1] === "o" || v[9] === "o") {
          oLoc = choose([3, 7]);
          if (v[oLoc] !== "x") break;
        }

        if (v[3] === "o" || v[7] === "o") {
          oLoc = choose([1, 9]);
          if (v[oLoc] !== "x") break;
        }
      }
    } else {
      let rows = [1, 3, 7, 9];
      let cases = [
        [1, 3],
        [3, 9],
        [9, 7],
        [7, 1]
      ];
      for (let _case in cases) {
        let Case = cases[_case];
        let op1 = Case.pop();
        let op2 = Case.pop();
        if (v[op1] === v[op2] && v[op1] === "o") {
          rows.splice(rows.indexOf(op1), 1);
          rows.splice(rows.indexOf(op2), 1);
          oLoc = choose(rows);
          rows.splice(rows.indexOf(oLoc), 1);
          if (locations.every((el) => !el === oLoc)) oLoc = rows.pop;
          break;
        }
      }
    }
  }
  if ([1, 2, 3].every((en) => !en === i)) oLoc = choose(locations);
  return oLoc;
}

function check_win(v, winning_rows2) {
  for (let _row in winning_rows2) {
    let row = winning_rows2[_row];
    let [i, j, k] = row;
    if (v[i] === v[j] && v[j] === v[k] && v[i] === "o") return 0;
    if (v[i] === v[j] && v[j] === v[k] && v[i] === "x") return 1;
  }
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

v = { 1: " ", 2: " ", 3: " ",
      4: " ", 5: " ", 6: " ",
      7: " ", 8: " ", 9: " "
    };
let winning_rows = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], 
  [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]
];
let winning_rows2 = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], 
  [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]
];

let i = 0;

let locations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let options = ["x", "o"];

let oLoc = 0;
let xLoc = 0;

let xWin = false;
let oWin = false;
let tie = false;

const tiles = document.querySelectorAll(".box");

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (tile.className.includes("hoverable") && !oWin && !xWin && !tie) {
      i += 1;
      play("X", tile);
      xLoc = parseInt(tile.id);
      v[xLoc.toString()] = "x";
      locations.splice(locations.indexOf(xLoc), 1);

      if (check_win(v, winning_rows2) === 1) {
        document.querySelector(".head").childNodes[0].nodeValue = "X Wins ";
        blackOut(locations);
        xWin = true;
      }

      if (locations.length === 0) {
        tie = true;
        document.querySelector(".head").childNodes[0].nodeValue = "Tie ";
      }
      if (!xWin && !tie) {
        oLoc = 0;
        let get = win(v, oLoc, options, winning_rows);
        if (get !== 0) oLoc = get;
        else oLoc = hard_2(v, options, xLoc, oLoc, i, locations);

        play("O", document.getElementById(oLoc.toString()));
        v[oLoc] = "o";
        locations.splice(locations.indexOf(oLoc), 1);

        if (check_win(v, winning_rows2) === 0) {
          oWin = true;
          document.querySelector(".head").childNodes[0].nodeValue = "0 Wins ";
          blackOut(locations);
        }
      }
    }
  });
});

let retry = document.getElementById("retry");
retry.addEventListener("click", () => {
  v = { 1: " ", 2: " ", 3: " ",
        4: " ", 5: " ", 6: " ",
        7: " ", 8: " ", 9: " "
  };
  i = 0;
  locations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  options = ["x", "o"];
  oLoc = 0;
  xLoc = 0;
  xWin = false;
  oWin = false;
  tie = false;
});

function play(player, tile) {
  tile.className = "box";
  tile.innerHTML = player;
  tile.style["color"] = player === "X" ? "#FAF0E6" : "#170d0d";
}

function blackOut(locs) {
  locs.forEach((loc) => {
    document.getElementById(loc.toString()).className = "box";
  });
}
