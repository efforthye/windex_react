// /api/user
import express, { Request, Response } from 'express';
import { User } from '../schemas/index';
import { uploadNormal } from '../index';
import dotenv from 'dotenv';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

const router = express.Router();

dotenv.config();

const REGION = 'ap-northeast-2';
const bucketName = 'nfstart-bucket';
const bucketParams = { Bucket: bucketName };

const s3 = new aws.S3({
    region: REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3Admin = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
});

interface IUser {
    name: string;
    age: number;
    email: string;
}

const upload = multer({
    storage: multerS3({
        s3: s3Admin,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) => {
            const newFileName = (file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8'));
            cb(null, `${newFileName}`);
        },
    }),
});

router.post('/add', async (req: Request, res: Response) => {
    try {
        const { name, age, email }: IUser = req.body;
        const createdUser = await User.create({ name, age, email });
        res.send(createdUser);
    } catch (err) {
        console.log(err);
        res.status(500).send('user database error');
    }
});

router.get('/userList', async (req: Request, res: Response) => {
    try {
        const allUser = await User.find({});
        res.send(allUser);
    } catch (err) {
        console.log(err);
        res.status(500).send('user database error');
    }
});

// 여기, 임시
router.post('/findUserList', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        res.send([
            { id: '1234', number: 0 },
            { id: '4567', number: 1 },
        ]);
    } catch (err) {
        console.log(err);
        res.status(500).send('find user error');
    }
});

// 여기, 임시
router.post('/profileSrc', upload.single('image'), async (req: Request, res: Response) => {
    // const { data: profileImg } = await axios.post('https://server.efforthye.com/api/user/profileSrc', {
    //     id: '1',
    // });
    const multerFile = req.file as Express.MulterS3.File;
    console.log(multerFile);
    res.send(req.file);
});

// 여기, 작업 시작
router.post('/login', async (req: Request, res: Response) => {
    console.log(req.body);
    const { id, pw }: { id: string; pw: string } = req.body;

    // 쿠키 관련 작업

    res.send({ ...req.body });
});

export default router;
