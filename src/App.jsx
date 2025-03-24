// src/App.jsx
import MemoList from './components/MemoList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Personal Memo</h1>
        </div>
      </header>
      <main className="py-8">
        <MemoList />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto py-4 px-4 text-center text-gray-600">
          <p>Update memo status via Github Actions email integration</p>
        </div>
      </footer>
    </div>
  );
}

export default App;