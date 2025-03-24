// src/components/MemoList.jsx
import { useEffect, useState } from 'react';
import MemoItem from './MemoItem';

function MemoList() {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await fetch('/data/memos.json');
        const data = await response.json();
        setMemos(data.memos);
        setLoading(false);
      } catch (error) {
        console.error('Error loading memos:', error);
        setLoading(false);
      }
    };

    fetchMemos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading memos...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid gap-4">
        {memos.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </div>
    </div>
  );
}

export default MemoList;