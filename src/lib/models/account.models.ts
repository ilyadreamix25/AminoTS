import { AminoResponse } from "./response.models.js";

export interface LoginResponse extends AminoResponse {
    auid: string;
    sid: string;
    secret: string;
    account: Account;
    userProfile: UserProfile;
}

export interface AccountResponse extends AminoResponse {
    account: Account;
}


export interface UserProfileResponse extends AminoResponse {
    userProfile: UserProfile;
}


export interface Account {
    status: number;
    uid: string;
    modifiedTime: string;
    nickname: string;
    googleID: string;
    icon: string;
    securityLevel: number;
    role: number;
    aminoIdEditable: boolean;
    aminoId: string;
    createdTime: string;
    extensions: AccountExtensions;
    email: string;
}

export interface AccountExtensions {
    contentLanguage: string;
    adsFlags: number;
    adsLevel: number;
    avatarFrameId: string;
    adsEnabled: boolean;
    mediaLabAdsMigrationAugust2020: boolean;
}

export interface UserProfile {
    status: number;
    itemsCount: number;
    uid: string;
    modifiedTime: string;
    followingStatus: number;
    onlineStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    avatarFrameId: string;
    reputation: number;
    postsCount: number;
    membersCount: number;
    nickname: string;
    icon: string;
    isNicknameVerified: boolean;
    level: number;
    notificationSubscriptionStatus: number;
    pushEnabled: boolean;
    membershipStatus: number;
    joinedCount: number;
    role: number;
    commentsCount: number;
    aminoId: string;
    ndcId: number;
    createdTime: string;
    storiesCount: number;
    blogsCount: number;
}

export interface SidInfo {
    loginTimestamp: number;
    loginIp: string;
    userId: string;
    clientType: number;
}
