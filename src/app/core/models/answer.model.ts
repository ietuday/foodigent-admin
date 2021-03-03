import { FlagModel } from './flag.model';

export class AnswerModel {
    _id?: string;
    user?: string;
    question?: string;
    tags?: Array<string>;
    answerText?: string;
    comments?: Array<string>;
    feedback?: Array<string>;
    flag?: FlagModel;
    likedBy?: Array<string>;
    dislikedBy?: Array<string>;
    isAdminEdited?: boolean;
    originalAnswers?: Array<any>;
    isLocked?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
