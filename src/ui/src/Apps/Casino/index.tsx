import { useEffect, useState } from 'react';
import { TopNavigation } from '../../components/Navigation/TopNavigation';

/**
 * Add jackpot icon, and bar to the symbols array
 */
const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '⭐', '🔔', '🎰', '🍀'];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const useInterval = (callback: () => void, delay: number) => {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
};

export const CasinoApp = () => {
  const [reels, setReels] = useState([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    document.title = 'Casino';
  }, []);

  const spinReels = () => {
    setSpinning(true);
    setWinner(false);
    setTimeout(() => {
      const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(newReels);
      setSpinning(false);
      checkWinner(newReels);
    }, 1000);
  };

  useInterval(() => {
    if (spinning) {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }
  }, 100);

  const checkWinner = (reels: string[]) => {
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      setWinner(true);
    }
  };

  return (
    <div className="flex flex-col gap-2 flex-1 h-full overflow-hidden">
      <TopNavigation title="Casino" />
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex gap-4 text-6xl">
          {reels.map((symbol, index) => (
            <div key={index} className={`border p-4 ${spinning ? 'spin' : ''}`}>
              {symbol}
            </div>
          ))}
        </div>
        <button
          onClick={spinReels}
          disabled={spinning}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {spinning ? 'Spinning...' : 'Spin'}
        </button>
        {winner && <div className="mt-4 text-2xl text-green-500">You Win!</div>}
      </div>
    </div>
  );
};
