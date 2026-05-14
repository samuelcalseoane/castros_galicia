import styles from './Timeline.module.css';

const periods = [
  { label: 'Bronce Final', range: '~1200–800 a.C.', desc: 'Primeros asentamientos estables en altura. Todavía no son castros tal y como los conocemos, pero sí su antecedente directo.', color: '#795548' },
  { label: 'Edad del Hierro', range: '~800–200 a.C.', desc: 'Etapa central. Se multiplican los poblados fortificados, se levantan murallas y se consolida la casa redonda de piedra.', color: '#2D6A4F' },
  { label: 'Romanización', range: '~200 a.C.–400 d.C.', desc: 'Roma llega al noroeste. Algunos castros crecen y se transforman; otros se abandonan. Aparecen los primeros rasgos urbanos.', color: '#D4AF62' },
  { label: 'Abandono y reutilización', range: '~400–800 d.C.', desc: 'Los castros dejan de tener sentido defensivo. Las ruinas pasan a usarse como necrópolis, ermitas, canteras o pasto.', color: '#9EB9BC' },
  { label: 'Redescubrimiento', range: 's. XIX–XXI', desc: 'Primeras excavaciones, musealización de algunos yacimientos y un debate público que todavía está abierto.', color: '#ae4d32' },
];

export default function Timeline() {
  return (
    <section className={`section section--cream`} id="cronologia">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Cronología</span>
        <h2 className="section-title">Evolución del modelo castreño</h2>
        <p className="section-subtitle">Desde las primeras ocupaciones estables en altura hasta el uso intensivo de la piedra y la influencia de la planta cuadrangular romana.</p>
      </div>
      <div className={styles.timeline}>
        {periods.map((p, i) => (
          <div key={i} className={styles.period}>
            <div className={styles.dot} style={{ background: p.color }} />
            <div className={styles.line} style={{ background: i < periods.length - 1 ? p.color : 'transparent' }} />
            <div className={styles.content}>
              <span className={styles.range}>{p.range}</span>
              <h3 className={styles.periodTitle}>{p.label}</h3>
              <p className={styles.desc}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
