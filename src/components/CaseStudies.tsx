import styles from './CaseStudies.module.css';

const cases = [
  {
    id: 'barona',
    title: 'Castro de Baroña',
    place: 'Porto do Son · A Coruña',
    image: '/assets/castros/barona.jpg',
    imageAlt: 'Vista del castro de Baroña sobre una península rocosa frente al Atlántico',
    credit: 'Foto: Noel Feans · Wikimedia Commons (CC BY 2.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Castro_de_Baro%C3%B1a.jpg',
    lead:
      'Levantado sobre una lengua de roca batida por el Atlántico, este enclave es el ejemplo más estricto de adaptación al borde litoral.',
    text: [
      'Ocupado en torno al cambio de era, su defensa sigue una lógica impuesta por la geografía: como el mar ya cierra el perímetro por tres lados, el esfuerzo de ingeniería se concentra en el istmo, el único acceso terrestre. Tras esa barrera, las viviendas se asientan directamente sobre la piedra, desprotegidas ante el viento pero a salvo de incursiones terrestres.'
    ],
    claves: [
      { title: 'Un enclave litoral', text: 'la arquitectura asume el desnivel de la roca y confía su defensa a la bravura del Atlántico.' },
      { title: 'Cronología breve', text: 'su ocupación principal se concentra entre el siglo I a.C. y el siglo I d.C.' },
      { title: 'Defensa asimétrica', text: 'dos líneas de muralla aíslan el istmo, bloqueando el paso por tierra.' }
    ]
  },
  {
    id: 'santa-trega',
    title: 'Castro de Santa Trega',
    place: 'A Guarda · Pontevedra',
    image: '/assets/castros/santa-trega.jpg',
    imageAlt: 'Viviendas circulares excavadas en el castro de Santa Trega',
    credit: 'Foto: HombreDHojalata · Wikimedia Commons (CC BY-SA 3.0 ES)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Castro_de_Santa_Trega,_2011.jpg',
    lead:
      'Desde la cima que domina la desembocadura del Miño, este monte marca el salto hacia los poblados de gran escala.',
    text: [
      'La importancia de este asentamiento radica en su envergadura y en la densidad de sus construcciones. Conserva viviendas circulares, pavimentos, estructuras de almacenamiento y piezas ornamentales que evidencian el arraigo de una comunidad próspera. Su posición no era aleatoria: garantizaba la vigilancia del tramo final del río y el paso hacia el océano.'
    ],
    claves: [
      { title: 'Dominio visual', text: 'el monte ofrece un control absoluto sobre el estuario del Miño y la actual frontera portuguesa.' },
      { title: 'Siglos de ocupación', text: 'el asentamiento alcanzó su mayor desarrollo entre el siglo IV a.C. y el I d.C.' },
      { title: 'Urbanismo denso', text: 'concentra una gran cantidad de viviendas, patios familiares y rocas con grabados de épocas anteriores.' }
    ]
  },
  {
    id: 'san-cibrao',
    title: 'Castro de San Cibrao de Las',
    place: 'San Amaro y Punxín · Ourense',
    image: '/assets/castros/san-cibrao-las.jpg',
    imageAlt: 'Estructuras excavadas en la citania de San Cibrao de Las',
    credit: 'Foto: Luis Miguel Bugallo Sánchez · Wikimedia Commons (CC BY-SA 3.0)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:2011-06-19._Castro_de_San_Cibrao_de_Las_-_Galiza-3.jpg',
    lead:
      'Con más de diez hectáreas de extensión, este gran asentamiento refleja el punto de fricción entre el mundo castreño y la romanización.',
    text: [
      'Habitada hasta el siglo II d.C., San Cibrao de Las demuestra que los castros también funcionaron como ejes de poder territorial. Su configuración supera la simple agrupación de cabañas: el trazado incorpora calles pavimentadas, conducciones de agua y un recinto central acotado. Es un enclave diseñado para albergar a cientos de personas bajo un orden jerárquico sólido.'
    ],
    claves: [
      { title: 'Escala urbana', text: 'su extensión, superior a las diez hectáreas, lo convierte en uno de los recintos más amplios de Galicia.' },
      { title: 'Transición romana', text: 'habitado hasta el siglo II d.C., combina tradición local y formas foráneas.' },
      { title: 'Organización interna', text: 'dispone de un entramado viario planificado y áreas claramente diferenciadas.' }
    ]
  },
];

export default function CaseStudies() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`${styles.header} anchor-target`} id="casos">
        <span className={styles.eyebrow}>Tres hitos en el mapa</span>
        <h2 className="section-title">Baroña, Santa Trega y San Cibrao de Las</h2>
        <p className="section-subtitle">Del asentamiento marítimo cercado por el mar a la gran citania de interior. Tres ejemplos que explican cómo evolucionó el sistema defensivo y organizativo de la cultura castreña.</p>
      </div>
      <div className={styles.stack}>
        {cases.map((item) => (
          <article className={styles.case} key={item.id}>
            <figure className={styles.media}>
              <img src={item.image} alt={item.imageAlt} loading="lazy" />
              <figcaption>
                <a href={item.creditUrl} target="_blank" rel="noopener noreferrer">{item.credit}</a>
              </figcaption>
            </figure>
            <div className={styles.copy}>
              <p className={styles.place}>{item.place}</p>
              <h3>{item.title}</h3>
              <p className={styles.lead}>{item.lead}</p>
              {item.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className={styles.facts} aria-label={`Claves de ${item.title}`}>
                {item.claves.map((clave) => (
                  <p key={clave.title}><strong>{clave.title}:</strong> {clave.text}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
