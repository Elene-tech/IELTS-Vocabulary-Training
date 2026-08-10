import { useState } from 'react';

export default function FlashcardEngine({ exercise }) {
  const { title, cards } = exercise;
  const [order, setOrder] = useState(cards.map((_, i) => i));
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cardData = cards[order[current]];

  function next() {
    setFlipped(false);
    setCurrent((c) => (c + 1) % order.length);
  }

  function prev() {
    setFlipped(false);
    setCurrent((c) => (c - 1 + order.length) % order.length);
  }

  function shuffle() {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setCurrent(0);
    setFlipped(false);
  }

  return (
    <div className="te-root">
      <div className="te-header">
        <span className="te-tag">Target English • {title}</span>
        <span className="te-counter">
          {current + 1}/{order.length}
        </span>
      </div>
      <div className="fc-wrap">
        <div className="fc-scene">
          <div
            className={`fc-card ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
          >
            <div className="fc-face fc-front">
              <div className="fc-label">Avoid in writing</div>
              <div className="fc-word">{cardData.front}</div>
              <div className="fc-tap">Tap the card to flip</div>
            </div>
            <div className="fc-face fc-back">
              <div className="fc-label">Use instead (Band 7+)</div>
              <div className="fc-syn">{cardData.synonyms}</div>
              {cardData.explanation && <div className="fc-expl">{cardData.explanation}</div>}
              <div className="fc-ex">{cardData.example}</div>
            </div>
          </div>
        </div>
        <div className="fc-controls">
          <button className="fc-nav" onClick={prev}>
            ← Prev
          </button>
          <button className="fc-shuffle" onClick={shuffle}>
            🔀 Shuffle
          </button>
          <button className="fc-nav" onClick={next}>
            Next →
          </button>
        </div>
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
