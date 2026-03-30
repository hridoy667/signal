/* eslint-disable prettier/prettier */
import { vote } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

enum Vote {
  UPVOTE='UPVOTE',
  DOWNVOTE='DOWNVOTE',
  NEUTRAL ='NEUTRAL'
}

export class CreateVotingDto {

    @IsNotEmpty()
    postId: string;

    @IsNotEmpty()
    @IsEnum(Vote)
    vote: vote;
}
