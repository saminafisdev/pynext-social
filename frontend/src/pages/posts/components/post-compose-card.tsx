import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { PostCreateDialog } from "./post-create-dialog";

export default function PostComposeCard() {
  return (
    <Card className="gap-0 mb-4">
      <CardContent>
        <PostCreateDialog />
      </CardContent>
      <CardFooter>
        <Button variant={"ghost"} size={"icon"}>
          <ImagePlus />
        </Button>
        <Button variant={"ghost"}>GIF</Button>
      </CardFooter>
    </Card>
  );
}
