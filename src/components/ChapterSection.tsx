import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Castro } from '../data/castros';
import { TYPE_LABELS, PROVINCE_COLORS } from '../data/castros';
import galiciaGeo from '../data/galicia.geojson?url';
import styles from './ChapterSection.module.css';

interface Chapter {
  number: string;
  title: string;
  id: string;
  quote: string;
  text: string[];
  castroIds: string[];
}

interface Props {
  chapter: Chapter;
  castros: Castro[];
  index: number;
}

function MiniMap({ castros }: { castros: Castro[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const w = 310, h = 360;
    svg.attr('viewBox', `0 0 ${w} ${h}`);

    fetch(galiciaGeo).then(r => r.json()).then(geo => {
      const projection = d3.geoMercator().fitSize([w - 90, h - 72], geo);
      projection.translate([projection.translate()[0] + 45, projection.translate()[1] + 36]);
      const path = d3.geoPath().projection(projection);

      svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#cfe4e5');
      const provinceLayer = svg.append('g').attr('class', 'province-layer');
      provinceLayer.selectAll('path').data(geo.features).join('path')
        .attr('class', 'province')
        .attr('d', path as any)
        .attr('fill', '#fff6df')
        .attr('stroke', '#183327')
        .attr('stroke-opacity', 0.42)
        .attr('stroke-width', 0.85);

      // Compact "leader-line" label layout: place labels in two columns
      // (left/right of the map) so they never overlap. The point's vertical
      // position guides the order; the connecting line keeps the link clear.
      const projected = castros.map((d, i) => {
        const [px, py] = projection([d.lon, d.lat]) ?? [0, 0];
        return { d, i, px, py };
      });

      const midX = w / 2;
      const leftCol = projected.filter(p => p.px < midX).sort((a, b) => a.py - b.py);
      const rightCol = projected.filter(p => p.px >= midX).sort((a, b) => a.py - b.py);

      const showLabels = castros.length <= 8;
      const labelH = 12;
      const labelLayout = new Map<number, { lx: number; ly: number; anchor: 'start' | 'end' }>();

      function packColumn(col: typeof projected, x: number, anchor: 'start' | 'end') {
        const topPad = 14;
        const bottomPad = h - 14;
        const n = col.length;
        if (n === 0) return;
        const minY = topPad;
        const maxY = bottomPad;
        const ys: number[] = col.map(p => Math.max(minY, Math.min(maxY, p.py)));
        // Resolve overlaps: ensure each y is at least labelH below the previous.
        for (let i = 1; i < n; i++) {
          if (ys[i] < ys[i - 1] + labelH) ys[i] = ys[i - 1] + labelH;
        }
        // If bottom overflows, push earlier ones up.
        if (ys[n - 1] > maxY) {
          ys[n - 1] = maxY;
          for (let i = n - 2; i >= 0; i--) {
            if (ys[i] > ys[i + 1] - labelH) ys[i] = ys[i + 1] - labelH;
          }
        }
        col.forEach((p, idx) => {
          labelLayout.set(p.i, { lx: x, ly: ys[idx], anchor });
        });
      }

      packColumn(leftCol, 6, 'start');
      packColumn(rightCol, w - 6, 'end');

      const points = svg.append('g').selectAll('g').data(castros).join('g');

      if (showLabels) {
        points.append('line')
          .attr('x1', (_d, i) => projected[i].px)
          .attr('y1', (_d, i) => projected[i].py)
          .attr('x2', (_d, i) => labelLayout.get(i)?.lx ?? projected[i].px)
          .attr('y2', (_d, i) => labelLayout.get(i)?.ly ?? projected[i].py)
          .attr('stroke', 'rgba(24, 51, 39, 0.32)')
          .attr('stroke-width', 0.6);
      }

      points.append('circle')
        .attr('cx', (_d, i) => projected[i].px)
        .attr('cy', (_d, i) => projected[i].py)
        .attr('r', 4.2)
        .attr('fill', d => PROVINCE_COLORS[d.province])
        .attr('stroke', '#fffaf0')
        .attr('stroke-width', 1.2);

      if (showLabels) {
        points.append('text')
          .attr('x', (_d, i) => labelLayout.get(i)?.lx ?? projected[i].px)
          .attr('y', (_d, i) => labelLayout.get(i)?.ly ?? projected[i].py)
          .attr('text-anchor', (_d, i) => labelLayout.get(i)?.anchor ?? 'start')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', 8.4)
          .attr('font-weight', 800)
          .attr('fill', '#183327')
          .text(d => d.shortName);
      }
    });
  }, [castros]);

  return <svg ref={ref} className={styles.miniMap} />;
}

export default function ChapterSection({ chapter, castros, index }: Props) {
  const provinces = Array.from(new Set(castros.map(c => c.province)));
  const types = Array.from(new Set(castros.map(c => TYPE_LABELS[c.landscapeType])));
  const leadCastro = castros[0];

  return (
    <section className={`section ${styles.chapter} ${index % 2 === 1 ? styles.chapterAlt : ''}`} id={`capitulo-${chapter.id}`}>
      <div className={styles.header}>
        <span className="chapter-number">{chapter.number}</span>
        <h2 className="chapter-title">{chapter.title}</h2>
        <blockquote className={styles.chapterQuote}>{chapter.quote}</blockquote>
        <div className={styles.facts} aria-label="Cifras del capítulo">
          <div><strong>{castros.length}</strong><span>{castros.length === 1 ? 'castro' : 'castros'}</span></div>
          <div><strong>{provinces.length}</strong><span>{provinces.length === 1 ? 'provincia' : 'provincias'}</span></div>
          <div><strong>{types.length}</strong><span>{types.length === 1 ? 'tipo' : 'tipos'}</span></div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.textCol}>
          {chapter.text.map((para, i) => (
            <p key={i} className={styles.para}>{para}</p>
          ))}
        </div>
        <div className={styles.sideCol}>
          <MiniMap castros={castros} />
          {leadCastro && (
            <div className={styles.caseStudy}>
              <span>Castro de referencia</span>
              <h3>{leadCastro.shortName}</h3>
              <p>{leadCastro.municipality} · {leadCastro.province}</p>
            </div>
          )}
          <div className={styles.castroList}>
            <h4 className={styles.listTitle}>Castros del capítulo</h4>
            {castros.map(c => (
              <div key={c.id} className={styles.castroItem}>
                <strong>{c.shortName}</strong>
                <span>{c.municipality} · {TYPE_LABELS[c.landscapeType]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
