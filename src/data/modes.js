import { Layers, Dumbbell, PenLine, MessagesSquare } from 'lucide-react';

export const MODES = [
  {
    key: 'flashcards',
    Icon: Layers,
    title: 'Flashcards',
    desc: 'Flip through terms with example sentences.',
  },
  {
    key: 'practice',
    Icon: Dumbbell,
    title: 'Practice',
    desc: 'Short exercises to lock in the words you just studied.',
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
    desc: 'Practice real conversations, one reply at a time.',
  },
];
