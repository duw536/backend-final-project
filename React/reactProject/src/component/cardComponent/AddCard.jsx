import React, { useState } from 'react';
import Modal from '../Modal.jsx'; 
import '../../css/Card.css';
import '../../css/Modal.css';

function AddCard({ onAdd }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArchiveName, setNewArchiveName] = useState('');
  const [archiveImagePreview, setArchiveImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenModal = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewArchiveName('');
    setArchiveImagePreview('');
    setSelectedFile(null);
  };

  const handleSaveCard = async () => {
    if (!newArchiveName.trim()) {
      alert('저장소 이름을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('aname', newArchiveName);
    const uid = sessionStorage.getItem('uid'); 
    formData.append('uid', uid); 

    if (selectedFile) {
      formData.append('aimg', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:8080/BackendProject/archive/addCardPro.jsp', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.message === 'success') {
        alert('저장소가 생성되었습니다.');
        onAdd(); 
        handleCloseModal();
      } else {
        alert('저장소 생성 실패: ' + result.detail);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="card create-card" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
        <div className="card-icon">+</div>
        <p>저장소 추가</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="새 저장소 추가">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input className='modal-input'
            type="text" 
            placeholder="저장소 이름을 입력하세요" 
            value={newArchiveName}
            onChange={(e) => setNewArchiveName(e.target.value)} />
          
          <input className='modal-input'
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setArchiveImagePreview(URL.createObjectURL(file));
              }
            }} />

          {archiveImagePreview && (
            <img src={archiveImagePreview} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          )}

          <button className='modal-confirm-btn' onClick={handleSaveCard}>
            저장하기
          </button>
        </div>
      </Modal>
    </>
  );
}

export default AddCard;