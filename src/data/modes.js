import { Layers, PenLine, MessagesSquare } from 'lucide-react';

export const MODES = [
  {
    key: 'flashcards',
    Icon: Layers,
    title: 'Flashcards',
    desc: 'Flip through terms with example sentences.',
  },
  {
    key: 'quiz',
    Icon: PenLine,
    title: 'Quiz',
    desc: 'Multiple choice and fill-in-the-blank, scored.',
  },
  {
    key: 'roleplay',
    Icon: MessagesSquare,
    title: 'Roleplay',
    desc: 'Read scripted client/banker dialogues.',
  },
];
