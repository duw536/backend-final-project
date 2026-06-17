import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

function InfoManageModal({ aid, isOpen, onClose }) {
    const [infoName, setInfoName] = useState('');
    const [infoContent, setInfoContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // 저장소 권한 목록 불러오기
    useEffect(() => {
        if (!aid || !isOpen) return;
        fetch('http://localhost:8080/BackendProject/archive/getPermissionList.jsp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ aid })
        })
            .then(res => res.json())
            .then(data => setPermissions(data))
            .catch(err => console.error('권한 목록 불러오기 실패:', err));
    }, [aid, isOpen]);

    const handleClose = () => {
        setInfoName('');
        setInfoContent('');
        setTagInput('');
        setSelectedFile(null);
        setSelectedPermissions([]);
        onClose();
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSave = async () => {
        if (!infoName.trim()) {
            alert('정보명을 입력해주세요.');
            return;
        }
        if (!infoContent.trim()) {
            alert('정보내용을 입력해주세요.');
            return;
        }

        const uid = sessionStorage.getItem('uid');
        const formData = new FormData();
        formData.append('aid', aid);
        formData.append('uid', uid);
        formData.append('infoName', infoName);
        formData.append('infoContent', infoContent);
        formData.append('permissionIds', selectedPermissions.join(','));
        if (selectedFile) formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8080/BackendProject/info/addInfoPro.jsp', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('정보가 등록되었습니다.');
                handleClose();
            } else {
                alert('정보 등록 실패: ' + data.detail);
            }
        } catch (e) {
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="정보 등록">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '70px', textAlign: 'right' }}>정보명:</label>
                    <input
                        className='modal-input'
                        type="text"
                        placeholder="정보명을 입력하세요"
                        value={infoName}
                        onChange={(e) => setInfoName(e.target.value)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <label style={{ width: '70px', textAlign: 'right', paddingTop: '8px' }}>내용:</label>
                    <textarea
                        className='modal-input'
                        placeholder="정보 내용을 입력하세요"
                        value={infoContent}
                        onChange={(e) => setInfoContent(e.target.value)}
                        style={{ height: '100px', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '70px', textAlign: 'right' }}>태그:</label>
                    <input
                        className='modal-input'
                        type="text"
                        placeholder="태그 입력 (준비 중)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        disabled />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <label style={{ width: '70px', textAlign: 'right', paddingTop: '4px' }}>열람 권한:</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {permissions.map(p => (
                            <label key={p.permissionId} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(p.permissionId)}
                                    onChange={() => handlePermissionToggle(p.permissionId)} />
                                {p.permissionName}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '70px', textAlign: 'right' }}>파일:</label>
                    <input
                        className='modal-input'
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>

                <button className='modal-confirm-btn' onClick={handleSave}>
                    등록하기
                </button>
            </div>
        </Modal>
    );
}

export default InfoManageModal;