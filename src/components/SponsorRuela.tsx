import styles from './SponsorRuela.module.css';

export default function SponsorRuela() {
  return (
    <section className={`section ${styles.sponsor}`} id="patrocinio" aria-label="Patrocinio">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>En colaboración con</span>
        <div className={styles.brandGroup}>
          <img src="/assets/ruela-logo-horizontal.png" alt="RUELA" className={styles.logo} />
        </div>
        <p className={styles.copy}>
          RUELA es una plataforma gallega de planes culturales y de ocio.
        </p>
      </div>
    </section>
  );
}
