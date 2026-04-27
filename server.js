// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// 데이터베이스 초기화 (가장 먼저 실행)
require('./database.js');

// 라우트 불러오기
const apiRoutes = require('./routes/api');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api', apiRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: 'DRT Contact Form Backend is running!',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            signup: '/api/signup',
            login: '/api/login',
            contact: '/api/contact',
        }
    });
});

// 404 처리
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '요청하신 경로를 찾을 수 없습니다.'
    });
});

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
    console.error('서버 에러:', error);
    res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다.'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
});