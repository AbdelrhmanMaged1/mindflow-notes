import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  Plus, Search, Trash2, Bot, FileText, Tag, ChevronLeft, Settings, 
  Sparkles, Check, X, ArrowLeft, Menu, LogOut, Mail, Lock, User, 
  Moon, Sun
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
// PASTE YOUR REAL KEYS HERE
const firebaseConfig = {
  apiKey: "AIzaSyBvjPLVDEcTfFPf7sprjQQmJ2OasG69fIE",
  authDomain: "mindflow-portfolio.firebaseapp.com",
  projectId: "mindflow-portfolio",
  storageBucket: "mindflow-portfolio.firebasestorage.app",
  messagingSenderId: "948437959652",
  appId: "1:948437959652:web:52927a9a89671c16abbdf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- AUTH COMPONENT ---
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-900/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to MindFlow</h1>
          <p className="text-slate-500 dark:text-slate-400">Your AI-enhanced second brain.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
            <X size={14} /> {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-slate-100 dark:bg-white text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-3 mb-6 border border-slate-200 dark:border-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-cyan-900/20"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-medium">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'notes'), 
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
      setSaveStatus('saved');
    }, (error) => {
      console.error("Firestore Error:", error);
      showNotification("Error syncing notes", "error");
    });

    return () => unsubscribe();
  }, [user]);

  const activeNote = notes.find(n => n.id === activeNoteId);
  const filteredNotes = notes.filter(note => 
    (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (note.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // --- HANDLERS ---
  const handleAddNote = async () => {
    if (!user) return;
    try {
      const newNote = { 
        title: 'Untitled Note', 
        content: '', 
        tags: [], 
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0] 
      };
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'notes'), newNote);
      setActiveNoteId(docRef.id);
      showNotification('New note created');
    } catch (error) {
      console.error("Error creating note:", error);
      showNotification("Failed to create note", "error");
    }
  };

  const handleDeleteNote = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      showNotification('Note deleted');
    } catch (error) {
      console.error("Error deleting note:", error);
      showNotification("Failed to delete note", "error");
    }
  };

  const handleUpdateNote = async (key, value) => {
    if (!activeNoteId || !user) return;

    setSaveStatus('saving');
    try {
      const noteRef = doc(db, 'users', user.uid, 'notes', activeNoteId);
      await updateDoc(noteRef, {
        [key]: value,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating note:", error);
      setSaveStatus('error');
    }
  };

  const handleAIEnhance = () => {
    if (!activeNote?.content) return;
    setIsAiLoading(true);
    setTimeout(async () => {
      const aiSummary = `\n\n✨ AI Summary:\nThis note discusses ${activeNote.title || 'various topics'}. The content has been analyzed for clarity and key points.`;
      try {
        const noteRef = doc(db, 'users', user.uid, 'notes', activeNoteId);
        const newTags = activeNote.tags.includes('AI Enhanced') 
          ? activeNote.tags 
          : [...activeNote.tags, 'AI Enhanced'];

        await updateDoc(noteRef, {
          content: activeNote.content + aiSummary,
          tags: newTags,
          updatedAt: serverTimestamp()
        });
        showNotification('AI Analysis Complete');
      } catch (error) {
        showNotification('AI Update Failed', 'error');
      } finally {
        setIsAiLoading(false);
      }
    }, 1500);
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveNoteId(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loadingUser) {
    return <div className="h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-sans overflow-hidden selection:bg-cyan-500/30 transition-colors duration-300">
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col relative flex-shrink-0`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            MindFlow
          </div>
        </div>
        
        {/* User Info & Back */}
        <div className="px-4 pt-4 whitespace-nowrap overflow-hidden">
           <a href="https://your-portfolio-url.vercel.app" className="text-xs flex items-center gap-1 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-4">
              <ArrowLeft size={12} /> Back to Portfolio
           </a>
           <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                 {user.email[0].toUpperCase()}
               </div>
               <span className="text-sm truncate text-slate-700 dark:text-slate-300">{user.displayName || user.email}</span>
             </div>
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
               <LogOut size={14} />
             </button>
           </div>
        </div>

        <div className="p-4 space-y-4 whitespace-nowrap overflow-hidden">
          <button onClick={handleAddNote} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-cyan-900/20">
            <Plus size={20} /> New Note
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-800 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => setActiveNoteId(note.id)} 
              className={`p-3 rounded-lg cursor-pointer group transition-all border ${activeNoteId === note.id ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold truncate max-w-[180px] ${activeNoteId === note.id ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {note.title || 'Untitled'}
                </h3>
                <button onClick={(e) => handleDeleteNote(e, note.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{note.content || 'No content'}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {note.tags && note.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative w-full transition-colors duration-300">
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className={`absolute top-4 left-4 z-10 p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors`}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>

        {activeNote ? (
          <>
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-slate-950/50 backdrop-blur-sm pl-16">
              <div className="flex items-center gap-4">
                 <span className="text-xs text-slate-500 flex items-center gap-2 hidden sm:flex">
                   <FileText size={12} /> {activeNote.date}
                 </span>
                 <span className="text-xs flex items-center gap-1">
                  {saveStatus === 'saving' ? (
                    <span className="text-yellow-600 dark:text-yellow-500 flex items-center gap-1">Saving...</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-500 flex items-center gap-1"><Check size={12}/> Synced</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAIEnhance} 
                  disabled={isAiLoading} 
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  {isAiLoading ? "Analyzing..." : <><Bot size={16} /> <span className="hidden sm:inline">AI Enhance</span></>}
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full custom-scrollbar">
              <input 
                type="text" 
                value={activeNote.title} 
                onChange={(e) => handleUpdateNote('title', e.target.value)} 
                placeholder="Note Title" 
                className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 border-none focus:outline-none mb-6" 
              />
              
              <div className="flex flex-wrap gap-2 mb-8">
                {activeNote.tags && activeNote.tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-full text-xs font-medium border border-cyan-200 dark:border-cyan-900/50">
                    <Tag size={12} /> {tag}
                    <button 
                      onClick={() => {
                        const newTags = activeNote.tags.filter(t => t !== tag);
                        handleUpdateNote('tags', newTags);
                      }}
                      className="hover:text-cyan-900 dark:hover:text-white ml-1"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={() => { const t = prompt("Enter tag name:"); if(t) handleUpdateNote('tags', [...(activeNote.tags || []), t]) }} 
                  className="text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 px-2 py-1 border border-slate-200 dark:border-slate-800 rounded-full hover:border-cyan-500/50 transition-colors"
                >
                  <Plus size={12} /> Add Tag
                </button>
              </div>
              
              <textarea 
                value={activeNote.content} 
                onChange={(e) => handleUpdateNote('content', e.target.value)} 
                placeholder="Start typing your thoughts..." 
                className="w-full min-h-[50vh] bg-transparent text-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-700 border-none focus:outline-none resize-none leading-relaxed" 
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 animate-fadeIn">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <FileText size={40} className="text-slate-300 dark:text-slate-500" />
            </div>
            <p className="text-lg font-medium">Select a note or create new</p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Appearance</span>
                <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Sun size={16} />
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-slate-700 shadow text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Moon size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Storage</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/30">
                  Firestore Sync
                </span>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full mt-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 animate-bounce-in z-50">
          <div className={`${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-full p-1`}>
            {notification.type === 'error' ? <X size={12} className="text-white" /> : <Check size={12} className="text-white" />}
          </div>
          {notification.msg}
        </div>
      )}
    </div>
  );
}