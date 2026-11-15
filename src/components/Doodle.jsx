// Illustrations: "Open Doodles" by Pablo Stanley (CC0 / public domain).
// https://www.opendoodles.com — inlined so the ink and accent colors follow the app theme.
import jumping from '../assets/illustrations/jumping.svg?raw';
import running from '../assets/illustrations/running.svg?raw';
import reading from '../assets/illustrations/sitting-reading.svg?raw';

const DOODLES = { jumping, running, reading };

export default function Doodle({ name, className = '' }) {
  return (
    <div
      className={`doodle ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: DOODLES[name] ?? '' }}
    />
  );
}
