import { useEffect, useRef } from 'react';
import { img, photos } from '../data/work';
import { ChevronL, ChevronR, Close } from './Icons';

/** Paint-chip photo card: photo on top, swatch + caption below. */
export function ChipCard({ id, onOpen, tape, tapeTone = 'is-orange', sizes = '(min-width: 900px) 380px, 80vw', eager = false, ratio, className = '', style }) {
  const p = photos[id];
  const i = img(id);
  return (
    <figure className={`chipcard ${className}`} style={{ ...style, ...(ratio ? { '--ar': ratio } : null) }}>
      {tape && <span className={`tape ${tapeTone}`}>{tape}</span>}
      <button
        type="button"
        className="chipcard-btn"
        onClick={() => onOpen?.(id)}
        aria-label={`Enlarge photo: ${p.caption}`}
      >
        <img
          src={i.src}
          srcSet={i.srcSet}
          sizes={sizes}
          width={i.width}
          height={i.height}
          alt={p.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </button>
      <figcaption>
        <span className="swatch" style={{ background: i.color }} aria-hidden="true" />
        <span>
          <span className="cap">{p.caption}</span>
          <span className="sub">{p.tag}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Plain responsive photo (no card chrome). */
export function Pic({ id, sizes = '100vw', eager = false, className, ratio }) {
  const p = photos[id];
  const i = img(id);
  return (
    <img
      className={className}
      src={i.src}
      srcSet={i.srcSet}
      sizes={sizes}
      width={i.width}
      height={i.height}
      alt={p.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={ratio ? { aspectRatio: ratio, objectFit: 'cover' } : undefined}
    />
  );
}

/** Native <dialog> lightbox: focus is trapped and Esc closes it. Arrow keys move between photos. */
export function Lightbox({ ids, index, onClose, onIndex }) {
  const ref = useRef(null);
  const open = index != null && ids?.length > 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % ids.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + ids.length) % ids.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, ids, onIndex]);

  if (!open) return <dialog ref={ref} className="lightbox" onClose={onClose} />;
  const id = ids[index];
  const p = photos[id];
  const i = img(id);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={p.caption}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      <div className="lightbox-in">
        <button className="lb-close" onClick={() => ref.current.close()} aria-label="Close photo">
          <Close />
        </button>
        <img src={i.src} srcSet={i.srcSet} sizes="95vw" alt={p.alt} width={i.width} height={i.height} />
        <div className="lb-bar">
          <div>
            <strong>{p.caption}</strong>
            <span>
              {p.tag} · {index + 1} of {ids.length}
            </span>
          </div>
          {ids.length > 1 && (
            <div className="lb-nav">
              <button onClick={() => onIndex((index - 1 + ids.length) % ids.length)} aria-label="Previous photo">
                <ChevronL />
              </button>
              <button onClick={() => onIndex((index + 1) % ids.length)} aria-label="Next photo">
                <ChevronR />
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
