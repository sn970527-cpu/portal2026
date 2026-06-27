import React, { useState, useMemo } from 'react';
import AppCard from './AppCard';

const CATEGORIES = ['전체', '언어', '수학', '과학', '코딩', '암기', '퀴즈', '기타'];

export default function PortalHome({ apps, onExecute }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 검색 및 카테고리에 맞춰 필터링된 앱 리스트 계산 (useMemo 사용으로 최적화!)
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // 1. 카테고리 필터링
      const matchesCategory =
        selectedCategory === '전체' || 
        (app.category && app.category.includes(selectedCategory)) ||
        (selectedCategory === '기타' && (!app.category || app.category.length === 0));

      // 2. 검색어 필터링 (제목 및 설명 검색)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        app.name.toLowerCase().includes(query) ||
        (app.description && app.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '48px' }}>
      {/* 웰컴 히어로 섹션 */}
      <section className="hero-section">
        <h2 className="hero-title">💡 학습용 웹앱 포털</h2>
        <p className="hero-subtitle">
          다양한 학습용 웹 도구들을 한곳에서 모아 탐색하고 클릭 한 번으로 간편하게 실행해 보세요!
        </p>
      </section>

      {/* 검색 및 필터 영역 */}
      <section className="search-filter-section">
        {/* 검색창 */}
        <div className="search-bar-wrapper">
          <svg
            className="search-icon-svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="공부하고 싶은 앱의 이름이나 설명을 입력해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === '전체' ? '🌐 전체' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 결과 요약 정보 */}
      <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        총 <span style={{ color: 'var(--primary)' }}>{filteredApps.length}</span>개의 앱이 검색되었습니다.
      </div>

      {/* 앱 카드 그리드 */}
      {filteredApps.length > 0 ? (
        <div className="app-grid">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onExecute={onExecute} />
          ))}
        </div>
      ) : (
        /* 결과가 없는 경우 예외 처리 */
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">찾으시는 웹앱이 없습니다</h3>
          <p className="empty-desc">다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.</p>
          {(searchQuery || selectedCategory !== '전체') && (
            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('전체');
              }}
            >
              필터 초기화하기 🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
}
