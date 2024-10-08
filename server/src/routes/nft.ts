// /api/nft
import express from 'express';
import { INft } from '../interfaces';
import { Nft, Stake, StakeValue, User } from '../schemas';

const router = express.Router();

router.get('/nftlist', async (req, res) => {
    try {
        let data: INft[] = await Nft.find({}).populate('owners.owner').populate('transactions').populate('saleInfo');

        const curOffset = Number(req.query.limit) + Number(req.query.offset);
        const curSlice = data.slice(Number(req.query.offset), curOffset);
        const nextSlice = data.slice(curOffset, curOffset + Number(req.query.limit));

        let next = { offset: curOffset, limit: req.query.limit };

        if (!nextSlice.length) {
            res.send({ count: Number(req.query.offset) + curSlice.length, result: curSlice });
        } else {
            res.send({
                count: req.query.offset,
                next,
                result: curSlice,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('nft list error');
    }
});

router.get('/mainList', async (req, res) => {
    try {
        const { limit, offset } = req.query;

        const data = await StakeValue.aggregate([
            {
                $match: {
                    $or: [{ price: { $gte: 0 } }, { amount: { $elemMatch: { $gte: 0 } } }],
                },
            },
            {
                $lookup: {
                    from: 'nfts',
                    localField: 'nftId',
                    foreignField: '_id',
                    as: 'nft',
                },
            },
            {
                $addFields: {
                    nft: { $arrayElemAt: ['$nft', 0] },
                },
            },
        ]);

        const curOffset = Number(limit) + Number(offset);
        const curSlice = data.slice(Number(offset), curOffset);
        const nextSlice = data.slice(curOffset, curOffset + Number(limit));
        let next = { offset: curOffset, limit: limit };

        if (!nextSlice.length) {
            res.send({ count: Number(offset) + curSlice.length, result: curSlice });
        } else {
            res.send({
                count: offset,
                next,
                result: curSlice,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('stakeValue database error');
    }
});

// 유저가 staking, unstaking, claim 할 수 있는 nft 목록
router.get('/userNftList', async (req, res) => {
    let { userAccount, limit, offset } = req.query;

    // 유저의 모든 nft 목록을 담을 배열
    let userNftList: Array<Object> = [];
    // 유저의 nft 목록에 값 추가(nft : 해당 NFT, tokenId : 고유 번호, amount : 가지고 있는 ERC1155 개수)
    const userInfo = await User.findOne({ account: userAccount }).populate('nfts');
    const userNfts = userInfo?.nfts;
    if (!userNfts?.length) return res.status(400).send({ data: 'The nft list does not exist.' });
    userNfts.forEach((nft) => {
        const tokenId = Object(nft).tokenId;
        if (tokenId !== undefined && tokenId !== null)
            userNftList.push({ nft, tokenId, amount: Object(nft).amount, status: 'default' });
    });

    // 스테이킹 가능한지 여부 확인
    for (let i = 0; i < userNftList.length; i++) {
        // 배열의 i번째
        const nftTokenId = Object(userNftList[i]).tokenId;

        if (nftTokenId !== undefined && nftTokenId !== null) {
            // 해당 토큰 아이디의 stakeValue가 있는지 찾는다.
            const stakeValue = (
                await StakeValue.find({
                    $or: [
                        { price: { $gt: 0 } },
                        { average: { $gt: 0 } },
                        { amount: { $ne: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                    ],
                })
                    .populate({
                        path: 'nftId',
                    })
                    .exec()
            ).filter((item) => Object(item.nftId).tokenId == nftTokenId);

            if (stakeValue[0]) {
                let tempNft = { ...Object(userNftList[i]) };
                tempNft.status = 'stakeAble';
                tempNft.stakeValueId = Object(stakeValue[0])._id;
                tempNft.price = stakeValue[0].price;
                tempNft.reward = (stakeValue[0].price || 1) * 0.1;
                userNftList[i] = tempNft;
            }
        } else {
            return;
        }
    }

    // 유저의 실제 스테이킹 중인 목록 (6m, stake 개수 : 30)
    const userStakingList = await Stake.find({ account: userAccount }).populate({
        path: 'stakeValueId',
        populate: {
            path: 'nftId',
            model: Nft,
        },
    });
    let tempPushList: Array<Object> = [];
    // 스테이킹 중인 NFT는 해당 개수만큼 기존 NFTs에서 제외 후 Staking Nfts를 배열에 추가
    userStakingList.forEach((stake, i) => {
        for (let j = 0; j < userNftList.length; ++j) {
            const nftTokenId = Object(userNftList[j]).tokenId;
            const stakeNftTokenId = Object(stake)?.stakeValueId?.nftId?.tokenId;
            const stakeNftAmount = Object(stake)?.amount;
            if (nftTokenId == stakeNftTokenId && stakeNftTokenId) {
                // 제거
                const minusAmount = stakeNftAmount;
                const calcAmount = Object(userNftList[j]).amount - minusAmount;

                userNftList[j] = { ...userNftList[j], amount: calcAmount };

                // 추가
                const stakeValue = Object(stake).stakeValueId;
                const addStakingObject = {
                    stake,
                    nft: stakeValue.nftId,
                    stakeValuePrice: stakeValue.price,
                    stakeValueDuration: stakeValue.duration,
                    stakeValueAmounts: stakeValue.amount,
                    stakeValueAverage: stakeValue.average,
                    stakeValueId: stakeValue._id,
                    tokenId: stakeNftTokenId,
                    amount: stakeNftAmount,
                    reward: stake.reward,
                    blockTime: Object(stake).blockTime,
                    expiredAt: Object(stake).expiredAt,
                    status: 'staking',
                };
                tempPushList.push(addStakingObject);
            }
        }
    });
    userNftList = [...userNftList, ...tempPushList];
    userNftList = userNftList.filter((item) => {
        if (Object(item).amount > 0) return item;
    });

    // 추가
    const data = userNftList.filter((item: any) => {
        if (item.status !== 'default') {
            return item;
        }
    });

    const curOffset = Number(limit) + Number(offset);
    const curSlice = data.slice(Number(offset), curOffset);
    const nextSlice = data.slice(curOffset, curOffset + Number(limit));

    let next = { offset: curOffset, limit: limit };

    if (!nextSlice.length) {
        res.send({ count: Number(offset) + curSlice.length, result: curSlice });
    } else {
        res.send({
            count: offset,
            next,
            result: curSlice,
        });
    }
    res.end();
});

router.post('/myNFTs', async (req, res) => {
    try {
        let { account } = req.body;

        let userNftList: Array<Object> = [];
        const userInfo = await User.findOne({ account }).populate('nfts');
        const userNfts = userInfo?.nfts;
        if (!userNfts?.length) return res.status(400).send({ data: 'The nft list does not exist.' });
        userNfts.forEach((nft) => {
            const tokenId = Object(nft).tokenId;
            if (tokenId !== undefined && tokenId !== null)
                userNftList.push({ nft, tokenId, amount: Object(nft).amount, status: 'default' });
        });

        for (let i = 0; i < userNftList.length; i++) {
            const nftTokenId = Object(userNftList[i]).tokenId;

            if (nftTokenId !== undefined && nftTokenId !== null) {
                const stakeValue = (
                    await StakeValue.find({
                        $or: [
                            { price: { $gt: 0 } },
                            { average: { $gt: 0 } },
                            { amount: { $ne: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } },
                        ],
                    })
                        .populate({
                            path: 'nftId',
                        })
                        .exec()
                ).filter((item) => Object(item.nftId).tokenId == nftTokenId);

                if (stakeValue[0]) {
                    let tempNft = { ...Object(userNftList[i]) };
                    tempNft.status = 'stakeAble';
                    tempNft.stakeValueId = Object(stakeValue[0])._id;
                    tempNft.price = stakeValue[0].price;
                    tempNft.reward = (stakeValue[0].price || 1) * 0.1;
                    userNftList[i] = tempNft;
                }
            } else {
                return;
            }
        }

        // 유저의 실제 스테이킹 중인 목록 (6m, stake 개수 : 30)
        const userStakingList = await Stake.find({ account }).populate({
            path: 'stakeValueId',
            populate: {
                path: 'nftId',
                model: Nft,
            },
        });
        let tempPushList: Array<Object> = [];

        userStakingList.forEach((stake, i) => {
            for (let j = 0; j < userNftList.length; ++j) {
                const nftTokenId = Object(userNftList[j]).tokenId;
                const stakeNftTokenId = Object(stake)?.stakeValueId?.nftId?.tokenId;
                const stakeNftAmount = Object(stake)?.amount;
                if (nftTokenId == stakeNftTokenId && stakeNftTokenId) {
                    const minusAmount = stakeNftAmount;
                    const calcAmount = Object(userNftList[j]).amount - minusAmount;

                    userNftList[j] = { ...userNftList[j], amount: calcAmount };

                    const stakeValue = Object(stake).stakeValueId;
                    const addStakingObject = {
                        stake,
                        nft: stakeValue.nftId,
                        stakeValuePrice: stakeValue.price,
                        stakeValueDuration: stakeValue.duration,
                        stakeValueAmounts: stakeValue.amount,
                        stakeValueAverage: stakeValue.average,
                        stakeValueId: stakeValue._id,
                        tokenId: stakeNftTokenId,
                        amount: stakeNftAmount,
                        reward: stake.reward,
                        blockTime: Object(stake).blockTime,
                        expiredAt: Object(stake).expiredAt,
                        status: 'staking',
                    };
                    tempPushList.push(addStakingObject);
                }
            }
        });
        userNftList = [...userNftList, ...tempPushList];
        userNftList = userNftList.filter((item) => {
            if (Object(item).amount > 0) return item;
        });

        const data = userNftList.filter((item: any) => {
            if (item.status !== 'default' && item.status == 'stakeAble') {
                return item;
            }
        });
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
    }
});

export default router;
