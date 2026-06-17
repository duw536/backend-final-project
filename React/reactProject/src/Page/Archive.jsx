import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArchiveMemberList from "../component/ArchiveMemberList.jsx";
import MemberManageModal from "../component/MemberManageModal.jsx";
import InfoManageModal from "../component/InfoManageModal.jsx";
import '../css/Archive.css';

function Archive() {
    const { aid } = useParams();
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [permission, setPermission] = useState({
        canManageMember: 0,
        canManageInfo: 0,
        canManageTag: 0
    });

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid || !aid) return;
        fetch('http://localhost:8080/BackendProject/archive/getMyPermission.jsp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ uid, aid })
        })
        .then(res => res.json())
        .then(data => setPermission(data))
        .catch(err => console.error('권한 조회 실패:', err));
    }, [aid]);

    return (
        <>
            <h2>저장소 제목</h2>
            <div className="archive-searchbar">
                <input className="archive-search-box" type="text" placeholder="정보 검색"/>
                <button className="archive-menu-item">검색</button>
            </div>

            <div className="archive-main-container">
                <div className="archive-left-menu">
                    {permission.canManageMember === 1 && (
                        <div className="archive-left-card" onClick={() => setIsMemberModalOpen(true)}>
                            <div className="archive-left-card-icon">👤</div>
                            <p>회원 관리</p>
                        </div>
                    )}
                    {permission.canManageInfo === 1 && (
                        <>
                            <div className="archive-left-card">
                                <div className="archive-left-card-icon">📄</div>
                                <p>정보 관리</p>
                            </div>
                            <div className="archive-left-card" onClick={() => setIsInfoModalOpen(true)}>
                                <div className="archive-left-card-icon">➕</div>
                                <p>정보 등록</p>
                            </div>
                        </>
                    )}
                    {permission.canManageTag === 1 && (
                        <div className="archive-left-card">
                            <div className="archive-left-card-icon">🏷️</div>
                            <p>태그 관리</p>
                        </div>
                    )}
                </div>

                <div className="archive-middle-menu">
                    <div className="archive-box archive-mid-display">검색 결과</div>
                    <div className="archive-box archive-mid-header">
                        <button className="archive-toggle-btn archive-leftAlign">프리셋 수정</button>
                        <p className="archive-leftAlign">제목</p>
                        <button className="archive-toggle-btn" id="midUpContent">↑</button>
                        <button className="archive-toggle-btn" id="midDownContent">↓</button>
                        <button className="archive-toggle-btn" id="midToggleContent">열기</button>
                    </div>
                    <div id="targetContent" className="archive-box mid-content">
                        <p style={{padding: "10px"}}></p>
                    </div>
                </div>

                <div className="archive-box archive-right-menu">
                    <ArchiveMemberList aid={aid} />
                </div>
            </div>

            <MemberManageModal
                aid={aid}
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
            />
            <InfoManageModal
                aid={aid}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
        </>
    );
}

export default Archive;