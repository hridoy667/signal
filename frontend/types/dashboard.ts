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
