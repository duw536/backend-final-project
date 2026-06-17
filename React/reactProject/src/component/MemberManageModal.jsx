import { useState } from 'react';
import Modal from './Modal.jsx';

function MemberManageModal({ aid, isOpen, onClose }) {
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:8080/BackendProject/member/searchMember.jsp?keyword=${keyword}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResult(data);
            } else {
                alert('존재하지 않는 회원입니다.');
                setSearchResult(null);
            }
        } catch (e) {
            alert('검색 중 오류가 발생했습니다.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleInvite = async () => {
    if (!searchResult) return;
    const inviterUid = sessionStorage.getItem('uid');
    try {
        const response = await fetch('http://localhost:8080/BackendProject/archive/inviteMember.jsp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                aid: aid,
                inviterUid: inviterUid,
                inviteeUid: searchResult.uid
            })
        });
        const data = await response.json();
        if (data.message === 'success') {
            alert(`${searchResult.name}님께 초대를 보냈습니다.`);
            setKeyword('');
            setSearchResult(null);
            onClose();
        } else {
            alert(data.detail || '초대 전송 실패');
        }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="회원 관리">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p style={{ fontWeight: 'bold' }}>회원 초대</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        className='modal-input'
                        type="text"
                        placeholder="아이디 또는 이메일 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className='modal-confirm-btn' onClick={handleSearch} disabled={isSearching}>
                        검색
                    </button>
                </div>

                {searchResult && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{searchResult.name}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{searchResult.email}</p>
                        </div>
                        <button className='modal-confirm-btn' onClick={handleInvite}>초대</button>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default MemberManageModal;