import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import galiciaGeo from '../data/galicia.geojson?url';
import { castros, contextualCastroPoints } from '../data/castros';
import styles from './Hero.module.css';

export default function Hero() {
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const svg = d3.select(mapRef.current);
    svg.selectAll('*').remove();

    const width = 920;
    const height = 740;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    fetch(galiciaGeo)
      .then(r => r.json())
      .then(geo => {
        const projection = d3.geoMercator().fitSize([width - 130, height - 100], geo);
        projection.translate([projection.translate()[0] + 78, projection.translate()[1] + 36]);
        const path = d3.geoPath().projection(projection);

        const defs = svg.append('defs');
        defs.append('filter')
          .attr('id', 'hero-map-shadow')
          .append('feDropShadow')
          .attr('dx', 0)
          .attr('dy', 16)
          .attr('stdDeviation', 18)
          .attr('flood-color', '#061512')
          .attr('flood-opacity', 0.28);

        svg.append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#143b4a')
          .attr('opacity', 0.42);

        const graticule = d3.geoGraticule().step([0.8, 0.8]);
        svg.append('path')
          .datum(graticule())
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 250, 240, 0.12)')
          .attr('stroke-width', 0.9);

        svg.append('g')
          .attr('filter', 'url(#hero-map-shadow)')
          .selectAll('path')
          .data(geo.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', 'rgba(239, 228, 199, 0.84)')
          .attr('stroke', 'rgba(255, 250, 240, 0.58)')
          .attr('stroke-width', 1.2);

        svg.append('g')
          .selectAll('circle')
          .data(contextualCastroPoints)
          .join('circle')
          .attr('cx', d => projection([d.lon, d.lat])?.[0] ?? 0)
          .attr('cy', d => projection([d.lon, d.lat])?.[1] ?? 0)
          .attr('r', 2.3)
          .attr('fill', 'rgba(255, 250, 240, 0.42)');

        const sites = svg.append('g')
          .selectAll('g')
          .data(castros)
          .join('g')
          .attr('transform', d => {
            const point = projection([d.lon, d.lat]) ?? [0, 0];
            return `translate(${point[0]},${point[1]})`;
          });

        sites.append('circle')
          .attr('r', 9)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(174, 77, 50, 0.5)')
          .attr('stroke-width', 1.6);

        sites.append('circle')
          .attr('r', 3.2)
          .attr('fill', '#ae4d32')
          .attr('stroke', '#fffaf0')
          .attr('stroke-width', 1);

      });
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.scene} aria-hidden="true">
        <svg ref={mapRef} className={styles.sceneSvg} />
      </div>
      <div className={styles.inner}>
        <p className={styles.kicker}>Los castros de Galicia</p>
        <h1 className={styles.title}>El mapa de una Galicia fortificada</h1>
        <p className={styles.subtitle}>
          Más de 2.000 poblados fortificados se reparten por montes, rías y cabos gallegos.
          Este mapa sitúa 50 enclaves para explicar cómo se defendían, cómo se habitaban y
          cómo evolucionaron entre la Edad del Hierro y los primeros siglos de nuestra era.
        </p>
        <div className={styles.stats} aria-label="Tres datos para empezar">
          <div>
            <strong>+2.000</strong>
            <span>poblados fortificados inventariados en Galicia</span>
          </div>
          <div>
            <strong>10 ha</strong>
            <span>son las que ocupa San Cibrao de Las, una de las mayores citanias</span>
          </div>
          <div>
            <strong>+90</strong>
            <span>aras votivas documentadas en el santuario de O Facho</span>
          </div>
        </div>
      </div>
      <div className={styles.scrollHint}>
        <span>Leer el reportaje</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
