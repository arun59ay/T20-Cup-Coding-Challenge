import React, { useState } from "react";

const Cricket = () => {
  const [runsToWin, setRunsToWin] = useState(40);
  const [currentScore, setCurrenScore] = useState(0);
  const [wicketsLeft, setWicketsLeft] = useState(3);
  const [striker, setStriker] = useState("Kirat Boli");
  const [prevStriker, setPrevStriker] = useState("NS Nodhi");
  const [runs, setCurrentRun] = useState(0);
  const [currentOver, setCurrentOver] = useState(0);
  const [ballsInOver, setBallsInOver] = useState(0);
  const [isMatchOver, setIsMatchOver] = useState(false);

  const [players] = useState(["Kirat Boli", "NS Nodhi"]);
  const [remainingPlayers] = useState(["R Rumrah", "Shashi Henra"]);
  const [scores] = useState({
    "Kirat Boli": { Score: 0, Balls: 0, Out: false },
    "NS Nodhi": { Score: 0, Balls: 0, Out: false },
  });

  const probabilities = {
    "Kirat Boli": [0.05, 0.3, 0.25, 0.1, 0.15, 0.01, 0.09, 0.05],
    "NS Nodhi": [0.1, 0.4, 0.2, 0.05, 0.1, 0.01, 0.04, 0.1],
    "R Rumrah": [0.2, 0.3, 0.15, 0.05, 0.05, 0.01, 0.04, 0.2],
    "Shashi Henra": [0.3, 0.25, 0.05, 0.0, 0.05, 0.01, 0.04, 0.3],
  };

  const randomRuns = (probabilities, playing) => {
    const currentPlayerprobability = probabilities[playing];
    const cumulativeProbabilities = [];
    let sum = 0;
    for (const probability of currentPlayerprobability) {
      sum += probability;
      cumulativeProbabilities.push(sum);
    }

    // Generate a random number between 0 and 1 //
    const randomNum = Math.random();

    // Find the index corresponding to the random number //
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (randomNum < cumulativeProbabilities[i]) {
        return i;
      }
    }

    // If no index is found, return -1 //
    return -1;
  };

  const handleBowl = () => {
    if (isMatchOver) {
      return;
    }
    if (ballsInOver === 5) {
      setBallsInOver(0);
      setStriker((prevStriker) =>
        prevStriker === players[0] ? players[1] : players[0]
      );
      setPrevStriker((prevStriker) =>
        prevStriker === players[1] ? players[0] : players[1]
      );
      setCurrentOver((prevOver) => prevOver + 1);
    } else {
      setBallsInOver((prevBalls) => prevBalls + 1);
    }
    if (runsToWin <= 0) {
      setIsMatchOver(true);
      return;
    }
    if (currentOver >= 4) {
      setIsMatchOver(true);
      return;
    }
    const runs = randomRuns(probabilities, striker);
    const value = runs === 7 ? "OUT" : runs;
    setCurrentRun((prevRun) => value);

    if (runs == 7) {
      setWicketsLeft((prevWickets) => prevWickets - 1);
      scores[striker].Out = true;
      if (wicketsLeft != 1) {
        const index = players.indexOf(striker);
        players.splice(index, 1);
      }

      if (wicketsLeft === 1) {
        setIsMatchOver(true);
      } else {
        const newPlayer = remainingPlayers[0];
        setStriker(newPlayer);
        scores[newPlayer] = { Score: 0, Balls: 0, Out: false };
        remainingPlayers.shift();
        players.unshift(newPlayer);
      }
    } else {
      setRunsToWin((prevRuns) => prevRuns - runs);
      setCurrenScore((prevRuns) => prevRuns + runs);
      // setStrikerScore((prevScore) => prevScore + runs); //
      scores[striker].Score += runs;

      if (runs % 2 !== 0) {
        setStriker((prevStriker) =>
          prevStriker === players[0] ? players[1] : players[0]
        );
        setPrevStriker((prevStriker) =>
          prevStriker === players[1] ? players[0] : players[1]
        );
      }
    }
    if (currentScore > 40) {
      setIsMatchOver(true);
    }

    scores[striker].Balls += 1;
  };

  const renderResult = () => {
    if (runsToWin <= 0) {
      return (
        <div className="toast-body text-bg-success rounded p-3 d-flex justify-content-start align-items-center">
          <h5 className="mb-0"> Bengaluru won the match with {wicketsLeft} wicket(s) and{" "}
          {(3 - currentOver) * 6 + (6 - ballsInOver)} ball(s)</h5>
        </div>
      );
    } else if (wicketsLeft === 0) {
      return (
        <div className="toast-body text-bg-warning rounded p-3 d-flex justify-content-start align-items-center">
          <h5 className="mb-0">Bengaluru lost the match with {runsToWin} run(s)</h5>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="d-flex flex-column justify-content-start align-items-center w-100 mt-5">
      <div className="w-50 d-flex flex-column justify-content-start align-items-start card p-5">
        <div className="d-flex justify-content-between align-items-start w-100">
          <div>
            <div className="d-flex align-items-center">
              <h5>Score:</h5>{" "}
              <h6 className="ms-4">
                {currentScore} - {3 - wicketsLeft}{" "}
              </h6>
            </div>
            <div className="d-flex align-items-center">
              <h5>Overs:</h5>{" "}
              <h6 className="ms-4">
                {currentOver}.{ballsInOver}
              </h6>
            </div>
          </div>

          <div>
            <div>
              <h1>{runs}</h1>
            </div>
            <div>Runs</div>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center card p-5 mb-5 mt-5 w-100">
          <div className="mb-5">
            <h4>
              {striker} ({scores[striker].Score}*)
            </h4>
          </div>
          <div className="mt-5">
            <h4>
              {prevStriker} ({scores[prevStriker].Score})
            </h4>
          </div>
        </div>

        <div className="w-100">
          {!isMatchOver && (
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={handleBowl}
            >
              Bowl
            </button>
          )}

          <div>{isMatchOver && renderResult()}</div>
        </div>
      </div>
    </div>
  );
};

export default Cricket;
