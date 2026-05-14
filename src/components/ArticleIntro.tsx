import styles from './ArticleIntro.module.css';

export default function ArticleIntro() {
  return (
    <section className={`section ${styles.intro}`} id="introduccion">
      <div className={styles.layout}>
        <div className={styles.text}>
          <p>
            Durante la Edad del Hierro, el relieve de Galicia se transformó mediante la construcción
            de poblados fortificados. Los castros no fueron simples refugios temporales, sino la base
            de una organización social que aprovechó cada unidad geográfica —desde las laderas sobre
            el mar hasta las cumbres del interior— para asentar viviendas de piedra, trazar fosos y
            levantar murallas.
          </p>
          <p>
            El inventario actual supera los 2.000 yacimientos, aunque su estado de consolidación
            varía de forma drástica. Algunos conservan alzados que permiten leer su distribución
            original; otros permanecen ocultos bajo la maleza, delatados únicamente por la
            alteración artificial del relieve.
          </p>
          <p>
            La llegada de Roma no supuso la desaparición inmediata de esta red de poblamiento.
            Muchos castros mantuvieron su ocupación, incorporaron nuevas técnicas constructivas
            y adaptaron su trazado interno. En los grandes recintos, las cabañas circulares
            empezaron a convivir con calles empedradas, redes de drenaje y formas propias del
            incipiente modelo urbano.
          </p>
          <p>
            Este reportaje sitúa 50 de estos recintos en el mapa y detalla la arquitectura,
            cronología y posición estratégica de 30 asentamientos principales.
          </p>
        </div>
      </div>
    </section>
  );
}
