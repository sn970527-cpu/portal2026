import React, { useState, useEffect } from 'react';
import PortalHome from './components/PortalHome';
import AdminPanel from './components/AdminPanel';

// 처음에 접속했을 때 포털을 가득 채워줄 예시 학습용 웹앱 데이터
const SEED_APPS = [
  {
    id: 'seed-vocab',
    name: '🔤 영단어 스피드 퀴즈',
    description: '초등 필수 영단어를 플래시 카드와 흥미진진한 스피드 퀴즈로 외워보는 단어장 앱입니다.',
    category: ['언어', '퀴즈', '암기'],
    url: 'https://wordrow.kr/%EB%8B%A8%EC%96%B4-%EA%B2%8C%EC%9E%84/',
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-math',
    name: '🔢 구구단 레이싱 게임',
    description: '시간 내에 구구단 정답을 맞춰 결승선까지 달리는 흥미진진한 연산 연습 게임입니다.',
    category: ['수학', '퀴즈'],
    url: 'https://www.multiplication.com/games/play/grand-prix-multiplication',
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-coding',
    name: '💻 엔트리(Entry) 블록 코딩',
    description: '직관적인 블록 코딩을 통해 컴퓨터 사고력을 기르고 나만의 게임과 작품을 창작하는 사이트입니다.',
    url: 'https://playentry.org',
    category: ['코딩'],
    thumbnail: '',
    updatedAt: '2026-06-27'
  },
  {
    id: 'seed-science',
    name: '🧪 NASA 우주 탐험대',
    description: '우리 우주와 태양계 행성들에 관한 신비로운 정보들을 가상 탐험 형태로 보여주는 어린이용 과학 채널입니다.',
    url: 'https://spaceplace.nasa.gov/',
    category: ['과학'],
    thumbnail: '',
    updatedAt: '2026-06-27'
  }
];

export default function App() {
  const [apps, setApps] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);

  // 1. 컴포넌트 마운트 시 localStorage에서 앱 데이터 및 테마 세팅
  useEffect(() => {
    // 앱 데이터 로드
    const storedApps = localStorage.getItem('learning_portal_apps');
    if (storedApps) {
      setApps(JSON.parse(storedApps));
    } else {
      // 저장된 데이터가 전혀 없으면 기본 시드 데이터 주입!
      localStorage.setItem('learning_portal_apps', JSON.stringify(SEED_APPS));
      setApps(SEED_APPS);
    }

    // 테마 정보 로드
    const storedTheme = localStorage.getItem('learning_portal_theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  // 2. 테마 토글 함수
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('learning_portal_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    addToast(nextTheme === 'light' ? '밝은 화면 모드로 전환되었습니다. ☀️' : '어두운 화면 모드로 전환되었습니다. 🌙', 'success');
  };

  // 3. 토스트 알림 추가 및 자동 제거
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // 3초 뒤에 자동 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // 4. 앱 데이터 저장 (등록 & 수정 공용)
  const saveApp = (appData) => {
    setApps((prevApps) => {
      let updatedApps;
      const exists = prevApps.some((app) => app.id === appData.id);
      
      if (exists) {
        // 이미 존재하면 수정 (업데이트)
        updatedApps = prevApps.map((app) => (app.id === appData.id ? appData : app));
      } else {
        // 존재하지 않으면 신규 추가 (최상단에 배치하기 위해 앞에 결합)
        updatedApps = [appData, ...prevApps];
      }
      
      localStorage.setItem('learning_portal_apps', JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  // 5. 앱 데이터 삭제
  const deleteApp = (id) => {
    setApps((prevApps) => {
      const updatedApps = prevApps.filter((app) => app.id !== id);
      localStorage.setItem('learning_portal_apps', JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  // 6. 런처 실행 함수 (새 탭으로 열기)
  const executeApp = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 프리미엄 상단 헤더 */}
      <header className="glass-header">
        <div className="container header-content">
          <div className="logo-section" onClick={() => setCurrentView('home')}>
            <span className="logo-icon">🏫</span>
            <span>학습용 웹앱 포털</span>
          </div>

          <div className="nav-actions">
            {/* 홈으로 버튼 */}
            <button 
              className={`btn ${currentView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('home')}
            >
              🏠 홈 포털
            </button>

            {/* 관리자 셋업 버튼 */}
            <button 
              className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('admin')}
            >
              🛠️ 관리 페이지
            </button>

            {/* 테마 변경 버튼 */}
            <button 
              className="btn-icon btn" 
              onClick={toggleTheme}
              title="화면 테마 변경"
              aria-label="화면 테마 변경"
              style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, padding: '24px 0' }}>
        {currentView === 'home' ? (
          <PortalHome 
            apps={apps} 
            onExecute={executeApp} 
          />
        ) : (
          <AdminPanel 
            apps={apps} 
            onSaveApp={saveApp} 
            onDeleteApp={deleteApp} 
            onAddToast={addToast}
          />
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="footer">
        <div className="container footer-content">
          <span className="footer-text">
            © 2026 서울언북초등학교 학습용 웹앱 포털. 모든 학습 리소스는 교육용으로 활용됩니다.
          </span>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>포털 홈</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('admin'); }}>관리자 메뉴</a>
          </div>
        </div>
      </footer>

      {/* 우측 하단 동적 토스트 알림창 */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          >
            {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
