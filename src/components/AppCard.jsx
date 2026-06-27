import React from 'react';

// 카테고리별로 알맞은 CSS 클래스를 리턴해주는 헬퍼 함수
const getCategoryBadgeClass = (category) => {
  switch (category) {
    case '언어': return 'badge-lang';
    case '수학': return 'badge-math';
    case '과학': return 'badge-science';
    case '코딩': return 'badge-coding';
    case '암기': return 'badge-memorize';
    case '퀴즈': return 'badge-quiz';
    default: return 'badge-default';
  }
};

// 카테고리별 예쁜 기본 이모티콘 리턴
const getCategoryEmoji = (category) => {
  switch (category) {
    case '언어': return '🔤';
    case '수학': return '🔢';
    case '과학': return '🧪';
    case '코딩': return '💻';
    case '암기': return '🧠';
    case '퀴즈': return '💡';
    default: return '🚀';
  }
};

export default function AppCard({ app, onExecute }) {
  const { name, description, category = [], url, thumbnail } = app;

  // 카테고리 배열이 비어있으면 '기타'를 기본으로 설정
  const displayCategories = category.length > 0 ? category : ['기타'];

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 썸네일 영역 */}
      <div className="card-thumb-wrapper">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="card-thumb" loading="lazy" />
        ) : (
          <div className="placeholder-thumb">
            <span className="placeholder-icon">{getCategoryEmoji(displayCategories[0])}</span>
            <span className="placeholder-text">{displayCategories[0]}</span>
          </div>
        )}
      </div>

      {/* 카드 정보 영역 */}
      <div className="card-content">
        {/* 카테고리 배지들 */}
        <div className="card-meta">
          {displayCategories.map((cat, idx) => (
            <span key={idx} className={`badge ${getCategoryBadgeClass(cat)}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* 앱 제목 */}
        <h3 className="card-title">{name}</h3>

        {/* 앱 설명 */}
        <p className="card-desc">{description || '이 앱에 대한 설명이 아직 등록되지 않았습니다.'}</p>

        {/* 실행 버튼이 포함된 카드 하단 */}
        <div className="card-footer" style={{ width: '100%' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {url.includes('localhost') || url.includes('127.0.0.1') ? '💻 로컬 앱' : '🌐 웹 서비스'}
          </span>
          <button 
            className="btn btn-primary btn-small"
            onClick={() => onExecute(url)}
          >
            실행하기 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
