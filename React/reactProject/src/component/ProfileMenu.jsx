import { useState, useEffect } from 'react';
import '../css/ProfileMenu.css';

function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const username = sessionStorage.getItem('username') || '?';

    const fetchInvitations = async () => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) return;
        try {
            const response = await fetch('http://localhost:8080/BackendProject/archive/getInvitationList.jsp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ uid })
            });
            const data = await response.json();
            setInvitations(data);
        } catch (e) {
            console.error('초대 목록 불러오기 실패:', e);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleRespond = async (invitationId, status) => {
        try {
            const response = await fetch('http://localhost:8080/BackendProject/archive/respondInvitation.jsp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ invitationId, status })
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert(status === 'accepted' ? '초대를 수락했습니다.' : '초대를 거절했습니다.');
                fetchInvitations();
                if (status === 'accepted') {
                    window.location.reload();
                }
            }
        } catch (e) {
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-btn" onClick={() => setIsOpen(!isOpen)}>
                <img src="/src/img/profile/profileImg.png" alt="프로필" className="profile-img" />
                {invitations.length > 0 && (
                    <span className="profile-badge">{invitations.length}</span>
                )}
            </div>

            {isOpen && (
                <>
                    <div className="profile-overlay" onClick={() => setIsOpen(false)} />
                    <div className="profile-dropdown">
                        <div className="profile-dropdown-header">
                            <strong>{username}</strong>
                        </div>
                        <hr />
                        <div className="profile-dropdown-section">
                            <p className="profile-dropdown-label">🔔 초대 목록</p>
                            {invitations.length === 0 ? (
                                <p className="profile-dropdown-empty">초대가 없습니다.</p>
                            ) : (
                                invitations.map((inv) => (
                                    <div className="profile-invitation-item" key={inv.invitationId}>
                                        <p className="profile-invitation-text">
                                            <strong>{inv.inviterName}</strong>님이 <strong>{inv.aname}</strong> 저장소에 초대했습니다.
                                        </p>
                                        <div className="profile-invitation-btns">
                                            <button onClick={() => handleRespond(inv.invitationId, 'accepted')}>수락</button>
                                            <button onClick={() => handleRespond(inv.invitationId, 'rejected')}>거절</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <hr />
                        <div className="profile-dropdown-item">⚙️ 설정</div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProfileMenu;