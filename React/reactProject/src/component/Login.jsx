import { useState } from 'react';
import Modal from './Modal.jsx'; 
import Register from './Register.jsx'

function Login({ isLoggedIn, setIsLoggedIn }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserId('');  
        setPassword('');
    };

    const handleLogin = async () => {
        if (!userId) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/BackendProject/member/loginPro.jsp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id: userId,
                    password: password,
                })
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('uid', data.uid);
                sessionStorage.setItem('username', data.name);
                setIsLoggedIn(true);
                alert('로그인이 완료되었습니다.');
                handleCloseModal();
            } else {
                try {
                    const errorData = await response.json();
                    alert(errorData.detail || '로그인에 실패했습니다.');
                } catch (e) {
                    alert('로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('서버 통신 오류:', error);
            alert('서버와 연결할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/BackendProject/member/logoutPro.jsp');
            
            if (response.ok) {
                setIsLoggedIn(false);
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('uid');
                sessionStorage.removeItem('username');
                alert('로그아웃 되었습니다.');
            } else {
                alert('로그아웃 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류:', error);
            alert('서버와 연결할 수 없습니다.');
        }
    };

    return (
        <>
            {isLoggedIn ? (
                <button className='intro-menu-item' onClick={handleLogout}>로그아웃</button>
            ) : (
                <button className='intro-menu-item' onClick={handleOpenModal}>로그인</button>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="로그인">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="login-id" style={{ width: '70px', textAlign: 'right' }}>아이디:</label>
                        <input className='modal-input'
                            id="login-id"
                            type="text" 
                            placeholder="아이디를 입력하세요" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="login-passwd" style={{ width: '70px', textAlign: 'right' }}>비밀번호:</label>
                        <input className='modal-input'
                            id="login-passwd"
                            type="password" 
                            placeholder="비밀번호를 입력하세요" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Register />
                    <button className='modal-confirm-btn' onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? '로그인 중...' : '로그인 하기'}
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default Login;