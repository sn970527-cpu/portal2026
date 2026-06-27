import React, { useState, useRef } from 'react';

const AVAILABLE_CATEGORIES = ['언어', '수학', '과학', '코딩', '암기', '퀴즈', '기타'];
const ADMIN_CODE = 'admin123'; // 기본 관리자 비밀코드

export default function AdminPanel({ apps, onSaveApp, onDeleteApp, onAddToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [authError, setAuthError] = useState('');

  // 등록/수정 폼 관련 상태들
  const [editId, setEditId] = useState(null); // null 이면 '등록', id가 있으면 '수정' 모드
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const fileInputRef = useRef(null);

  // 관리자 인증 처리
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (inputCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      setAuthError('');
      onAddToast('관리자 인증에 성공했습니다! 🔐', 'success');
    } else {
      setAuthError('관리자 코드가 올바르지 않습니다. 다시 입력해 주세요.');
      onAddToast('인증에 실패했습니다. ❌', 'error');
    }
  };

  // 썸네일 파일 업로드 -> Base64 변환
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일 크기 제한 (localStorage 용량 제한 대응 - 약 1.5MB 이하로 추천)
    if (file.size > 1.5 * 1024 * 1024) {
      onAddToast('이미지 파일 크기가 너무 큽니다! 1.5MB 이하로 올려주세요. ⚠️', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result); // Base64 인코딩된 스트링 저장
      onAddToast('썸네일 이미지가 준비되었습니다! 📸', 'success');
    };
    reader.readAsDataURL(file);
  };

  // 카테고리 체크박스 선택 토글
  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // 폼 검증(Validation)
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = '앱 제목은 필수로 입력해야 합니다.';
    if (!url.trim()) {
      errors.url = '앱 링크(URL)는 필수로 입력해야 합니다.';
    } else {
      try {
        new URL(url); // URL 형식 확인
      } catch (e) {
        errors.url = '올바른 URL 형식(예: http://... 또는 https://...)이어야 합니다.';
      }
    }
    if (selectedCategories.length === 0) {
      errors.categories = '최소 한 개 이상의 카테고리를 선택해야 합니다.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 저장하기(등록 및 수정 완료)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      onAddToast('입력 양식을 확인해 주세요. ⚠️', 'error');
      return;
    }

    const appData = {
      id: editId || `app-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
      category: selectedCategories,
      thumbnail: thumbnail,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSaveApp(appData);
    onAddToast(editId ? '학습 앱이 성공적으로 수정되었습니다! ✨' : '새로운 학습 앱이 등록되었습니다! 🎉', 'success');
    
    // 폼 리셋
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setUrl('');
    setSelectedCategories([]);
    setThumbnail('');
    setValidationErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 수정 모드로 불러오기
  const handleEditInit = (app) => {
    setEditId(app.id);
    setName(app.name);
    setDescription(app.description || '');
    setUrl(app.url);
    setSelectedCategories(app.category || []);
    setThumbnail(app.thumbnail || '');
    setValidationErrors({});
    
    // 화면 위쪽 폼으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onAddToast(`"${app.name}" 앱의 수정 모드를 시작합니다. ✏️`, 'success');
  };

  // 앱 삭제하기
  const handleDelete = (id, appName) => {
    if (window.confirm(`정말로 "${appName}" 앱을 삭제하시겠습니까?`)) {
      onDeleteApp(id);
      onAddToast('앱이 성공적으로 삭제되었습니다. 🗑️', 'success');
      if (editId === id) {
        resetForm();
      }
    }
  };

  // 인증 전 화면
  if (!isAuthenticated) {
    return (
      <div className="container animate-fade-in">
        <div className="admin-auth-container">
          <div className="auth-icon">🔐</div>
          <h2 style={{ marginBottom: '12px' }}>관리자 인증</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            학습 앱을 추가하거나 수정하기 위해 관리자 비밀코드를 입력해 주세요.
          </p>
          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-code-input">비밀코드</label>
              <input
                id="admin-code-input"
                type="password"
                className="form-input"
                placeholder="코드를 입력하세요 (힌트: admin123)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                autoFocus
              />
              {authError && <p className="error-message">{authError}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              인증하고 입장하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 인증 후 대시보드 화면
  return (
    <div className="container admin-dashboard animate-fade-in">
      {/* 왼쪽: 등록/수정 폼 */}
      <div className="app-form-card">
        <h3 className="admin-panel-title">
          {editId ? '✏️ 학습 앱 수정하기' : '✨ 새 학습 앱 등록하기'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* 앱 제목 */}
          <div className="form-group">
            <label className="form-label">앱 제목 <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 구구단 퀴즈, 영단어 게임"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}
          </div>

          {/* 한 줄 설명 */}
          <div className="form-group">
            <label className="form-label">한 줄 설명</label>
            <textarea
              className="form-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              placeholder="앱이 어떤 공부에 도움을 주는지 간단히 설명해 주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 실행 링크 */}
          <div className="form-group">
            <label className="form-label">앱 실행 링크 (URL) <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="예: https://example.com/quiz"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {validationErrors.url && <p className="error-message">{validationErrors.url}</p>}
          </div>

          {/* 카테고리 다중 선택 */}
          <div className="form-group">
            <label className="form-label">학습 카테고리 <span style={{ color: '#dc2626' }}>*</span> (중복 선택 가능)</label>
            <div className="category-select-grid">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <label key={cat} className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
            {validationErrors.categories && <p className="error-message">{validationErrors.categories}</p>}
          </div>

          {/* 썸네일 업로드 */}
          <div className="form-group">
            <label className="form-label">썸네일 이미지</label>
            {!thumbnail ? (
              <div 
                className="file-upload-area"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="file-upload-icon">📷</div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>이미지 파일 선택</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  권장 비율 16:9 (최대 1.5MB)
                </p>
              </div>
            ) : (
              <div>
                <div className="image-preview-wrapper">
                  <img src={thumbnail} alt="미리보기" className="image-preview" />
                  <button 
                    type="button" 
                    className="image-preview-remove"
                    onClick={() => setThumbnail('')}
                    title="이미지 제거"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* 저장 및 취소 버튼 */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {editId ? '수정 완료 💾' : '등록 완료 🚀'}
            </button>
            {editId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={resetForm}
                style={{ flex: 0.5 }}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 오른쪽: 등록된 앱 관리 리스트 */}
      <div className="admin-list-card">
        <h3 className="admin-panel-title">📋 등록된 학습 앱 관리</h3>
        
        {apps.length > 0 ? (
          <div className="table-wrapper">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>앱 정보</th>
                  <th>카테고리</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="table-app-info">
                        {app.thumbnail ? (
                          <img src={app.thumbnail} alt={app.name} className="table-app-thumb" />
                        ) : (
                          <div className="table-app-thumb" style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                            {app.category && app.category[0] ? app.category[0][0] : '기'}
                          </div>
                        )}
                        <div className="table-app-details">
                          <span className="table-app-title">{app.name}</span>
                          <span className="table-app-url" title={app.url}>{app.url}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(app.category || ['기타']).slice(0, 2).map((cat, idx) => (
                          <span key={idx} style={{ 
                            fontSize: '0.7rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)'
                          }}>
                            {cat}
                          </span>
                        ))}
                        {app.category && app.category.length > 2 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn-small btn-edit"
                          onClick={() => handleEditInit(app)}
                        >
                          수정
                        </button>
                        <button
                          className="btn btn-small btn-delete"
                          onClick={() => handleDelete(app.id, app.name)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            등록된 앱이 아직 없습니다. 왼쪽 폼에서 첫 번째 앱을 등록해 보세요!
          </div>
        )}
      </div>
    </div>
  );
}
