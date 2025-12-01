
# 1. 클라우드 기초

# 2. 목표

1. EC2를 활용하여 방명록 페이지 배포하기
2. RDS를 활용하여 방명록 페이지 DB 구성하기 

## 2.1 사용 도구

<div>
  <!-- HTML -->
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <!-- CSS -->
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <!-- JS -->
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <!-- JQuery -->
  <img src="https://img.shields.io/badge/jquery-0769AD?style=for-the-badge&logo=jquery&logoColor=white">
  <!-- bootstrap -->
  <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
  <!-- Axios -->
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
  <br/>
  <!-- Node.JS -->
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black">
  <!-- MySQL -->
  <img src="https://img.shields.io/badge/mySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
  <br/>
  <!-- Amazon EC2 -->
  <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
  <!-- Amazon RDS -->
  <img src="https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">
</div>


# 3. EC2 설정

## 3.1 고급 세부 정보

### 3.1.1 사용자 데이터 설정

```bash
#!/bin/bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3.2 Node.js 버전 확인

```bash
node -v
```

```bash
# 결과
v24.11.1
```

## 3.3 관리자 권한으로 변경

```bash
sudo su -
```

```bash
# 결과
ubuntu@ip -> root@ip
```

## 3.4 소스파일 깃 클론으로 가져오기

```bash
git clone https://github.com/Seop0728/Sesac-JUNGNANG.git
```

## 3.5 MySQL 패키지 설치

```bash
apt install mysql-server
```

## 3.6 MySQL root 사용자 접속

```bash
mysql -u root
```

## 3.7 MySQL root 사용자 비밀번호 설정

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'qwer1234';
```

## 3.8 MySQL root 사용자 비밀번호 접속

```bash
mysql -u root -p
```

## 3.9 MySQL 데이터베이스 생성

```mysql
CREATE DATABASE test;
```

## 3.10 MySQL 데이터베이스 생성 확인

```mysql
SHOW DATABASES;
```

```mysql
# 결과
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test               |
+--------------------+
```

## 3.11 프로젝트 디렉터리 이동

```bash
cd /home/ubuntu/my_guest_book/
```

## 3.12 방명록 실행 패키지 설치

```bash
npm install 
```
## 3.13 방명록 서버 시작

```bash
npm run start
```

## 3.14 방명록 제목 변경

```bash
sed -i 's/<h1>My Guest Book<\/h1>/<h1>입력하고싶은 문자<\/h1>/' public/index.html
```

## 3.15 키페어 권한 부여

### 3.15.1 윈도우

```powershell
icacls.exe myec2.pem /reset
icacls.exe myec2.pem /grant:r %username%:(R)
icacls.exe myec2.pem /inheritance:r
```

### 3.15.2 맥

```bash
chmod 600 "키페어"
```
## 3.16 EC2 원격 접속

```bash
ssh -i "키페어" ubuntu@<퍼블릭 IPv4 주소>
```

# 4. RDS 설정

## 4.1 방명록 ".env" 파일 수정

`my_guest_book/.env`

```bash
# Server
PORT = 4000

# Database
AWS_RDS_USERNAME = root
AWS_RDS_PASSWORD = qwer1234
AWS_RDS_DATABASE = test
AWS_RDS_HOST = <RDS 엔드포인트>
```

## 4.2 방명록 서버 시작

```bash
npm run start
```

## 4.3 RDS 접속

```
mysql -u root -h <RDS 엔드포인트> -P <포트> -p
```

## 4.4 MySQL 초기 데이터베이스 확인

```mysql
SHOW DATABASES;
```

```mysql
# 결과
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test               |
+--------------------+
```
## 4.5 "test" 데이터베이스 접속

```mysql
USE test;
```

## 4.6 테이블 확인

```mysql
SHOW TABLES;
```

```mysql
# 결과
+----------------+
| Tables_in_test |
+----------------+
| users          |
+----------------+
```
## 4.7 "users" 테이블 구조 조회

```mysql
DESC users;
```

```mysql
# 결과
+---------+--------------+------+-----+---------+----------------+
| Field   | Type         | Null | Key | Default | Extra          |
+---------+--------------+------+-----+---------+----------------+
| id      | int          | NO   | PRI | NULL    | auto_increment |
| name    | varchar(255) | NO   |     | NULL    |                |
| comment | varchar(255) | YES  |     | NULL    |                |
+---------+--------------+------+-----+---------+----------------+
```

## 4.8 "users" 테이블 삭제

```mysql
DROP TABLE users;
```

## 4.9 "users" 테이블 생성

```mysql
CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    comment VARCHAR(255)
);
```
## 4.10 "users" 테이블 조회

```mysql
SELECT * FROM users;
```

## 4.11 "users" 테이블 방명록 생성

```mysql
INSERT INTO users (name, comment) VALUES ('꼬부기', '꼬북꼬북');
```

## 4.12 "users" 테이블 방명록 업데이트

```mysql
UPDATE users SET name = '거북왕' WHERE id = 2;
```

## 4.13 "users" 테이블 방명록 삭제

```mysql
DELETE FROM users WHERE id = 2;
```
