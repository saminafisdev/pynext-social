import type { Comment } from "@/pages/posts/types/comment";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { timeAgo } from "@/lib/time";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const { author } = comment;
  const { user } = author;
  return (
    <Card className="rounded-none shadow-none py-3 gap-4 border-t border-b-0 border-l-0 border-r-0">
      <CardHeader className="flex gap-2">
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <CardTitle>{user.full_name}</CardTitle>
          <CardDescription className="space-x-2">
            <span>@{user.username}</span>
            <span>{timeAgo(comment.created_at)}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="break-words">{comment.content}</p>
      </CardContent>
      <CardFooter>
        <Button variant={"ghost"}>
          <ThumbsUp />
        </Button>
        <Button variant={"ghost"}>
          <MessageCircle />
        </Button>
      </CardFooter>
    </Card>
  );
}
