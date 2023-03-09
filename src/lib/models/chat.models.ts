import { AccountExtensions } from "./account.models.js";
import { AminoResponse } from "./response.models.js";

export interface MessageResponse extends AminoResponse {
    message: ChatMessage;
}

export interface ChatMessage {
    author: Author;
    threadId: string;
    mediaType: number;
    content: string;
    clientRefId: number;
    messageId: string;
    uid: string;
    createdTime: string;
    type: number;
    isHidden: boolean;
    includedInSummary: boolean;
    chatBubbleId: string;
    chatBubbleVersion: number;
    extensions: MessageExtensions;
}

export interface SendTextMessageParameters {
    replyTo?: string;
    mentionedArray?: MentionedArray[];
    type?: number;
    attachedObject?: {
        objectId?: string;
        objectType?: number;
        link?: string;
        title?: string;
        content?: string;
    }
}

export interface Author {
    uid: string;
    status: number;
    icon: string;
    reputation: number;
    role: number;
    nickname: string;
    level: number;
    accountMembershipStatus: number;
    avatarFrame: AvatarFrame;
}

export interface AvatarFrame {
    status: number;
    version: number;
    resourceUrl: string;
    name: string;
    icon: string;
    frameType: number;
    frameId: string;
}

export interface MentionedArray {
    uid: string;
}

export interface ReplyMessage {
    includedInSummary: boolean;
    uid: string;
    author: Author;
    isHidden: boolean;
    messageId: string;
    mediaType: number;
    content: string;
    clientRefId: number;
    threadId: string;
    createdTime: string;
    extensions: AccountExtensions;
    type: number;
}

export interface MessageExtensions {
    replyMessageId: string;
    replyMessage: ReplyMessage;
    mentionedArray: MentionedArray[];
}

export interface MessageParams {
    threadId: string;
    text: string | null;
    replyTo: string | null;
    mentionedArray: MentionedArray[] | null;
    type: number | null;
}

export interface MessageRequestExtensions {
    mentionedArray: MentionedArray[];
}

export interface MessageRequest {
    type: number;
    timestamp: number;
    replyMessageId: string | null;
    content: string | null;
    extensions: MessageRequestExtensions | null;
}

export interface Thread {
    userAddedTopicList: ThreadUserAddedTopicList[];
    uid: string;
    membersQuota: number;
    membersSummary: ThreadMembersSummary[];
    threadId: string;
    membersCount: number;
    strategyInfo: string;
    isPinned: boolean;
    title: string;
    tipInfo: ThreadTipInfo;
    membershipStatus: number;
    content: string;
    needHidden: boolean;
    alertOption: number;
    lastReadTime: string;
    type: number;
    status: number;
    publishToGlobal: number;
    lastMessageSummary: ThreadLastMessageSummary;
    condition: number;
    icon: string;
    latestActivityTime: string;
    author: Author;
    extensions: ThreadExtensions;
    ndcId: number;
}

export interface ThreadUserAddedTopicList {
    status: number;
    isOfficial: boolean;
    style: Style;
    isAlias: boolean;
    name: string;
    contentPoolId: string;
    topicId: number;
    advancedCommunityStatus: number;
    increaseId: number;
    visibility: number;
    source: number;
    chatStatus: number;
    scope: number;
    advancedStatus: number;
    isLocked: boolean;
    objectMappingScore: number;
    coverImage?: string;
    storyId?: string;
}

export interface Style {
    backgroundColor: string;
}

export interface ThreadMembersSummary {
    status: number;
    uid: string;
    membershipStatus: number;
    role: number;
    nickname: string;
    icon: string;
}

export interface ThreadTipInfo {
    tipOptionList: ThreadTipOptionList[];
    tipMaxCoin: number;
    tippersCount: number;
    tippable: boolean;
    tipMinCoin: number;
    tipCustomOption: ThreadTipCustomOption;
    tippedCoins: number;
}

export interface ThreadTipOptionList {
    value: number;
    icon: string;
}

export interface ThreadTipCustomOption {
    icon: string;
}

export interface ThreadLastMessageSummary {
    uid: string;
    type: number;
    mediaType: number;
    content: any;
    messageId: string;
    createdTime: string;
    isHidden: boolean;
    mediaValue: string;
}

export interface Author {
    status: number;
    isNicknameVerified: boolean;
    uid: string;
    level: number;
    followingStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    membershipStatus: number;
    avatarFrameId: string;
    reputation: number;
    role: number;
    avatarFrame: AvatarFrame;
    ndcId: number;
    membersCount: number;
    nickname: string;
    icon: string;
}

export interface AvatarFrame {
    status: number;
    version: number;
    resourceUrl: string;
    name: string;
    icon: string;
    frameType: number;
    frameId: string;
}

export interface ThreadExtensions {
    announcement: string;
    coHost: string[];
    language: string;
    membersCanInvite: boolean;
    screeningRoomPermission: ThreadScreeningRoomPermission;
    bm: [number, string, any];
    avchatMemberUidList: string[];
    visibility: number;
    bannedMemberUidList: string[];
    lastMembersSummaryUpdateTime: number;
    fansOnly: boolean;
    channelType: number;
    pinAnnouncement: boolean;
    vvChatJoinType: number;
    viewOnly: boolean;
}

export interface ThreadScreeningRoomPermission {
    action: number;
    uidList: string[];
}
