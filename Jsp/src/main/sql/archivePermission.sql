CREATE TABLE `archive_permission` (
    permission_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT '저장소권한id',
    aid INT NOT NULL COMMENT '저장소id',
    permission_name VARCHAR(30) NOT NULL COMMENT '권한이름',
    can_manage_member TINYINT(1) DEFAULT 0 COMMENT '회원관리여부',
    can_manage_info TINYINT(1) DEFAULT 0 COMMENT '정보관리여부',
    can_manage_tag TINYINT(1) DEFAULT 0 COMMENT '태그관리여부',

    FOREIGN KEY (aid) REFERENCES `archive`(aid) ON DELETE CASCADE
) COMMENT '저장소 권한 목록 테이블';

SELECT * from archive_permission;