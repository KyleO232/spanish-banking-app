import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { getModule, getBlocks, getTermsByBlock } from '../data/modules.js';

export default function VocabularyList() {
  const { moduleId } = useParams();
  const module = getModule(moduleId);

  if (!module) {
    return (
      <>
        <TopBar title="Module not found" />
        <div className="main">
          <div className="empty-state">We couldn't find that module.</div>
        </div>
      </>
    );
  }

  const blocks = getBlocks(module);

  return (
    <>
      <TopBar title={module.title} subtitle={`${module.terms.length} terms`} />
      <div className="main">
        {blocks.map((block) => (
          <div key={block} className="vocab-block">
            <h2 className="vocab-block-title">{block}</h2>
            <div className="vocab-list">
              {getTermsByBlock(module, block).map((term) => (
                <div key={term.spanish} className="vocab-row">
                  <div className="vocab-es-col">
                    <div className="vocab-es">{term.spanish}</div>
                    {term.note && <div className="vocab-note">{term.note}</div>}
                  </div>
                  <div className="vocab-en">{term.english}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
