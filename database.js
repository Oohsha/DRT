// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// db 폴더가 없으면 생성
const dbDir = path.resolve(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('db 폴더가 생성되었습니다.');
}

// 데이터베이스 파일의 절대 경로를 생성합니다.
const dbPath = path.resolve(__dirname, 'db', 'drt_contact.sqlite');

// 데이터베이스 파일 생성 또는 연결 (파일이 없으면 새로 만듭니다)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
    } else {
        console.log(`SQLite 데이터베이스에 성공적으로 연결되었습니다. (경로: ${dbPath})`);
        
        // 'users' 테이블이 없으면 생성합니다.
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('users 테이블 생성 오류:', err.message);
            } else {
                console.log("'users' 테이블이 성공적으로 준비되었습니다.");
            }
        });

        // 'contacts' 테이블도 생성 (문의사항 저장용)
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('contacts 테이블 생성 오류:', err.message);
            } else {
                console.log("'contacts' 테이블이 성공적으로 준비되었습니다.");
            }
        });
    }
});

module.exports = db;