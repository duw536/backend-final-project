CREATE TABLE `member` (  
    uid INT AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT '고유번호',
    id VARCHAR(50) NOT NULL COMMENT '아이디',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호',
    name VARCHAR(50) NOT NULL COMMENT '이름',
    email VARCHAR(100) NOT NULL COMMENT '이메일',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '가입일',
    img_path VARCHAR(255) COMMENT '회원대표이미지경로'
) COMMENT '회원 정보 테이블';

SELECT * from member;