CREATE TABLE `info` (
    info_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT '정보id',
    aid INT NOT NULL COMMENT '저장소id',
    uid INT NOT NULL COMMENT '작성자id',
    info_name VARCHAR(100) NOT NULL COMMENT '정보명',
    info_content VARCHAR(2000) NOT NULL COMMENT '정보내용',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '정보생성일',
    file_path VARCHAR(255) COMMENT '첨부파일경로',

    FOREIGN KEY (aid) REFERENCES `archive`(aid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES `member`(uid) ON DELETE CASCADE
) COMMENT '정보 테이블';