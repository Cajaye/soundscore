import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const Header = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    
  if (!isLoaded) return <div />;

  return (
    <header className="flex items-center justify-between border-b border-b-slate-600 p-4">
      <div className="flex items-center justify-center">
        <Link href="/">
          <Icons.logo className="mr-2 h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          <Link href="/">Soundscore</Link>
        </h1>
      </div>
      <nav>
        <ul className="flex items-center justify-center gap-2">
          <li>
            <Link href="/albums">
              <Button>Albums</Button>
            </Link>
          </li>
          <li>
            <Link href="/tracks">
              <Button>Tracks</Button>
            </Link>
          </li>
          <li>
            <Link href="/news">
              <Button>News</Button>
            </Link>
          </li>

          {!isSignedIn && (
            <li>
              <SignInButton mode="modal">
                <Button>
                  <Icons.logIn className="mr-2 h-4 w-4" /> Sign in
                </Button>
              </SignInButton>
            </li>
          )}

          {isSignedIn && (
            <li>
              <SignOutButton>
                <Button>
                  <Icons.logOut className="mr-2 h-4 w-4" />
                  <span className="text-sm font-semibold tracking-tight">
                    Log out
                  </span>
                </Button>
              </SignOutButton>
            </li>
          )}

          {isSignedIn && (
            <li>
              <Link
                href={user.id}
                className="flex items-center justify-center gap-2"
              >
                <Avatar>
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback>
                    <Icons.logo className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold tracking-tight">
                  {user.fullName}
                </p>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
