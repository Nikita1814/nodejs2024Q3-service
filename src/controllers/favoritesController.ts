import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { User } from 'src/interfaces/dbInterfaces';
import { FavoritesResponseDto } from 'src/interfaces/favoritesDto';
import { CreateUserDto, UpdateUserDto } from 'src/interfaces/userDtos';
import { TempDatabaseService } from 'src/services/db.service';
import { removeTokenUser } from 'test/utils';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly dbService: TempDatabaseService) {}

  uuidRegex = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  );

  @Get()
  findAll(@Res() res: Response) {
    const favorites = this.dbService.database.favorites;
    const favsObject: FavoritesResponseDto = {
      artists: [],
      tracks: [],
      albums: [],
    };

    favsObject.artists = this.dbService.database.artists.filter((artist) => {
      return favorites.artists.includes(artist.id);
    });

    favsObject.albums = this.dbService.database.albums.filter((album) => {
      return favorites.albums.includes(album.id);
    });

    favsObject.tracks = this.dbService.database.tracks.filter((track) => {
      return favorites.tracks.includes(track.id);
    });

    res.status(HttpStatus.OK).json(favsObject);
  }

  @Post('favs/track/:id')
  addTrack(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Please provide a valid track uuid' });
      return;
    }

    const idExists = !!this.dbService.database.tracks.find(
      (track) => track.id === id,
    );

    if (!idExists) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'track with such id not found' });
      return;
    }
    this.dbService.database.favorites.tracks.push(id);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Track Added to favorites!' });
  }

  @Post('favs/album/:id')
  addAlbum(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Please provide a valid album uuid' });
      return;
    }

    const idExists = !!this.dbService.database.albums.find(
      (album) => album.id === id,
    );

    if (!idExists) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'album with such id not found' });
      return;
    }
    this.dbService.database.favorites.albums.push(id);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Album added to favorites!' });
  }

  @Post('favs/artist/:id')
  addArtist(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Please Provide a valid artist uuid' });
      return;
    }

    const idExists = !!this.dbService.database.artists.find(
      (artist) => artist.id === id,
    );

    if (!idExists) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'artist with such id not found' });
      return;
    }
    this.dbService.database.favorites.artists.push(id);
    res
      .status(HttpStatus.CREATED)
      .json({ message: ' Artist added to favorites!' });
  }

  @Delete('/favs/track/:id')
  deleteTrack(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'the track id sent is not a valid UUID' });
      return;
    }

    const indexOfId = this.dbService.database.favorites.tracks.findIndex(
      (trackId) => trackId === id,
    );

    if (!indexOfId) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Favorite track not found' });
      return;
    }

    const sliced = this.dbService.database.favorites.tracks.splice(
      indexOfId,
      1,
    );

    res
      .status(HttpStatus.NO_CONTENT)
      .json({ message: 'Track removed from favorites' });
  }

  @Delete('/favs/artist/:id')
  deleteArtist(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'The artist id sent is not a valid UUID' });
      return;
    }

    const indexOfId = this.dbService.database.favorites.artists.findIndex(
      (artistId) => artistId === id,
    );

    if (!indexOfId) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Favorite artist not found' });
      return;
    }

    const sliced = this.dbService.database.favorites.artists.splice(
      indexOfId,
      1,
    );

    res
      .status(HttpStatus.NO_CONTENT)
      .json({ message: 'Artist removed from favorites' });
  }

  @Delete('/favs/album/:id')
  deleteAlbum(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id) || !id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'the album id sent is not a valid UUID' });
      return;
    }

    const indexOfId = this.dbService.database.favorites.albums.findIndex(
      (albumId) => albumId === id,
    );

    if (!indexOfId) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Favorite album not found' });
      return;
    }

    const sliced = this.dbService.database.favorites.albums.splice(
      indexOfId,
      1,
    );

    res
      .status(HttpStatus.NO_CONTENT)
      .json({ message: 'Album removed from favorites' });
  }
}
