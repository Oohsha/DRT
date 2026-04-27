// routes/api.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-jwt';

// 헬스 체크
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// 회원가입
router.post('/signup',
    [
        body('username', '이름은 2자 이상 입력해주세요.').trim().isLength({ min: 2 }),
        body('email', '올바른 이메일 주소를 입력해주세요.').isEmail(),
        body('password', '비밀번호는 6자 이상 입력해주세요.').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 값을 확인해주세요.',
                errors: errors.array().map(e => e.msg)
            });
        }

        const { username, email, password } = req.body;

        try {
            db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
                if (err) {
                    console.error('데이터베이스 조회 오류:', err);
                    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
                }

                if (row) {
                    return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, hashedPassword],
                    function (err) {
                        if (err) {
                            console.error('사용자 저장 오류:', err);
                            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
                        }

                        res.status(201).json({
                            success: true,
                            message: '회원가입이 완료되었습니다. 로그인해주세요.'
                        });
                    }
                );
            });

        } catch (error) {
            console.error('회원가입 오류:', error);
            res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
    }
);

// 로그인
router.post('/login',
    [
        body('email', '올바른 이메일 주소를 입력해주세요.').isEmail(),
        body('password', '비밀번호를 입력해주세요.').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 값을 확인해주세요.',
                errors: errors.array().map(e => e.msg)
            });
        }

        const { email, password } = req.body;

        try {
            db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
                if (err) {
                    console.error('데이터베이스 조회 오류:', err);
                    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
                    });
                }

                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(200).json({
                    success: true,
                    message: '로그인 성공!',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            });

        } catch (error) {
            console.error('로그인 오류:', error);
            res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
    }
);

// 문의하기
router.post('/contact',
    [
        body('name', '이름은 2자 이상 입력해주세요.').trim().isLength({ min: 2 }),
        body('email', '올바른 이메일 주소를 입력해주세요.').isEmail().normalizeEmail(),
        body('subject', '제목은 5자 이상 입력해주세요.').trim().isLength({ min: 5 }),
        body('message', '메시지는 10자 이상 입력해주세요.').trim().isLength({ min: 10 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 값에 오류가 있습니다.',
                errors: errors.array().map(e => e.msg),
            });
        }

        const { name, email, subject, message } = req.body;

        db.run('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message],
            function (err) {
                if (err) {
                    console.error('문의사항 저장 오류:', err);
                    return res.status(500).json({
                        success: false,
                        message: '문의사항 저장 중 오류가 발생했습니다.',
                    });
                }
            }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sdh250415@sdh.hs.kr',
                pass: 'biftssjbtvmkapax',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"${name}" <sdh250415@sdh.hs.kr>`,
            to: 'sdh250415@sdh.hs.kr',
            replyTo: email,
            subject: `[DRT 문의] ${subject}`,
            html: `
                <h2>새로운 문의가 도착했습니다.</h2>
                <p><strong>보낸 사람:</strong> ${name}</p>
                <p><strong>이메일:</strong> ${email}</p>
                <hr>
                <h3>제목: ${subject}</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({
                success: true,
                message: '메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 회신드리겠습니다!',
            });
        } catch (error) {
            console.error('이메일 전송 오류:', error);
            res.status(500).json({
                success: false,
                message: '메시지 전송 중 서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
            });
        }
    }
);

module.exports = router;
