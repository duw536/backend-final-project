CREATE TABLE `archive_invitation` (
    invitation_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '초대id',
    aid INT NOT NULL COMMENT '저장소id',
    inviter_uid INT NOT NULL COMMENT '초대한 사람',
    invitee_uid INT NOT NULL COMMENT '초대받은 사람',
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending' COMMENT '초대상태',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '초대일시',

    FOREIGN KEY (aid) REFERENCES `archive`(aid) ON DELETE CASCADE,
    FOREIGN KEY (inviter_uid) REFERENCES `member`(uid) ON DELETE CASCADE,
    FOREIGN KEY (invitee_uid) REFERENCES `member`(uid) ON DELETE CASCADE
) COMMENT '저장소 초대 테이블';