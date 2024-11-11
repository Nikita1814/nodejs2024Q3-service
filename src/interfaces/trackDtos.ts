export class CrateTrackDto {
  name: string;
  artistId?: string | null; // refers to Artist
  albumId?: string | null; // refers to Album
  duration: number; // integer number
}

export class UpdateTrackDto {
  name: string;
  artistId?: string | null; // refers to Artist
  albumId?: string | null; // refers to Album
  duration: number; // integer number
}
