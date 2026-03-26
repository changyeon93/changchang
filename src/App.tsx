import { useState } from 'react';
import './App.css';

type View = 'home' | 'team-mgmt' | 'recruitment' | 'match-board' | 'mercenary';

interface User {
  name: string;
  provider: 'Google' | 'Kakao';
}

interface LoginModalProps {
  onClose: () => void;
  onLogin: (provider: 'Google' | 'Kakao') => void;
}

const LoginModal = ({ onClose, onLogin }: LoginModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="login-modal" onClick={e => e.stopPropagation()}>
      <div className="close-modal" onClick={onClose}>&times;</div>
      <h2>반가워요!</h2>
      <p>모두축구에 로그인하고 <br />더 많은 기능을 이용해 보세요.</p>
      <div className="social-buttons">
        <button className="btn-social btn-kakao" onClick={() => onLogin('Kakao')}>
          <span style={{fontSize:'1.2rem'}}>💬</span> 카카오 로그인
        </button>
        <button className="btn-social btn-google" onClick={() => onLogin('Google')}>
          <span style={{fontSize:'1.2rem'}}>G</span> Google로 로그인
        </button>
      </div>
      <div style={{marginTop:'2rem', fontSize:'0.85rem', color:'var(--text-muted)'}}>
        로그인 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
      </div>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock Data
  const matches = [
    { id: 1, team: 'FC 강남', date: '2026.04.15', time: '20:00', location: '강남구민운동장', status: 'recruiting' },
    { id: 2, team: '서초 유나이티드', date: '2026.04.16', time: '19:00', location: '서초종합체육관', status: 'matched' },
    { id: 3, team: '송파 FC', date: '2026.04.18', time: '10:00', location: '송파나루공원', status: 'urgent' },
  ];

  const handleLogin = (provider: 'Google' | 'Kakao') => {
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser({ name: provider === 'Google' ? '김구글' : '이카카오', provider });
      setShowLoginModal(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
  };

  const renderHome = () => (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h1>모두를 위한<br />축구 플랫폼</h1>
          <p>내 팀을 만들고, 상대를 찾고, 함께 뛸 동료를 구하세요.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" style={{backgroundColor:'white', color:'var(--primary)'}} onClick={() => setCurrentView('match-board')}>경기 매칭 시작하기</button>
            <button className="btn btn-outline" style={{borderColor:'white', color:'white'}} onClick={() => (isLoggedIn ? setCurrentView('team-mgmt') : setShowLoginModal(true))}>내 팀 관리하기</button>
          </div>
        </div>
      </section>
      <section className="section container">
        <h2 className="section-title">최근 등록된 경기</h2>
        <div className="data-list" style={{marginTop:'40px'}}>
          {matches.slice(0, 2).map(m => (
            <div key={m.id} className="data-item">
              <div className="item-main">
                <span className={`badge badge-${m.status}`}>{m.status === 'recruiting' ? '매칭중' : m.status === 'urgent' ? '긴급' : '확정'}</span>
                <div className="item-title">{m.team}</div>
              </div>
              <div className="item-meta">
                {m.date} {m.time} | {m.location}
              </div>
              <button className="btn btn-primary" style={{fontSize:'0.9rem'}} onClick={() => (isLoggedIn ? alert('신청되었습니다!') : setShowLoginModal(true))}>신청하기</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className="app">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
      
      <nav className="navbar glass">
        <div className="container">
          <div className="logo" onClick={() => setCurrentView('home')}>⚽ MODU</div>
          <ul className="nav-links">
            <li className={currentView === 'team-mgmt' ? 'active' : ''} onClick={() => (isLoggedIn ? setCurrentView('team-mgmt') : setShowLoginModal(true))}>팀 관리</li>
            <li className={currentView === 'match-board' ? 'active' : ''} onClick={() => setCurrentView('match-board')}>경기 매칭</li>
            <li className={currentView === 'recruitment' ? 'active' : ''} onClick={() => setCurrentView('recruitment')}>영입</li>
            <li className={currentView === 'mercenary' ? 'active' : ''} onClick={() => setCurrentView('mercenary')}>용병</li>
          </ul>
          
          {isLoggedIn ? (
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
              <div className="user-profile">
                <div className="user-avatar">{user?.name[0]}</div>
                <span>{user?.name}님</span>
              </div>
              <button onClick={handleLogout} style={{background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.9rem'}}>로그아웃</button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{padding:'0.5rem 1.2rem'}} onClick={() => setShowLoginModal(true)}>로그인</button>
          )}
        </div>
      </nav>

      <main>
        {currentView === 'home' && renderHome()}
        {currentView === 'team-mgmt' && (
          <section className="section container fade-in">
            {isLoggedIn ? (
              <>
                <div className="board-header">
                  <div>
                    <h2 className="section-title">내 팀 관리</h2>
                    <p className="item-meta">모두축구 (Team Admin)</p>
                  </div>
                  <button className="btn btn-primary">+ 경기 일정 등록</button>
                </div>
                <div className="form-card" style={{marginTop: '40px'}}>
                  <h3>새 경기 등록</h3>
                  <div style={{marginTop:'20px'}}>
                    <div className="input-group">
                      <label>날짜 및 시간</label>
                      <input type="datetime-local" />
                    </div>
                    <div className="input-group">
                      <label>장소</label>
                      <input type="text" placeholder="경기장 이름을 입력하세요" />
                    </div>
                    <button className="btn btn-primary" style={{width:'100%'}}>등록 완료</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{textAlign:'center', padding:'4rem 0'}}>
                <h2>로그인이 필요합니다</h2>
                <p>팀 관리 기능을 이용하려면 로그인을 해주세요.</p>
                <button className="btn btn-primary" style={{marginTop:'2rem'}} onClick={() => setShowLoginModal(true)}>로그인하기</button>
              </div>
            )}
          </section>
        )}
        {currentView === 'match-board' && (
          <section className="section container fade-in">
            <h2 className="section-title">경기 매칭 게시판</h2>
            <div className="board-container">
              <div className="data-list">
                {matches.map(m => (
                  <div key={m.id} className="data-item">
                    <div className="item-main">
                      <span className={`badge badge-${m.status}`}>{m.status === 'recruiting' ? '매칭 대기' : m.status === 'urgent' ? '긴급 매칭' : '매칭 완료'}</span>
                      <div className="item-title">{m.team}</div>
                    </div>
                    <div className="item-meta">{m.date} {m.time} <br /> {m.location}</div>
                    <button className="btn btn-outline" disabled={m.status === 'matched'} onClick={() => (isLoggedIn ? alert('신청되었습니다!') : setShowLoginModal(true))}>
                      {m.status === 'matched' ? '매칭 완료' : '매칭 신청'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {currentView === 'recruitment' && (
          <section className="section container fade-in">
            <h2 className="section-title">팀 & 선수 찾기</h2>
            <div className="board-container">
              <div className="card-grid">
                {[
                  { id: 1, target: '팀', name: 'FC 한강', detail: '미드필더 급구 (일요일 오전)', date: '방금 전' },
                  { id: 2, target: '선수', name: '박지성', detail: '윙어 포지션 선호합니다. 성실합니다.', date: '10분 전' },
                ].map(r => (
                  <div key={r.id} className="data-item" style={{display:'block', padding:'2rem'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                      <span className="badge" style={{background: r.target === '팀' ? '#DBEAFE' : '#F3E8FF', color: r.target === '팀' ? '#1E40AF' : '#6B21A8'}}>{r.target} 구함</span>
                      <span className="item-meta">{r.date}</span>
                    </div>
                    <div className="item-title" style={{marginBottom:'0.5rem'}}>{r.name}</div>
                    <p style={{marginBottom:'1.5rem', color:'var(--text-main)'}}>{r.detail}</p>
                    <button className="btn btn-outline" style={{width:'100%'}} onClick={() => (isLoggedIn ? alert('문의가 전송되었습니다!') : setShowLoginModal(true))}>문의하기</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {currentView === 'mercenary' && (
          <section className="section container fade-in">
            <h2 className="section-title">용병 게시판</h2>
            <div className="board-container">
              <div className="data-list">
                {[
                  { id: 1, title: '오늘 저녁 8시 용산 아이파크몰 용병 구합니다', team: 'FC 코딩', fee: '1만원', date: '03.26' },
                  { id: 2, title: '용병 자원합니다 (공격수, 선출)', name: '이동국', location: '인천/서울', date: '03.26' },
                ].map(m => (
                  <div key={m.id} className="data-item">
                    <div className="item-main" style={{gridColumn: 'span 2'}}>
                      <div className="item-title">{m.title}</div>
                      <div className="item-meta">{m.team || m.name} | {m.fee || m.location}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="item-meta" style={{marginBottom:'0.5rem'}}>{m.date}</div>
                      <button className="btn btn-primary" style={{padding:'0.5rem 1rem', fontSize:'0.8rem'}} onClick={() => (isLoggedIn ? alert('신청되었습니다!') : setShowLoginModal(true))}>자원/모집</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem'}}>
            <div>
              <h3 style={{color:'white', marginBottom:'1rem'}}>⚽ MODU</h3>
              <p style={{opacity:0.6}}>모두를 위한 축구 플랫폼</p>
            </div>
            <div style={{opacity:0.6, fontSize:'0.9rem'}}>
              &copy; 2026 MODU SOCCER. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
