import styles from './Header.module.css';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const navItems = [
  { href: '#mapa', label: 'El mapa' },
  { href: '#datos', label: 'El entorno' },
  { href: '#anatomia', label: 'El poblado' },
  { href: '#casos', label: 'Ejemplos clave' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label="RUELA">
          <img src={assetPath('assets/ruela-logo-horizontal-sm.png')} alt="RUELA" className={styles.logo} />
        </a>
        <nav className={styles.nav} aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <span className={styles.label}>Los castros de Galicia</span>
      </div>
    </header>
  );
}
