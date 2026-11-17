import { Landmark, Stethoscope, Scale } from 'lucide-react';

// A track is a career the learner is studying Spanish for. Each module belongs to one
// track (its `track` field, "banking" when missing). Tracks that are not `available`
// are shown as "coming soon" and cannot be selected yet. Each track has its own mascot
// (`kind` picks how it is drawn); what it wears from the shop is shared.

export const DEFAULT_TRACK = 'banking';

export const TRACKS = [
  {
    id: 'banking',
    title: 'Banking',
    es: 'Banca',
    heading: 'Spanish for Banking',
    mascot: { kind: 'coin', name: 'Monedita' },
    tagline: 'Accounts, loans, investing, wealth, and insurance.',
    Icon: Landmark,
    available: true,
  },
  {
    id: 'medical',
    title: 'Medical',
    es: 'Medicina',
    heading: 'Spanish for Medicine',
    mascot: { kind: 'pill', name: 'Pastillita' },
    tagline: 'Anatomy first, then symptoms and talking with patients.',
    Icon: Stethoscope,
    available: true,
  },
  {
    id: 'law',
    title: 'Law',
    es: 'Derecho',
    heading: 'Spanish for Law',
    mascot: { kind: 'coin', name: 'Monedita' },
    tagline: 'Courts, contracts, and client meetings.',
    Icon: Scale,
    available: false,
  },
];

export function getTrackInfo(id) {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}
