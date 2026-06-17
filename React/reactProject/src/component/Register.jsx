import { useState } from 'react';
import Modal from './Modal.jsx'; 

function Register() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserId('');
        setPassword('');
        setPasswordCheck('');
        setName('');
        setEmail('');
    };

    const handleRegister = async () => {
        if (!userId) {
            alert('아이디를 입력해주세요.');
            return;
        }

        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (password !== passwordCheck) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!name) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('유효한 이메일 형식이 아닙니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/BackendProject/member/registerPro.jsp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id: userId,
                    password: password,
                    name: name,
                    email: email
                })
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다.');
                handleCloseModal();
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류:', error);
            alert('서버와 연결할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button className='modal-confirm-btn' onClick={handleOpenModal}>회원가입</button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="회원가입">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="register-id" style={{ width: '100px', textAlign: 'right' }}>아이디:</label>
                        <input className='modal-input'
                            id="register-id"
                            type="text" 
                            placeholder="아이디를 입력하세요" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="register-passwd" style={{ width: '100px', textAlign: 'right' }}>비밀번호:</label>
                        <input className='modal-input'
                            id="register-passwd"
                            type="password" 
                            placeholder="비밀번호를 입력하세요" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="register-passwd-check" style={{ width: '100px', textAlign: 'right' }}>비밀번호확인:</label>
                        <input className='modal-input'
                            id="register-passwd-check"
                            type="password" 
                            placeholder="비밀번호를 입력하세요" 
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="register-name" style={{ width: '100px', textAlign: 'right' }}>이름:</label>
                        <input className='modal-input'
                            id="register-name"
                            type="text" 
                            placeholder="이름을 입력하세요" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="register-email" style={{ width: '100px', textAlign: 'right' }}>이메일:</label>
                        <input className='modal-input'
                            id="register-email"
                            type="text" 
                            placeholder="이메일을 입력하세요" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button className='modal-confirm-btn' onClick={handleRegister} disabled={isLoading}>
                        {isLoading ? '가입 중...' : '회원가입 하기'}
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default Register;