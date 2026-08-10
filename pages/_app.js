import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600;700&display=swap&subset=cyrillic,cyrillic-ext,latin"
          rel="stylesheet"
        />
        <title>IELTS Vocabulary Training — Target English</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
