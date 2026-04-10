export type VoteType = "UPVOTE" | "DOWNVOTE" | "NEUTRAL";

export type FeedPost = {
  id: string;
  title: string | null;
  content: string | null;
  imageUrl: string[] | null;
  authorId: string;
  upvoats: number;
  downvoats: number;
  neutralvoats: number;
  comment_count: number;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  first_name: string | null;
  last_name: string | null;
  avatarUrl: string | null;
  userVote: VoteType | null;
  isLiked: boolean;
  distance_km: number | string | null;
  rank_score?: number | string | null;
};

export type MeUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatarUrl: string | null;
  district: string | null;
  userName: string | null;
};

/** GET /users/user-profile — safe user fields + posts (no password). */
export type ProfilePost = {
  id: string;
  title: string | null;
  content: string | null;
  imageUrl: string[] | null;
  createdAt: string;
  upvoats: number;
  downvoats: number;
  neutralvoats: number;
  comment_count: number;
  _count?: {
    comments: number;
    postVotes: number;
  };
};

export type UserProfile = {
  id: string;
  /** Present only when viewing your own profile (same as JWT user). */
  email?: string;
  first_name: string | null;
  last_name: string | null;
  userName: string | null;
  gender: string | null;
  district: string | null;
  upazila: string | null;
  avatarUrl: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  isVerified: boolean;
  createdAt: string;
  posts: ProfilePost[];
};

export type RoomMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatarUrl: string | null;
};

export type RoomListItem = {
  id: string;
  roomKey: string | null;
  type: string;
  name: string | null;
  /** Unread messages from others in this room (for the current user). */
  unreadCount?: number;
  members: RoomMember[];
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: { id: string; first_name: string | null };
  }[];
};

export type ChatMessage = {
  id: string;
  content: string;
  roomId: string;
  senderId: string;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatarUrl: string | null;
  };
};

export type CommentItem = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  author: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatarUrl: string | null;
  };
};
