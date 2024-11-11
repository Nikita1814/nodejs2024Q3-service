export class createArtistDto {
  name: string;
  grammy: boolean;
}

export class UpdateArtistDto {
  name: string | null;
  grammy: boolean | null;
}
