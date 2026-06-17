import React, { useState, useEffect } from 'react';

function ArchiveMemberList({ aid }) {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!aid) return;
        fetch('http://localhost:8080/BackendProject/archive/getArchiveMemberList.jsp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ aid })
        })
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error('멤버 목록 불러오기 실패:', err));
    }, [aid]);

    return (
        <div className="archive-member-list">
            {members.map((member) => (
                <div className="archive-member-card" key={member.uid}>
                    <p className="archive-member-name">{member.name}</p>
                    <p className="archive-member-role">{member.permissionName}</p>
                </div>
            ))}
        </div>
    );
}

export default ArchiveMemberList;