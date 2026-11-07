/**
 * Recreated wordmark (not a copy of Ryan's logo file): "southwest" + blue "pro", a roof line above,
 * and "painting" tucked under. Colors follow his logo: charcoal and blue.
 */
export default function Logo({ inverted = false }) {
  return (
    <span className={`logo${inverted ? ' is-inverted' : ''}`}>
      <svg className="logo-roof" viewBox="0 0 160 26" aria-hidden="true" focusable="false">
        <path d="M2 24 L96 4 L158 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-word" aria-hidden="true">
        southwest<b>pro</b>
      </span>
      <span className="logo-sub" aria-hidden="true">painting</span>
      <span className="vh">Southwest Pro Painting</span>
    </span>
  );
}
