import { useState, useEffect } from 'react';

interface Note {
  id: string;
  date: string;
  title: string;
  content: string;
  hexagramName?: string;
  tags: string[];
};

export default function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('yijing-notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('yijing-notes', JSON.stringify(newNotes));
  };

  const addNote = () => {
    if (!title || !content) return;
    const note: Note = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-CN'),
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    saveNotes([note, ...notes]);
    setTitle('');
    setContent('');
    setTags('');
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-section-title flex items-center gap-2">
          <span>📝</span> 我的笔记
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2 py-1 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20"
        >
          {isAdding ? '取消' : '+ 新建'}
        </button>
      </div>

      {isAdding && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2 mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full px-2 py-1 bg-surface border border-border-light rounded text-xs"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记录你的感悟和思考..."
            className="w-full px-2 py-1 bg-surface border border-border-light rounded text-xs h-20 resize-none"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="标签（用逗号分隔）"
            className="w-full px-2 py-1 bg-surface border border-border-light rounded text-xs"
          />
          <button
            onClick={addNote}
            disabled={!title || !content}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            保存
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-xs text-text-muted text-center py-4">
            还没有笔记，点击"新建"添加
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-2 bg-surface-alt rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gold">{note.title}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs text-cinnabar hover:text-cinnabar-light"
                >
                  删除
                </button>
              </div>
              <div className="text-xs text-text-secondary line-clamp-2">{note.content}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-text-muted">{note.date}</span>
                {note.tags.map((tag, i) => (
                  <span key={i} className="px-1 py-0.5 bg-gold/5 text-gold text-[10px] rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
