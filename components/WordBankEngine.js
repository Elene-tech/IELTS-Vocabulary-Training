import { useState } from 'react';

export default function WordBankEngine({ exercise }) {
  const { title, words, items } = exercise;
  const [placed, setPlaced] = useState(new Array(items.length).fill(null));
  const [selectedWord, setSelectedWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState('');

  const usedWords = placed.filter(Boolean);
  const bankWords = words.filter((w) => !usedWords.includes(w));

  function selectWord(w) {
    if (checked) return;
    setSelectedWord((cur) => (cur === w ? null : w));
  }

  function clickBlank(i) {
    if (checked) return;
    if (placed[i]) {
      const next = [...placed];
      next[i] = null;
      setPlaced(next);
      return;
    }
    if (selectedWord) {
      const next = [...placed];
      next[i] = selectedWord;
      setPlaced(next);
      setSelectedWord(null);
    }
  }

  function checkAll() {
    if (checked) {
      setPlaced(new Array(items.length).fill(null));
      setSelectedWord(null);
      setChecked(false);
      setMessage('');
      return;
    }
    if (placed.some((p) => !p)) {
      setMessage('Fill in every gap before checking.');
      return;
    }
    setChecked(true);
    const correctCount = placed.filter((p, i) => p === items[i].answer).length;
    setMessage(`Result: ${correctCount} / ${items.length}`);
  }

  function reset() {
    setPlaced(new Array(items.length).fill(null));
    setSelectedWord(null);
    setChecked(false);
    setMessage('');
  }

  return (
    <div className="te-root">
      <div className="te-header">
        <span className="te-tag">Target English • {title}</span>
      </div>
      <div className="wb-wrap">
        <p className="wb-hint">Tap a word from the bank, then tap the gap where it belongs.</p>
        <div className="wb-bank">
          {bankWords.map((w) => (
            <button
              key={w}
              className={`wb-chip ${selectedWord === w ? 'selected' : ''}`}
              onClick={() => selectWord(w)}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="wb-sentences">
          {items.map((item, i) => {
            const isCorrect = checked && placed[i] === item.answer;
            const isWrong = checked && placed[i] !== item.answer;
            let blankClass = 'wb-blank';
            if (isCorrect) blankClass += ' correct';
            if (isWrong) blankClass += ' wrong';
            return (
              <div className="wb-row" key={i}>
                {i + 1}. {item.before}
                <button
                  className={blankClass}
                  disabled={checked}
                  onClick={() => clickBlank(i)}
                >
                  {placed[i] || '_____'}
                </button>
                {item.after}
              </div>
            );
          })}
        </div>
        {message && <p className="wb-message">{message}</p>}
        <button className="wb-check" onClick={checkAll}>
          {checked ? 'Try again' : 'Check all'}
        </button>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div className="te-footer">
      <div className="te-brand">Target English</div>
      <div className="te-author">Olena Kurilets</div>
      <a
        className="te-tg"
        href="https://t.me/english_rrs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram: @english_rrs
      </a>
    </div>
  );
}
