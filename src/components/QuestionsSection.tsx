import styles from './QuestionsSection.module.css';

const questions = [
  {
    number: '01',
    title: '¿Qué es, exactamente, un castro?',
    answer:
      'Un poblado fortificado característico del noroeste peninsular. Su rasgo principal es el aprovechamiento del terreno para la defensa, reforzado con murallas, fosos y parapetos alrededor de un espacio habitacional de casas generalmente circulares.',
  },
  {
    number: '02',
    title: '¿En qué época estuvieron habitados?',
    answer:
      'La mayoría se desarrollaron durante la Edad del Hierro, con un auge entre los siglos IV y II a.C. Muchos siguieron activos tras la conquista romana y prolongaron su vida hasta el siglo II d.C. o incluso más tarde.',
  },
  {
    number: '03',
    title: '¿Por qué se construían en lugares elevados?',
    answer:
      'La altura daba control visual, facilitaba la defensa y reforzaba la posición del poblado sobre su entorno inmediato. Desde una cumbre o una loma se vigilaban cultivos, vías de paso, rías o desembocaduras.',
  },
  {
    number: '04',
    title: '¿Cuántos se pueden visitar hoy?',
    answer:
      'Aunque existen más de 2.000 catalogados, solo una parte está excavada y acondicionada para la visita. Muchos se encuentran en terrenos privados, zonas forestales o bajo tierras de labor, con las estructuras todavía ocultas bajo el suelo.',
  },
];

export default function QuestionsSection() {
  return (
    <section className={`section ${styles.questions}`} id="claves">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Contexto histórico</span>
          <h2>Claves de la cultura castreña</h2>
        </div>
        <div className={styles.grid}>
          {questions.map((item) => (
            <article className={styles.item} key={item.number}>
              <span className={styles.number}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
