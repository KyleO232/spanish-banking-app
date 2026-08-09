import { getModules, getBlocks, getTermsByBlock } from './modules.js';
import { lessonKey, isCompleted } from '../utils/progress.js';

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

  return withState.map((lesson) => ({
    ...lesson,
    moduleComplete: completeModules.has(lesson.moduleId),
  }));
}
