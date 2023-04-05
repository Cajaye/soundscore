import Image from "next/image";
import Link from "next/link";
import { Icons } from "~/components/icons";
import type { RouterOutputs } from "~/utils/api";
type CustomSpotifyData = RouterOutputs["tracks"]["getAlbums"][number];

const Track = ({ href, ...props }: CustomSpotifyData) => {
  return (
    <Link
      href={href}
      className="flex w-full cursor-pointer flex-row items-start space-x-3 rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-900"
    >
      <div className="self-center p-2">
        <Image
          priority
          className="h-24 w-24 rounded-md object-contain align-middle"
          alt={`${props.name}'s cover art`}
          src={props.cover_art_url as string}
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col space-y-1 p-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{props.artist}</p>
        </div>
        <p className="text-sm">{`${props.name} - ${props.type}`}</p>
        {props.total_tracks !== 0 && (
        <div className="flex items-center gap-2 pt-2">
          <Icons.music className="opacity-70" />
            <p className="text-xs text-slate-400">{props.total_tracks}</p>
          </div>
           )}
      </div>
    </Link>
  );
};

export default Track;