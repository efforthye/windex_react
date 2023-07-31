import { Document, Types } from 'mongoose';

export default interface IManagement extends Document {
    durationAndCharge: { duration: number; charge: number }[];
    swapFeeRate: number;
    swapSlippage: number;
    tokenWarning: string;
    slippageWarning: string;
    swapModal: { slipageNotice: Array<string>; slipageSetting: Array<string>; unstakeNotice: Array<string> };
}
