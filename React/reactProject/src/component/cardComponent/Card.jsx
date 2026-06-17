import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCard from './AddCard.jsx';
import '../../css/Card.css';

function Card({ isLoggedIn }) { 
  const [archives, setArchives] = useState([]);
  const navigate = useNavigate();

  const fetchArchives = async () => {
    const uid = sessionStorage.getItem('uid');
    if (!uid || uid === 'null') {
      setArchives([]);
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/BackendProject/archive/getArchiveList.jsp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ uid })
      });
      const data = await response.json();
      setArchives(data);
    } catch (error) {
      console.error('목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, [isLoggedIn]);

  return (
    <div className="card-archive-container">
      <AddCard onAdd={fetchArchives} />
      {archives.map((archive) => (
        <div
          className="card"
          key={archive.aid}
          onClick={() => navigate(`/archive/${archive.aid}`)}
          style={{ cursor: 'pointer' }}
        >
          {archive.aimgPath && (
            <img
              src={`http://localhost:8080/BackendProject${archive.aimgPath}`}
              alt={archive.aname}
              style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
          )}
          <p>{archive.aname}</p>
        </div>
      ))}
    </div>
  );
}

export default Card;