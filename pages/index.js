import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function Home({ exercises }) {
  return (
    <div className="page">
      <div className="home-list">
        <h1 className="home-title">IELTS Vocabulary</h1>
        <p className="home-sub">Band 7–8 Academic Writing • Olena Kurilets</p>
        <div className="exercise-grid">
          {exercises.map((ex) => (
            <Link key={ex.slug} href={`/g/${ex.slug}`} className="exercise-card-link">
              <div className="exercise-card-title">{ex.title}</div>
              <div className="exercise-card-meta">
                {ex.level} • {ex.topic}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const indexPath = path.join(process.cwd(), 'data', 'exercises', 'index.json');
  const exercises = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  return { props: { exercises } };
}
