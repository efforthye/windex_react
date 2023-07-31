// /api/admin
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Admin, Management, Stake, StakeValue, Transaction } from '../schemas/index';

const router = express.Router();
const secret = process.env.COOKIE_SECRET || 'windex-secret';

router.get('/transactionList', async (req, res) => {
    try {
        const transactions = await Transaction.find({ type: 'Token' });
        res.send(transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send('transaction database error');
    }
});

router.get('/userTransactionList', async (req, res) => {
    try {
        const transactions = await Transaction.find({ type: { $ne: 'Token' } })
            .sort({ createdAt: -1 })
            .exec();
        res.send(transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send('transaction database error');
    }
});

router.post('/tokenSave', async (req, res) => {
    try {
        const { amount, saveType } = req.body;
        const createdTransaction = await Transaction.create({
            ...req.body,
            amount: saveType == 'mint' ? amount : amount * -1,
        });
        res.send(createdTransaction);
    } catch (err) {
        console.log(err);
        res.status(500).send('transaction database error');
    }
});

router.get('/stakingList', async (req, res) => {
    try {
        const stakeValues = await StakeValue.find({}).populate('nftId');
        if (!stakeValues.length) return res.send(stakeValues);
        const stake = await Stake.find({ stakeValueId: stakeValues[0]?._id });
        res.send([...stakeValues, stake]);
    } catch (err) {
        console.log(err);
        res.status(500).send('stake database error');
    }
});

router.post('/updateStakePrice', async (req, res) => {
    try {
        const { id, price } = req.body;
        const result = await StakeValue.updateOne({ _id: id }, { price });
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send('stakeValue database error');
    }
});

router.get('/duration', async (req, res) => {
    try {
        const management = (await Management.findOne({}))?.durationAndCharge;
        res.send(management);
    } catch (err) {
        console.log(err);
        res.status(500).send('management database error');
    }
});

router.get('/durationOnly', async (req, res) => {
    try {
        let durationOnlyArr: number[] = [];
        const management = (await Management.findOne({}))?.durationAndCharge;
        management?.map((item) => {
            durationOnlyArr.push(item.duration);
        });
        res.send(durationOnlyArr);
    } catch (err) {
        console.log(err);
        res.status(500).send('management database error');
    }
});

router.post('/updateDurationAndCharge', async (req, res) => {
    try {
        const { stakeDurationList } = req.body;
        const updatedManagement = await Management.updateOne({}, { durationAndCharge: stakeDurationList });
        res.send(updatedManagement);
    } catch (err) {
        console.log(err);
        res.status(500).send('management database error');
    }
});

router.get('/getModalText', async (req, res) => {
    try {
        const management = (await Management.find({}))[0].swapModal;
        res.send(management);
    } catch (err) {
        console.log(err);
        res.status(500).send('management database error');
    }
});

router.post('/updateModalText', async (req, res) => {
    try {
        const { slipageNotice, slipageSetting, unStake } = req.body;
        let updatedList: Array<Object> = [];

        const management = await Management.findOne({});
        const managementId = management?._id;

        if (slipageNotice?.length) {
            const updatedSlipageNotice = await Management.updateOne(
                { _id: managementId },
                { $set: { 'swapModal.slipageNotice': slipageNotice } }
            );
            updatedList.push(updatedSlipageNotice);
        }
        if (slipageSetting?.length) {
            const updatedSlipageSetting = await Management.updateOne(
                { _id: managementId },
                { $set: { 'swapModal.slipageSetting': slipageSetting } }
            );
            updatedList.push(updatedSlipageSetting);
        }
        if (unStake?.length) {
            const updatedUnstakeNotice = await Management.updateOne(
                { _id: managementId },
                { $set: { 'swapModal.unstakeNotice': unStake } }
            );
            updatedList.push(updatedUnstakeNotice);
        }
        res.status(200).send(updatedList);
    } catch (err) {
        console.log(err);
        res.status(500).send('management database error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { account, password, path }: { account: string; password: string; path: string } = req.body;

        const admin = await Admin.findOne({ account, password });
        const authority = admin?.authority;
        const payload = { authority, account };

        if (admin) {
            res.clearCookie('windex-admin');

            const requestDomain = req.headers.host?.split(':')[0]; // 요청이 들어온 도메인과 포트
            let cookieDomain = ''; // 쿠키 도메인
            if (requestDomain === 'localhost' || requestDomain === '127.0.0.1') {
                cookieDomain = 'localhost';
            } else if (requestDomain === 'server.efforthye.com' || requestDomain === '18.183.39.40') {
                cookieDomain = '.efforthye.com';
            }

            res.cookie('windex-admin', jwt.sign(payload, secret), {
                expires: new Date(Date.now() + 60000 * 60), // 60분
                httpOnly: true, // JavaScript 접근 불가
                secure: true, // HTTPS에서만 전송 (배포 시 사용)
                domain: cookieDomain,
                path,
                sameSite: 'none', // secure가 true여야 함
            });

            res.send({ status: 201, text: '로그인 성공' });
        } else {
            res.send({ status: 401, text: '로그인 실패' });
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/authentication', async (req, res) => {
    try {
        const { adminCookie } = req.body;
        const decoded = jwt.verify(adminCookie, secret) as JwtPayload;
        const { account } = decoded;
        const adminUser = await Admin.findOne({ account });
        if (adminUser) {
            res.send({ status: 201, text: '관리자 로그인 인증 성공' });
        } else {
            res.send({ status: 401, text: '관리자 로그인 인증 실패' });
        }
    } catch (err) {
        console.log(err);
    }
});

export default router;
