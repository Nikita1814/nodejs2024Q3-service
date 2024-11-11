export class CreateAlbumDto {
  name: string;
  year: number;
  artistId?: string | null; // refers to Artist
}

export class UpdateAlbumDto {
  name: string | null;
  year: number | null;
  artistId?: string | null; // refers to Artist
}
