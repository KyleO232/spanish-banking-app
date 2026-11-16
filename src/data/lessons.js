import { getModules, getBlocks, getTermsByBlock } from './modules.js';
import { lessonKey, isCompleted, isFlashcardsDone, isPracticeDone } from '../utils/progress.js';
import { isAdminMode } from '../utils/adminMode.js';

export function getLessons() {
  const lessons = [];
  getModules().forEach((module) => {
    getBlocks(module).forEach((block) => {
      lessons.push({
        key: lessonKey(module.id, block),
        moduleId: module.id,
        moduleTitle: module.title,
        moduleTheme: module.theme || 'beach',
        block,
        termCount: getTermsByBlock(module, block).length,
      });
    });
  });
  return lessons;
}

// Which of a lesson's three activities the learner may open:
//   flashcards -> practice (after viewing every card) -> quiz (after finishing practice)
//   -> roleplay (after finishing the quiz).
// Lessons finished before this rule existed count as having done every step.
export function getLessonSteps(moduleId, block) {
  const lesson = getLessonsWithState().find((l) => l.moduleId === moduleId && l.block === block);
  const state = lesson?.state ?? 'locked';
  const quizDone = state === 'completed';
  const flashcardsDone = quizDone || isFlashcardsDone(moduleId, block);
  const practiceDone = quizDone || isPracticeDone(moduleId, block);
  const admin = isAdminMode() && Boolean(lesson); // admins can open every real lesson and step
  const open = state !== 'locked' || admin;

  return {
    lesson,
    state,
    flashcardsDone,
    practiceDone,
    quizDone,
    unlocked: {
      flashcards: open,
      practice: open && (flashcardsDone || admin),
      quiz: open && (practiceDone || admin),
      roleplay: open && (quizDone || admin),
    },
  };
}

// Returns lessons in order with a `state` of 'locked' | 'current' | 'completed'.
// A lesson unlocks once every lesson before it in the global sequence is completed.
// `moduleComplete` is true on every lesson of a module once that whole module is finished.
export function getLessonsWithState() {
  let allPreviousCompleted = true;
  const withState = getLessons().map((lesson) => {
    const completed = isCompleted(lesson.moduleId, lesson.block);
    let state;
    if (completed) {
      state = 'completed';
    } else if (allPreviousCompleted) {
      state = 'current';
    } else {
      state = 'locked';
    }
    if (!completed) allPreviousCompleted = false;
    return { ...lesson, state };
  });

  const completeModules = new Set(
    [...new Set(withState.map((l) => l.moduleId))].filter((moduleId) =>
      withState.filter((l) => l.moduleId === moduleId).every((l) => l.state === 'completed')
    )
  );

  const admin = isAdminMode();
  return withState.map((lesson) => ({
    ...lesson,
    moduleComplete: completeModules.has(lesson.moduleId),
    adminOpen: admin && lesson.state === 'locked', // still shown as locked, but an admin can enter
  }));
}
