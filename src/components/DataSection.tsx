import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Castro } from '../data/castros';
import { TYPE_LABELS, PROVINCE_COLORS } from '../data/castros';
import styles from './DataSection.module.css';

interface Props { castros: Castro[]; }

const TYPE_EXPLAINERS: Array<{ key: Castro['landscapeType']; title: string; text: string }> = [
  { key: 'costa', title: 'Costero', text: 'Asentado en penínsulas o acantilados, con el mar como defensa natural.' },
  { key: 'ria', title: 'De ría', text: 'Situado en laderas o puntas orientadas a aguas abrigadas, con control sobre recursos marinos y pasos locales.' },
  { key: 'interior', title: 'Interior', text: 'Ubicado en colinas que dominan valles agrícolas, cursos de agua y vías fluviales.' },
  { key: 'urbano', title: 'Urbano', text: 'Yacimiento integrado o rodeado por el crecimiento de las ciudades actuales.' },
  { key: 'montana', title: 'De montaña', text: 'Construido a cotas elevadas, con un carácter marcadamente defensivo o de control de pasos.' },
  { key: 'gran-citania', title: 'Gran citania', text: 'Poblado de gran extensión, con trazado de calles, barrios diferenciados y sistemas de drenaje.' },
  { key: 'santuario', title: 'Santuario / Ritual', text: 'Espacio donde la actividad religiosa y las ofrendas pesan tanto o más que la habitacional.' },
];

export default function DataSection({ castros }: Props) {
  const provinceRef = useRef<SVGSVGElement>(null);
  const typeRef = useRef<SVGSVGElement>(null);
  const provinceCounts = d3.rollups(castros, v => v.length, d => d.province).sort((a, b) => b[1] - a[1]);
  const typeCounts = d3.rollups(castros, v => v.length, d => d.landscapeType).sort((a, b) => b[1] - a[1]);
  const topProvince = provinceCounts[0];
  const topType = typeCounts[0];
  const coastalCount = castros.filter(c => c.landscapeType === 'costa' || c.landscapeType === 'ria').length;

  useEffect(() => {
    drawBarChart(provinceRef.current!, castros, 'province', PROVINCE_COLORS);
  }, [castros]);

  useEffect(() => {
    const LCOLORS: Record<string, string> = {
      costa: '#2f7f91', ria: '#5aa6ad', interior: '#5d7d59', urbano: '#ae4d32',
      montana: '#80684f', 'gran-citania': '#7d5572', santuario: '#b46b42',
    };
    drawBarChart(typeRef.current!, castros, 'landscapeType', LCOLORS, TYPE_LABELS);
  }, [castros]);

  return (
    <section className="section">
      <div className={`${styles.header} anchor-target`} id="datos">
        <span className={styles.eyebrow}>Patrones de asentamiento</span>
        <h2 className="section-title">Del litoral a la montaña</h2>
        <p className="section-subtitle">La adaptación al entorno generó soluciones arquitectónicas diversas. No es igual el urbanismo de una gran citania de interior que la resistencia de un pequeño castro costero.</p>
      </div>
      <div className={styles.findings} aria-label="Tres datos destacados">
        <div>
          <strong>{topProvince?.[0]}</strong>
          <span>concentra más yacimientos en la selección analizada</span>
        </div>
        <div>
          <strong>{coastalCount}</strong>
          <span>se asoman al mar, a una ría o al borde atlántico</span>
        </div>
        <div>
          <strong>{topType ? TYPE_LABELS[topType[0]] : 'Interior'}</strong>
          <span>es la categoría más frecuente dentro del conjunto</span>
        </div>
      </div>
      <div className={styles.charts}>
        <figure className={styles.chartBlock}>
          <h3 className={styles.chartTitle}>Distribución provincial</h3>
          <svg ref={provinceRef} className={styles.chart} aria-label="Reparto por provincia" />
          <figcaption>Reparto territorial del núcleo analizado. La selección incluye yacimientos de las cuatro provincias.</figcaption>
        </figure>
        <figure className={styles.chartBlock}>
          <h3 className={styles.chartTitle}>Clasificación de los asentamientos</h3>
          <svg ref={typeRef} className={styles.chart} aria-label="Reparto por tipo de castro" />
          <figcaption>Las categorías agrupan los castros por morfología, escala o posición geográfica dominante.</figcaption>
        </figure>
      </div>
      <div className={styles.typeGuide} aria-label="Tipos de castro">
        {TYPE_EXPLAINERS.map((item) => (
          <article className={styles.typeItem} key={item.key}>
            <span className={styles.typeSwatch} style={{ background: item.key === 'costa' ? '#2f7f91' : item.key === 'ria' ? '#5aa6ad' : item.key === 'interior' ? '#5d7d59' : item.key === 'urbano' ? '#ae4d32' : item.key === 'montana' ? '#80684f' : item.key === 'gran-citania' ? '#7d5572' : '#b46b42' }} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function drawBarChart(
  el: SVGSVGElement,
  castros: Castro[],
  key: 'province' | 'landscapeType',
  colors: Record<string, string>,
  labels?: Record<string, string>
) {
  const svg = d3.select(el);
  svg.selectAll('*').remove();

  const counts: Record<string, number> = {};
  castros.forEach(c => { const k = c[key]; counts[k] = (counts[k] || 0) + 1; });
  const data = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const margin = { top: 10, right: 42, bottom: 10, left: 145 };
  const barH = 24;
  const gap = 9;
  const height = data.length * (barH + gap) + margin.top + margin.bottom;
  const width = 540;

  svg.attr('viewBox', `0 0 ${width} ${height}`);

  const max = d3.max(data, d => d[1]) || 1;
  const x = d3.scaleLinear().domain([0, max]).nice().range([margin.left, width - margin.right]);

  data.forEach(([name, count], i) => {
    const y = margin.top + i * (barH + gap);
    const label = labels ? (labels[name] || name) : name;

    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y + barH + gap / 2)
      .attr('y2', y + barH + gap / 2)
      .attr('stroke', '#dfd8ca')
      .attr('stroke-width', 0.7);

    svg.append('text')
      .attr('x', margin.left - 8).attr('y', y + barH / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('fill', '#183327').text(label);

    svg.append('rect')
      .attr('x', margin.left).attr('y', y)
      .attr('width', width - margin.left - margin.right).attr('height', barH)
      .attr('fill', '#f1eadb').attr('rx', 3);

    svg.append('rect')
      .attr('x', margin.left).attr('y', y)
      .attr('width', 0).attr('height', barH)
      .attr('fill', colors[name] || '#999').attr('rx', 3)
      .transition().duration(600).delay(i * 80)
      .attr('width', x(count) - margin.left);

    svg.append('text')
      .attr('x', x(count) + 6).attr('y', y + barH / 2)
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'Inter, sans-serif').attr('font-size', '13px')
      .attr('font-weight', '800').attr('fill', '#2a2a28')
      .text(count);
  });
}
