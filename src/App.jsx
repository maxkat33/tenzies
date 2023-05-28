import { nanoid } from "nanoid";
import React from "react";
import Confetti from "react-confetti";
import Die from "./Components/Die/Die";

const App = () => {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("You won!");
    }
  }, [dice]);

  function newDie() {
    const randomDiceRoll = Math.floor(Math.random() * 6 + 1);
    return {
      value: randomDiceRoll,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    let diceArr = [];
    for (let i = 0; i < 10; i++) {
      diceArr.push(newDie());
    }
    return diceArr;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld ? die : newDie();
        })
      );
      setRollCount((prevRollCount) => prevRollCount + 1);
    } else {
      setTenzies(false);
      setRollCount(0);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return id === die.id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const [milliseconds, setMilliseconds] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  function timer() {
    // why is this code not stopping the timer when tenzies is true???
    if (tenzies) {
      return;
    }
    if (isTimerRunning) {
      return;
    }

    const startTime = performance.now();

    const intervalId = setInterval(() => {
      if (tenzies || minutes === 60) {
        setIsTimerRunning(false);
        clearInterval(intervalId);
      }
      console.log(intervalId);
      const elapsedTime = performance.now() - startTime;
      setMinutes(Math.floor(elapsedTime / 60000));
      setSeconds(Math.floor((elapsedTime / 1000) % 60));
      setMilliseconds(
        Math.floor(elapsedTime % 1000)
          .toString()
          .slice(0, 2)
      );
    }, 10);
    setIsTimerRunning(true);
  }

  const diceElements = dice.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button
        onClick={() => {
          rollDice();
          timer();
        }}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
      {rollCount > 0 && <h4>Number of rolls: {rollCount}</h4>}
      <div className="timer">
        <p className="timer-digit">{minutes}</p>
        <span>:</span>
        <p className="timer-digit">{seconds}</p>
        <span>:</span>
        <p className="timer-digit">{milliseconds}</p>
      </div>
    </main>
  );
};

export default App;

// let millisecondsDisplay;
// A timer function I built manually using the setInterval function
// function timer() {
//   setInterval(() => {
//     setMinutes((prevMinutes) => {
//       if (prevMinutes === 60) {
//         console.log("finish timer");
//         return prevMinutes;
//       } else {
//         return prevMinutes;
//       }
//     });
//     setSeconds((prevSeconds) => {
//       if (prevSeconds === 60) {
//         setMinutes((prevMinutes) => prevMinutes + 1);
//         return 0;
//       } else {
//         return prevSeconds;
//       }
//     });
//     setMilliseconds((prevMilliseconds) => {
//       if (prevMilliseconds === 1000) {
//         setSeconds((prevSeconds) => prevSeconds + 1);
//         return 0;
//       } else {
//         return prevMilliseconds + 10;
//       }
//     });
//   }, 10);
// }
