import React from "react"
import Die from "./Components/Die/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

const App = () => {
  
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  
  React.useEffect(()=> {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice])
  
  function newDie(){
    const randomDiceRoll = Math.floor(Math.random() * 6 + 1)
    return {
      value: randomDiceRoll, 
      isHeld: false,
      id: nanoid(),
    }
  }
  
  function allNewDice () {
    let diceArr = []
    for (let i = 0; i < 10; i++) {
      const randomDiceRoll = Math.floor(Math.random() * 6 + 1)
      diceArr.push(newDie())
    }
    return diceArr
  }
  
  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : newDie()
        })
      )
    }
    else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }
  
  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return id === die.id ? {...die, isHeld: !die.isHeld} : die
    }))
  }
    
  const diceElements = dice.map((die, index) => {
      return <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  })
  
  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
        {diceElements}
      </div>
      <button onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  )
}

export default App