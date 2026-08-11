import { useState } from 'react';

const STRINGS = {
  uk: {
    okPhrases: ["Правильно!", "Чудово!", "Так!"],
    badPhrases: ["Ой, не те!", "Майже!", "Запам'ятай:"],
    passMessages: ["Super!", "Great!", "Excellent!"],
    tryAgain: 'Try again',
    resultPassSuffix: ' правильних відповідей.',
    resultFailSuffix: ' — менше 60%. Спробуй ще раз!',
    noMistakes: 'Жодної помилки! 🎉',
    yourAnswer: 'Твоя',
    correctAnswer: 'Правильно',
    restart: 'Пройти ще раз',
    chooseAnswer: 'Обери відповідь',
    next: 'Далі',
    finish: 'Завершити',
  },
  en: {
    okPhrases: ["Correct!", "Nice one!", "Well done!"],
    badPhrases: ["Not quite!", "Almost!", "Remember:"],
    passMessages: ["Super!", "Great!", "Excellent!"],
    tryAgain: 'Try again',
    resultPassSuffix: ' correct.',
    resultFailSuffix: ' — below 60%. Give it another go!',
    noMistakes: 'No mistakes at all! 🎉',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    restart: 'Try again',
    chooseAnswer: 'Choose an answer',
    next: 'Next',
    finish: 'Finish',
  },
};

export default function McqEngine({ exercise }) {
  const { title, items, passThreshold = 0.6, lang = 'uk' } = exercise;
  const S = STRINGS[lang] || STRINGS.uk;
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mistakes, setMistakes] = useState([]);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', ok: null });
  const [flash, setFlash] = useState(null);

  const item = items[current];

  function pickPhrase(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function handleSelect(i) {
    if (answered) return;
    setAnswered(true);
    setSelectedIndex(i);
    const ok = i === item.correct;
    setFlash(ok ? 'flash-ok' : 'flash-bad');
    if (ok) {
      setFeedback({ text: pickPhrase(S.okPhrases), ok: true, emoji: '🎉' });
    } else {
      setFeedback({
        text: `${pickPhrase(S.badPhrases)} ${item.options[item.correct]}`,
        ok: false,
        emoji: '❌',
      });
      setMistakes((m) => [
        ...m,
        {
          q: `${current + 1}. ${item.q}`,
          given: item.options[i],
          correct: item.options[item.correct],
        },
      ]);
    }
  }

  function handleNext() {
    if (!answered) return;
    if (current < items.length - 1) {
      setCurrent((c) => c + 1);
      setAnswered(false);
      setSelectedIndex(null);
      setFeedback({ text: '', ok: null });
      setFlash(null);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setAnswered(false);
    setSelectedIndex(null);
    setMistakes([]);
    setFinished(false);
    setFeedback({ text: '', ok: null });
    setFlash(null);
  }

  if (finished) {
    const scoreCount = items.length - mistakes.length;
    const pct = scoreCount / items.length;
    const pctRounded = Math.round(pct * 100);
    const passed = pct >= passThreshold;

    return (
      <div className="te-root">
        <div className="te-header">
          <span className="te-tag">Target English • {title}</span>
        </div>
        <div className="te-card">
          <div
            className="te-result-badge"
            style={{ color: passed ? 'var(--ok)' : 'var(--bad)' }}
          >
            {passed ? pickPhrase(S.passMessages) : S.tryAgain}
          </div>
          <p className="te-result-sub">
            {scoreCount} / {items.length} ({pctRounded}%)
            {passed ? S.resultPassSuffix : S.resultFailSuffix}
          </p>
          {mistakes.length === 0 ? (
            <p style={{ color: 'var(--ok)', fontWeight: 600, fontSize: 13 }}>
              {S.noMistakes}
            </p>
          ) : (
            mistakes.map((m, idx) => (
              <div className="te-summary-item" key={idx}>
                <p className="q">{m.q}</p>
                <p className="a">
                  {S.yourAnswer}: {m.given} → {S.correctAnswer}: {m.correct}
                </p>
              </div>
            ))
          )}
          <button
            className="te-next"
            style={{ backgroundColor: '#E8834A', marginTop: 16 }}
            onClick={handleRestart}
          >
            {S.restart}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="te-root">
      <div className="te-header">
        <span className="te-tag">Target English • {title}</span>
        <span className="te-counter">
          {current + 1}/{items.length}
        </span>
        <div style={{ clear: 'both' }} />
        <div className="te-progress-track">
          <div
            className="te-progress-fill"
            style={{ width: `${Math.round(((current + 1) / items.length) * 100)}%` }}
          />
        </div>
      </div>
      <div className={`te-card ${flash || ''}`}>
        <p className="te-prompt">
          {current + 1}. {item.q}
        </p>
        <div className="te-options">
          {item.options.map((opt, i) => {
            let cls = 'te-opt';
            if (answered && i === item.correct) cls += ' correct';
            else if (answered && i === selectedIndex) cls += ' wrong';
            return (
              <button
                key={i}
                className={cls}
                disabled={answered}
                onClick={() => handleSelect(i)}
              >
                {String.fromCharCode(65 + i)}) {opt}
              </button>
            );
          })}
        </div>
        {feedback.text && (
          <p className={`te-feedback ${feedback.ok ? 'ok' : 'no'}`}>
            <span className="emoji">{feedback.emoji}</span> {feedback.text}
          </p>
        )}
        <button
          className="te-next"
          style={{ backgroundColor: answered ? '#E8834A' : '#2F7FE0' }}
          disabled={!answered}
          onClick={handleNext}
        >
          {answered ? (current < items.length - 1 ? S.next : S.finish) : S.chooseAnswer}
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
