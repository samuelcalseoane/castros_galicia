import styles from './FooterSources.module.css';

export default function FooterSources() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.credits}>
          <h4>Fuentes y metodología</h4>
          <p>
            Los datos de los yacimientos —nombres, localización, descripciones y cronologías— proceden de las
            fichas de{' '}
            <a href="https://www.turismo.gal/" target="_blank" rel="noopener noreferrer">Turismo de Galicia</a>{' '}
            y de bibliografía arqueológica publicada, completadas con fuentes locales.
          </p>
          <p>
            La cartografía base y los límites provinciales son del Instituto Geográfico Nacional
            (IGN) y OpenStreetMap. Los castros que no tienen resumen propio en la pieza se han
            situado sobre referencias abiertas.
          </p>
          <p>
            Las coordenadas se han revisado una a una. Cuando un dato no estaba bien establecido,
            se ha optado por la versión más prudente.
          </p>
          <p>
            Fotografías de Baroña, Santa Trega y San Cibrao de Las: Wikimedia Commons. La
            atribución completa figura al pie de cada imagen.
          </p>
        </div>
        <div className={styles.legal}>
          <p>© {new Date().getFullYear()} · En colaboración con RUELA.</p>
        </div>
      </div>
    </footer>
  );
}
