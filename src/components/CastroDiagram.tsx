import styles from './CastroDiagram.module.css';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function CastroDiagram() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`${styles.header} anchor-target`} id="anatomia">
        <span className={styles.eyebrow}>Arquitectura y defensa</span>
        <h2 className="section-title">Anatomía del poblado</h2>
        <p className="section-subtitle">El sistema defensivo solía combinar murallas de piedra, terraplenes y fosos. En el interior, las casas circulares u ovaladas se agrupaban en barrios, con muros compartidos, hogares, almacenes y zonas comunes de tránsito.</p>
      </div>
      <div className={styles.figure}>
        <div className={styles.wrapper}>
          <img src={assetPath('assets/castros/anatomia.png')} alt="Esquema arquitectónico de un castro gallego" className={styles.diagram} />
        </div>
        <ol className={styles.notes}>
          <li>
            <strong>Perímetro defensivo</strong>
            <span>Sucesión de fosos, terraplenes y murallas concéntricas que blindan el asentamiento y exponen al visitante o atacante.</span>
          </li>
          <li>
            <strong>Accesos vigilados</strong>
            <span>La entrada es el punto más vulnerable. A menudo se estrecha o dibuja curvas forzadas para controlar el flujo de entrada.</span>
          </li>
          <li>
            <strong>Viviendas y talleres</strong>
            <span>La población se concentra en cabañas de piedra, generalmente de planta circular u ovalada, con techumbre vegetal.</span>
          </li>
          <li>
            <strong>Plaza central (Croa)</strong>
            <span>Núcleo del poblado destinado a la vida comunitaria, el acopio de bienes y las tareas que requieren gran espacio compartido.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
