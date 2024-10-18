"use client"
import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const DiceIcon = ({ value }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const DiceComponent = icons[value - 1] || Dice1;
  return <DiceComponent size={48} />;
};

const DigitalDice = () => {
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setResults(Array(diceCount).fill(1));
  }, [diceCount]);

  const rollDice = () => {
    setIsRolling(true);
    const interval = setInterval(() => {
      const newResults = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      setResults(newResults);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      const finalResults = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      setResults(finalResults);
      setTotal(finalResults.reduce((sum, val) => sum + val, 0));
    }, 1000);
  };

  return (
    <div className="p-4 max-w-md mx-auto my-28">
      <h2 className="text-2xl font-bold mb-4">Digital Dice Game</h2>
      <div className="mb-4">
        <label className="block mb-2">Number of Dice: {diceCount}</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={diceCount} 
          onChange={(e) => setDiceCount(parseInt(e.target.value))}
          className="range range-primary"
        />
        <div className="w-full flex justify-between text-xs px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
            <span key={value}>{value}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {results.map((result, index) => (
          <div key={index} className={`transition-all duration-100 ${isRolling ? 'animate-bounce' : ''}`}>
            <DiceIcon value={result} />
          </div>
        ))}
      </div>
      <button 
        onClick={rollDice} 
        disabled={isRolling} 
        className={`btn btn-primary mb-4 ${isRolling ? 'loading' : ''}`}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
      {results.length > 0 && !isRolling && (
        <div className="text-xl font-bold">
          Total: {total}
        </div>
      )}
    </div>
  );
};

export default DigitalDice;