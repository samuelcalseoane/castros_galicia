import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { Castro, ContextCastroPoint } from '../data/castros';
import { TYPE_LABELS } from '../data/castros';
import galiciaGeo from '../data/galicia.geojson?url';
import styles from './GaliciaCastrosMap.module.css';

interface Props {
  castros: Castro[];
  contextualCastros: ContextCastroPoint[];
  selectedCastro: Castro | null;
  onSelectCastro: (c: Castro | null) => void;
}

const TYPE_COLORS: Record<string, string> = {
  costa: '#2f7f91',
  ria: '#5aa6ad',
  interior: '#5d7d59',
  urbano: '#ae4d32',
  montana: '#80684f',
  'gran-citania': '#7d5572',
  santuario: '#b46b42',
};

export default function GaliciaCastrosMap({ castros, contextualCastros, selectedCastro, onSelectCastro }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(galiciaGeo).then(r => r.json()).then(setGeoData);
  }, []);

  const filtered = useMemo(() => {
    let list = castros;
    if (filterProvince !== 'all') list = list.filter(c => c.province === filterProvince);
    if (filterType !== 'all') list = list.filter(c => c.landscapeType === filterType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.municipality.toLowerCase().includes(q) ||
        (c.area?.toLowerCase().includes(q))
      );
    }
    return list;
  }, [castros, filterProvince, filterType, searchQuery]);

  const filteredContext = useMemo(() => {
    let list = contextualCastros;
    if (filterProvince !== 'all') list = list.filter(c => c.province === filterProvince);
    if (filterType !== 'all') list = list.filter(c => c.landscapeType === filterType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.municipality.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contextualCastros, filterProvince, filterType, searchQuery]);

  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(500, Math.min(width * 1.1, 700));

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const projection = d3.geoMercator().fitSize([width - 40, height - 40], geoData);
    projection.translate([projection.translate()[0] + 20, projection.translate()[1] + 20]);
    const path = d3.geoPath().projection(projection);

    svg.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', '#cfe4e5');

    const graticule = d3.geoGraticule().step([1, 1]);
    svg.append('path')
      .datum(graticule())
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(24, 51, 39, 0.08)')
      .attr('stroke-width', 0.7);

    // Province shapes
    const provinces = svg.append('g').attr('class', 'provinces');
    provinces.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', '#f8f1df')
      .attr('stroke', '#9d9483')
      .attr('stroke-width', 0.9);

    // Province labels
    provinces.selectAll('text')
      .data(geoData.features)
      .join('text')
      .attr('x', (d: any) => (path.centroid(d)[0]))
      .attr('y', (d: any) => (path.centroid(d)[1]))
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9.5px')
      .attr('font-weight', '800')
      .attr('fill', 'rgba(24, 51, 39, 0.36)')
      .attr('letter-spacing', '0.1em')
      .text((d: any) => d.properties.name?.toUpperCase());

    const dots = svg.append('g').attr('class', 'dots');
    const tooltip = d3.select(tooltipRef.current);

    dots.selectAll('circle.context')
      .data(filteredContext)
      .join('circle')
      .attr('class', 'context')
      .attr('cx', d => projection([d.lon, d.lat])![0])
      .attr('cy', d => projection([d.lon, d.lat])![1])
      .attr('r', 3)
      .attr('fill', d => TYPE_COLORS[d.landscapeType] || '#666')
      .attr('opacity', 0.45)
      .attr('stroke', 'rgba(255, 250, 240, 0.4)')
      .attr('stroke-width', 0.5)
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).attr('r', 5);
        const [x, y] = projection([d.lon, d.lat])!;
        const svgRect = svgRef.current!.getBoundingClientRect();
        const tooltipX = svgRect.left + (x / width) * svgRect.width;
        const tooltipY = svgRect.top + (y / height) * svgRect.height;
        tooltip.style('display', 'block')
          .style('left', `${tooltipX}px`)
          .style('top', `${tooltipY - 10}px`)
          .html(`<strong>${d.shortName}</strong><br/><span>${d.municipality}, ${d.province}</span>`);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('r', 3);
        tooltip.style('display', 'none');
      });

    dots.selectAll('circle.selected')
      .data(filtered)
      .join('circle')
      .attr('class', 'selected')
      .attr('cx', d => projection([d.lon, d.lat])![0])
      .attr('cy', d => projection([d.lon, d.lat])![1])
      .attr('r', d => selectedCastro?.id === d.id ? 8 : 5)
      .attr('fill', d => TYPE_COLORS[d.landscapeType] || '#666')
      .attr('stroke', d => selectedCastro?.id === d.id ? '#ae4d32' : '#fffaf0')
      .attr('stroke-width', d => selectedCastro?.id === d.id ? 3 : 1.5)
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', d => `${d.name}, ${d.municipality}, ${d.province}`)
      .style('transition', 'r 0.2s, stroke-width 0.2s')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).attr('r', 8).attr('stroke-width', 2.5);
        const [x, y] = projection([d.lon, d.lat])!;
        const svgRect = svgRef.current!.getBoundingClientRect();
        const tooltipX = svgRect.left + (x / width) * svgRect.width;
        const tooltipY = svgRect.top + (y / height) * svgRect.height;
        tooltip.style('display', 'block')
          .style('left', `${tooltipX}px`)
          .style('top', `${tooltipY - 10}px`)
          .html(`<strong>${d.shortName}</strong><br/><span>${d.municipality}, ${d.province}</span>`);
      })
      .on('mouseleave', (event, d) => {
        if (selectedCastro?.id !== d.id) {
          d3.select(event.currentTarget).attr('r', 5).attr('stroke-width', 1.5);
        }
        tooltip.style('display', 'none');
      })
      .on('click', (_event, d) => {
        onSelectCastro(selectedCastro?.id === d.id ? null : d);
      })
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectCastro(selectedCastro?.id === d.id ? null : d);
        }
      });

  }, [geoData, filtered, filteredContext, selectedCastro]);

  const provinces = ['all', 'A Coruña', 'Lugo', 'Ourense', 'Pontevedra'];
  const types = ['all', ...Object.keys(TYPE_LABELS)];
  const visibleCount = filtered.length + filteredContext.length;
  const totalLocated = castros.length + contextualCastros.length;

  return (
    <section className={`section section--cream ${styles.mapSection}`}>
      <div className={`${styles.header} anchor-target`} id="mapa">
        <span className={styles.eyebrow}>Cartografía de la Edad del Hierro</span>
        <h2 className="section-title">Distribución de los asentamientos en Galicia</h2>
        <p className="section-subtitle">Localización de {totalLocated} enclaves principales, divididos por tipo de asentamiento.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="province-filter">Provincia</label>
          <select id="province-filter" className={styles.select} value={filterProvince} onChange={e => setFilterProvince(e.target.value)}>
            {provinces.map(p => (
              <option key={p} value={p}>{p === 'all' ? 'Todas las provincias' : p}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="type-filter">Categoría</label>
          <select id="type-filter" className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
            {types.map(l => (
              <option key={l} value={l}>{l === 'all' ? 'Todos los tipos' : TYPE_LABELS[l as keyof typeof TYPE_LABELS]}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="castro-search">Buscar</label>
          <input
            id="castro-search"
            type="text"
            placeholder="Nombre, concello o comarca"
            className={styles.search}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.count} aria-live="polite">
          <strong>{visibleCount}</strong>
          <span>visibles</span>
        </div>
      </div>

      <div className={`${styles.mapContainer} ${selectedCastro ? styles.mapContainerWithDetail : ''}`}>
        <div className={styles.mapWrapper} ref={containerRef}>
          <svg ref={svgRef} className={styles.svg} />
          <div ref={tooltipRef} className={styles.tooltip} style={{ display: 'none' }} />
        </div>

        {selectedCastro && (
          <aside className={styles.detail}>
            <button className={styles.detailClose} aria-label="Cerrar resumen" onClick={() => onSelectCastro(null)}>✕</button>
            <h3 className={styles.detailName}>{selectedCastro.name}</h3>
            <dl className={styles.detailMeta}>
              <dt>Concello</dt><dd>{selectedCastro.municipality}</dd>
              <dt>Provincia</dt><dd>{selectedCastro.province}</dd>
              <dt>Coordenadas</dt><dd>{selectedCastro.coordinatesLabel}</dd>
              <dt>Tipo</dt><dd>{TYPE_LABELS[selectedCastro.landscapeType]}</dd>
              {selectedCastro.chronology && <><dt>Cronología</dt><dd>{selectedCastro.chronology}</dd></>}
            </dl>
            <p className={styles.detailDesc}>{selectedCastro.description}</p>
            <a href={selectedCastro.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
              Fuente: {selectedCastro.sourceName} →
            </a>
          </aside>
        )}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendTitle}>Categorías</span>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: TYPE_COLORS[key] }} />
            {label}
          </span>
        ))}
        <span className={styles.legendItem}>
          <svg width="12" height="12" style={{ verticalAlign: 'middle', opacity: 0.45 }}>
            <circle cx="6" cy="6" r="4" fill="#888" />
          </svg>
          No definido
        </span>
      </div>
      <p className={styles.mapSource}>Cartografía: IGN y OpenStreetMap. Datos de los castros: Turismo de Galicia y bibliografía arqueológica publicada.</p>
    </section>
  );
}
