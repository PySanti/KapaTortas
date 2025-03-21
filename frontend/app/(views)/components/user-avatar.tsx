import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/(views)/components/ui/avatar";
import { cn } from "@/app/controladores/lib/utils";

type UserAvatarProps = {
  user: Pick<User, "name" | "image">;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("");
  return (
    <Avatar>
      <AvatarFallback className={cn("font-base text-white bg-primary")}>
        {userInitials}
      </AvatarFallback>
      {/* {user.image ? (
        <AvatarImage src={user.image}></AvatarImage>
      ) : (
        <AvatarFallback className={cn('font-base text-white bg-primary')}>
          {userInitials}
        </AvatarFallback>
      )} */}
    </Avatar>
  );
}
