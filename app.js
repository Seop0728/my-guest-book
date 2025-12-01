const express = require('express');
const path = require('path');
const http = require('http');
const { sequelize, User } = require('./models');
require('dotenv').config({ path: '.env' });

const app = express();
const env = process.env;

// EC2 메타데이터(IMDSv2)에서 퍼블릭 IPv4 가져오기
async function getEc2PublicIp() {
  return new Promise((resolve, reject) => {
    // 1단계: IMDSv2 토큰 발급
    const tokenReq = http.request(
      {
        host: '169.254.169.254',
        path: '/latest/api/token',
        method: 'PUT',
        headers: {
          'X-aws-ec2-metadata-token-ttl-seconds': '21600',
        },
      },
      (tokenRes) => {
        let token = '';
        tokenRes.on('data', (chunk) => (token += chunk));
        tokenRes.on('end', () => {
          if (!token) return reject(new Error('No IMDS token'));

          // 2단계: 퍼블릭 IPv4 조회
          const ipReq = http.request(
            {
              host: '169.254.169.254',
              path: '/latest/meta-data/public-ipv4',
              method: 'GET',
              headers: {
                'X-aws-ec2-metadata-token': token,
              },
            },
            (ipRes) => {
              let ip = '';
              ipRes.on('data', (chunk) => (ip += chunk));
              ipRes.on('end', () => {
                if (!ip) return reject(new Error('No public-ipv4'));
                resolve(ip.trim());
              });
            }
          );

          ipReq.on('error', reject);
          ipReq.end();
        });
      }
    );

    tokenReq.on('error', reject);
    tokenReq.end();
  });
}

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// GET 요청 처리
app.get('/getComments', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['name', 'comment'],
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST 요청 처리
app.post('/uploads', async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (!name || !comment) {
      return res
        .status(400)
        .json({ message: 'Please provide both name and comment' });
    }

    const newPost = await User.create({
      name: name,
      comment: comment,
    });

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DB sync + 서버 실행 (즉시 실행 async 함수)
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('- 데이터베이스 연결 성공!');

    // 퍼블릭 IP: 우선 .env에 PUBLIC_IP 있으면 사용, 없으면 IMDS에서 조회
    let publicIp = env.PUBLIC_IP;
    if (!publicIp) {
      try {
        publicIp = await getEc2PublicIp();
      } catch (e) {
        console.error('EC2 퍼블릭 IP 조회 실패:', e.message);
      }
    }

    const port = env.PORT || 3000;

    const server = app.listen(port, '0.0.0.0', () => {
      const addr = server.address();
      const host = publicIp || addr.address; // 퍼블릭 IP 없으면 0.0.0.0 등으로 대체
      console.log(
        `- 서버 실행 중 (EC2 Public IP로 접속): http://${host}:${addr.port}`
      );
    });
  } catch (err) {
    console.error('서버 시작 중 오류:', err);
    process.exit(1);
  }
})();
