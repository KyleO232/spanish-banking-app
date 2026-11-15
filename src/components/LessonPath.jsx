import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Lock, MapPin, Star } from 'lucide-react';
import ThemedBackground from './ThemedBackground.jsx';
import Monedita from './Monedita.jsx';

const POSITION_CYCLE = ['left', 'center', 'right', 'center'];

export default function LessonPath({ lessons }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const sectionRefs = useRef(new Map());
  const [pathD, setPathD] = useState('');
  const [svgHeight, setSvgHeight] = useState(0);
  const [segments, setSegments] = useState([]);

  // Group lessons by module (in order), keeping each lesson's zigzag position.
  const groups = [];
  lessons.forEach((lesson, index) => {
    let group = groups[groups.length - 1];
    if (!group || group.moduleId !== lesson.moduleId) {
      group = { moduleId: lesson.moduleId, title: lesson.moduleTitle, nodes: [] };
      groups.push(group);
    }
    group.nodes.push({ lesson, pos: POSITION_CYCLE[index % POSITION_CYCLE.length] });
  });

  // The path runs bottom-to-top: lesson 1 sits at the bottom of the screen and
  // later lessons/modules stack above it. Each module's banner heads its section.
  const items = [];
  [...groups].reverse().forEach((group) => {
    items.push({
      type: 'banner',
      key: `banner-${group.moduleId}`,
      title: group.title,
      moduleId: group.moduleId,
    });
    [...group.nodes].reverse().forEach(({ lesson, pos }) => {
      items.push({ type: 'node', key: lesson.key, lesson, pos });
    });
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

      // sections are stacked in reverse order, so sort top-to-bottom, and let the
      // top section's photo reach the top edge of the card
      moduleStarts.sort((a, b) => a.top - b.top);
      if (moduleStarts.length > 0) moduleStarts[0].top = 0;

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

  // With the path growing upward, bring the learner's current lesson into view
  // (or the top of the path once everything is complete).
  useEffect(() => {
    const target = lessons.find((l) => l.state === 'current') ?? lessons[lessons.length - 1];
    const el = target ? nodeRefs.current.get(target.key) : null;
    if (el) el.scrollIntoView({ block: 'center' });
  }, [lessons]);

  return (
    <div className="lesson-path" ref={containerRef}>
      {segments.map((seg) => (
        <div
          key={seg.moduleId}
          className="lesson-theme-layer"
          style={{ top: seg.top, height: seg.height, '--seg-h': `${seg.height}px` }}
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
            <ChevronRight className="module-banner-chev" size={20} strokeWidth={2.6} />
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
  const { moduleId, block, state, moduleComplete, adminOpen } = lesson;
  const NodeIcon = state === 'locked' ? Lock : state === 'completed' ? Check : Star;
  const nodeClass = `lesson-node state-${state}${moduleComplete ? ' module-complete' : ''}${
    adminOpen ? ' admin-open' : ''
  }`;
  const enterable = state !== 'locked' || adminOpen;

  const inner = (
    <>
      {state === 'current' && (
        <span className="lesson-pin" aria-hidden="true">
          <MapPin size={26} strokeWidth={2.4} fill="currentColor" />
        </span>
      )}
      <span ref={registerRef} className={nodeClass}>
        <NodeIcon
          size={state === 'completed' ? 32 : 28}
          strokeWidth={state === 'completed' ? 3.4 : 2.6}
          fill={state === 'current' ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      </span>
      <span className="lesson-node-label">{block}</span>
      {state === 'current' && (
        <div className="path-mascot" aria-hidden="true">
          <div className="speech tail-bottom speech-pop">
            ¡Vamos!
            <small>Let's go!</small>
          </div>
          <Monedita mood="idle" size={62} />
        </div>
      )}
    </>
  );

  return (
    <div className={`lesson-row pos-${pos}`}>
      {!enterable ? (
        <div className="lesson-node-wrap" aria-disabled="true">
          {inner}
        </div>
      ) : (
        <Link
          to={`/module/${moduleId}/lesson/${encodeURIComponent(block)}`}
          className="lesson-node-wrap"
          aria-label={`${block} — ${
            state === 'completed' ? 'completed' : state === 'locked' ? 'locked (admin access)' : 'current lesson'
          }`}
        >
          {inner}
        </Link>
      )}
    </div>
  );
}
