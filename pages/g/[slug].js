import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import McqEngine from '../../components/McqEngine';
import FlashcardEngine from '../../components/FlashcardEngine';
import WordBankEngine from '../../components/WordBankEngine';

export default function ExercisePage({ exercise }) {
  return (
    <div className="page">
      <Link href="/" className="back-link">
        ← All exercises
      </Link>
      {exercise.type === 'flashcards' ? (
        <FlashcardEngine exercise={exercise} />
      ) : exercise.type === 'wordbank' ? (
        <WordBankEngine exercise={exercise} />
      ) : (
        <McqEngine exercise={exercise} />
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const indexPath = path.join(process.cwd(), 'data', 'exercises', 'index.json');
  const list = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  return {
    paths: list.map((ex) => ({ params: { slug: ex.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', 'exercises', `${params.slug}.json`);
  const exercise = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return { props: { exercise } };
}
