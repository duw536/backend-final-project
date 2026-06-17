CREATE TABLE `info_permission_mapping` (
    info_id INT NOT NULL COMMENT '정보id',
    permission_id INT NOT NULL COMMENT '권한id',

    PRIMARY KEY (info_id, permission_id),
    FOREIGN KEY (info_id) REFERENCES `info`(info_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES `archive_permission`(permission_id) ON DELETE CASCADE
) COMMENT '정보 열람 권한 매핑 테이블';