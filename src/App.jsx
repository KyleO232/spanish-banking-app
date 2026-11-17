import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ModuleHome from './pages/ModuleHome.jsx';
import Lesson from './pages/Lesson.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Practice from './pages/Practice.jsx';
import Quiz from './pages/Quiz.jsx';
import RoleplayList from './pages/RoleplayList.jsx';
import RoleplayViewer from './pages/RoleplayViewer.jsx';
import VocabularyHome from './pages/VocabularyHome.jsx';
import VocabularyList from './pages/VocabularyList.jsx';
import Account from './pages/Account.jsx';
import Shop from './pages/Shop.jsx';
import { PrivacyPolicy, TermsOfUse } from './pages/Legal.jsx';
import BottomNav from './components/BottomNav.jsx';
import { useAuth } from './auth/AuthContext.jsx';
import './App.css';

export default function App() {
  const location = useLocation();
  const { syncVersion, adminOn } = useAuth();

  return (
    <div className="app">
      {/* Keyed by path (and by account sync / admin changes) so a screen never reuses stale state. */}
      <Routes key={`${location.pathname}|${syncVersion}|${adminOn}`}>
        <Route path="/" element={<Home />} />
        <Route path="/module/:moduleId" element={<ModuleHome />} />
        <Route path="/module/:moduleId/flashcards" element={<Flashcards />} />
        <Route path="/module/:moduleId/practice" element={<Practice />} />
        <Route path="/module/:moduleId/quiz" element={<Quiz />} />
        <Route path="/module/:moduleId/roleplay" element={<RoleplayList />} />
        <Route path="/module/:moduleId/roleplay/:roleplayId" element={<RoleplayViewer />} />
        <Route path="/module/:moduleId/lesson/:block" element={<Lesson />} />
        <Route path="/module/:moduleId/lesson/:block/flashcards" element={<Flashcards />} />
        <Route path="/module/:moduleId/lesson/:block/practice" element={<Practice />} />
        <Route path="/module/:moduleId/lesson/:block/quiz" element={<Quiz />} />
        <Route path="/module/:moduleId/lesson/:block/roleplay" element={<RoleplayList />} />
        <Route
          path="/module/:moduleId/lesson/:block/roleplay/:roleplayId"
          element={<RoleplayViewer />}
        />
        <Route path="/shop" element={<Shop />} />
        <Route path="/account" element={<Account />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/vocabulary" element={<VocabularyHome />} />
        <Route path="/vocabulary/:moduleId" element={<VocabularyList />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
