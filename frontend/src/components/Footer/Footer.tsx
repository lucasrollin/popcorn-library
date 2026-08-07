import styles from './Footer.module.scss';

// TMDB's terms of use require every application built on their API to show
// their logo and this exact non-endorsement notice. This is a contractual
// obligation, not a courtesy — they can revoke API access without notice.
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoLink}
      >
        <img src="/tmdb-logo.svg" alt="TMDB" className={styles.logo} />
      </a>
      <p className={styles.disclaimer}>
        This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise
        approved by TMDB.
      </p>
    </footer>
  );
};

export default Footer;
