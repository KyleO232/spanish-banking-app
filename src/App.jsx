import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ModuleHome from './pages/ModuleHome.jsx';
import Lesson from './pages/Lesson.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Quiz from './pages/Quiz.jsx';
import RoleplayList from './pages/RoleplayList.jsx';
import RoleplayViewer from './pages/RoleplayViewer.jsx';
import VocabularyHome from './pages/VocabularyHome.jsx';
import VocabularyList from './pages/VocabularyList.jsx';
import BottomNav from './components/BottomNav.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/:moduleId" element={<ModuleHome />} />
        <Route path="/module/:moduleId/flashcards" element={<Flashcards />} />
        <Route path="/module/:moduleId/quiz" element={<Quiz />} />
        <Route path="/module/:moduleId/roleplay" element={<RoleplayList />} />
        <Route path="/module/:moduleId/roleplay/:roleplayId" element={<RoleplayViewer />} />
        <Route path="/module/:moduleId/lesson/:block" element={<Lesson />} />
        <Route path="/module/:moduleId/lesson/:block/flashcards" element={<Flashcards />} />
        <Route path="/module/:moduleId/lesson/:block/quiz" element={<Quiz />} />
        <Route path="/module/:moduleId/lesson/:block/roleplay" element={<RoleplayList />} />
        <Route path="/vocabulary" element={<VocabularyHome />} />
        <Route path="/vocabulary/:moduleId" element={<VocabularyList />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
