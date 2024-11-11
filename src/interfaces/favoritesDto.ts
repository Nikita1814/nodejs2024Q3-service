import { Album, Artist, Track } from "./dbInterfaces";

export class FavoritesResponseDto {
    artists: Artist[]; // favorite artists ids
    albums: Album[]; // favorite albums ids
    tracks: Track[]; // favorite tracks ids
  }