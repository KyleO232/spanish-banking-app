import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemedBackground from './ThemedBackground.jsx';

const POSITION_CYCLE = ['left', 'center', 'right', 'center'];

export default function LessonPath({ lessons }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const sectionRefs = useRef(new Map());
  const [pathD, setPathD] = useState('');
  const [svgHeight, setSvgHeight] = useState(0);
  const [segments, setSegments] = useState([]);

  let pathIndex = 0;
  let lastModuleId = null;
  const items = [];

  lessons.forEach((lesson) => {
    if (lesson.moduleId !== lastModuleId) {
      items.push({
        type: 'banner',
        key: `banner-${lesson.moduleId}`,
        title: lesson.moduleTitle,
        moduleId: lesson.moduleId,
      });
      lastModuleId = lesson.moduleId;
    }
    items.push({
      type: 'node',
      key: lesson.key,
      lesson,
      pos: POSITION_CYCLE[pathIndex % POSITION_CYCLE.length],
    });
    pathIndex += 1;
  });

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const points = lessons
        .map((lesson) => nodeRefs.current.get(lesson.key))
        .filter(Boolean)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
          };
        });

      setPathD(
        points.length < 2
          ? ''
          : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
      );
      setSvgHeight(container.scrollHeight);

      const moduleStarts = [];
      const seen = new Set();
      lessons.forEach((lesson) => {
        if (seen.has(lesson.moduleId)) return;
        seen.add(lesson.moduleId);
        const bannerEl = sectionRefs.current.get(lesson.moduleId);
        if (!bannerEl) return;
        moduleStarts.push({
          moduleId: lesson.moduleId,
          theme: lesson.moduleTheme,
          top: bannerEl.getBoundingClientRect().top - containerRect.top,
        });
      });

      const withHeights = moduleStarts.map((seg, i) => {
        const nextTop = i + 1 < moduleStarts.length ? moduleStarts[i + 1].top : container.scrollHeight;
        return { ...seg, height: nextTop - seg.top };
      });
      setSegments(withHeights);
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [lessons]);

  return (
    <div className="lesson-path" ref={containerRef}>
      {segments.map((seg) => (
        <div
          key={seg.moduleId}
          className="lesson-theme-layer"
          style={{ top: seg.top, height: seg.height }}
        >
          <ThemedBackground theme={seg.theme} />
        </div>
      ))}
      <svg className="lesson-path-svg" width="100%" height={svgHeight} preserveAspectRatio="none" aria-hidden="true">
        <path d={pathD} className="lesson-path-line" fill="none" />
      </svg>
      {items.map((item) =>
        item.type === 'banner' ? (
          <Link
            key={item.key}
            to={`/module/${item.moduleId}`}
            className="module-banner"
            ref={(el) => {
              if (el) sectionRefs.current.set(item.moduleId, el);
              else sectionRefs.current.delete(item.moduleId);
            }}
          >
            <span>{item.title}</span>
            <span className="module-banner-chev">›</span>
          </Link>
        ) : (
          <LessonNode
            key={item.key}
            lesson={item.lesson}
            pos={item.pos}
            registerRef={(el) => {
              if (el) nodeRefs.current.set(item.lesson.key, el);
              else nodeRefs.current.delete(item.lesson.key);
            }}
          />
        )
      )}
    </div>
  );
}

function LessonNode({ lesson, pos, registerRef }) {
  const { moduleId, block, state, moduleComplete } = lesson;
  const icon = state === 'locked' ? '🔒' : state === 'completed' ? '✓' : '★';
  const nodeClass = `lesson-node state-${state}${moduleComplete ? ' module-complete' : ''}`;

  const inner = (
    <>
      {state === 'current' && (
        <span className="lesson-pin" aria-hidden="true">
          📍
        </span>
      )}
      <span ref={registerRef} className={nodeClass}>
        <span aria-hidden="true">{icon}</span>
      </span>
      <span className="lesson-node-label">{block}</span>
    </>
  );

  return (
    <div className={`lesson-row pos-${pos}`}>
      {state === 'locked' ? (
        <div className="lesson-node-wrap" aria-disabled="true">
          {inner}
        </div>
      ) : (
        <Link
          to={`/module/${moduleId}/lesson/${encodeURIComponent(block)}`}
          className="lesson-node-wrap"
          aria-label={`${block} — ${state === 'completed' ? 'completed' : 'current lesson'}`}
        >
          {inner}
        </Link>
      )}
    </div>
  );
}
