CREATE TABLE `archive` (  
    aid INT AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT '저장소아이디(고유번호)',
    uid INT NOT NULL COMMENT '저장소생성한회원고유번호',
    aname VARCHAR(50) NOT NULL COMMENT '저장소이름',
    acreate_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '저장소생성일',
    aimg_path VARCHAR(255) COMMENT '저장소대표이미지경로',

    FOREIGN KEY (uid) REFERENCES `member`(uid) ON DELETE CASCADE
) COMMENT '저장소 정보 테이블';

SELECT * from archive;