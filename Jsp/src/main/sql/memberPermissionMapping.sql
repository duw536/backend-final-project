CREATE TABLE `member_permission_mapping` (
    uid INT NOT NULL COMMENT '회원고유id',
    aid INT NOT NULL COMMENT '저장소id',
    permission_id INT NOT NULL COMMENT '저장소권한id',

    PRIMARY KEY (uid, aid, permission_id),

    FOREIGN KEY (uid) REFERENCES `member`(uid) ON DELETE CASCADE,
    FOREIGN KEY (aid) REFERENCES `archive`(aid) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES `archive_permission`(permission_id) ON DELETE CASCADE
) COMMENT '회원 저장소 권한 매핑 테이블';