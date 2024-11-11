import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { UpdateArtistDto, createArtistDto } from 'src/interfaces/artistsDtos';
import { TempDatabaseService } from 'src/services/db.service';

@Controller('artist')
export class ArtistsController {
constructor(private readonly dbService: TempDatabaseService) {

}

uuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.dbService.database.artists);
  }

  @Get(':id')
  findUser(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the artist id sent is not a valid UUID' });
        return
    }

    const foundArtist = this.dbService.database.artists.find((artist) => artist.id === id)

    if (!foundArtist){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'track not found' });
        return
    } else {
        res.status(HttpStatus.OK).json(foundArtist);
    }
  }


  @Post()
  create(@Body() createArtistDto: createArtistDto, @Res() res: Response ) {

    if (!createArtistDto.name || !createArtistDto.hasOwnProperty('grammy')) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Please provide all the fields for the Artist' });
        return
    } else {
    const newArtist = {
        id: randomUUID(),
        ...createArtistDto
    }
    this.dbService.database.artists.push(newArtist);
    res.status(HttpStatus.CREATED).json(newArtist);
  }
}

  @Put(':id')
  update(@Body() updateTrackDto: UpdateArtistDto, @Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the artist id sent is not a valid UUID' });
        return
    } 
    const foundArtist = this.dbService.database.artists.find((artist) => artist.id === id);

    if (!foundArtist){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'artist not found' });
        return
    } else {

    const indexOfArtist = this.dbService.database.artists.findIndex((artist) => artist.id === id);
    
    this.dbService.database.tracks[indexOfArtist] = {
        ...this.dbService.database.tracks[indexOfArtist],
        ...updateTrackDto
    }

    res.status(HttpStatus.OK).json( this.dbService.database.tracks[indexOfArtist]);
    return
    }
  }

  @Delete(':id')
  delete(@Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'The artist id sent is not a valid UUID' });
        return
    }

    const foundArtist = this.dbService.database.artists.find((artist) => artist.id === id);

    if (!foundArtist){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'artist not found' });
        return
    }

    const indexOfArtist = this.dbService.database.artists.findIndex((artist) => artist.id === id);

    this.dbService.database.tracks = this.dbService.database.tracks.map((track) => {
      if (track.artistId === foundArtist.id) {
        track.artistId = null
      }
      return track
    })


    this.dbService.database.albums = this.dbService.database.albums.map((album) => {
      if (album.artistId === foundArtist.id) {
        album.artistId = null
      }
      return album
    })

    const sliced = this.dbService.database.tracks.splice(indexOfArtist,1)

    // add logic for removing info from albums tracks and favorites

    res.status(HttpStatus.NO_CONTENT).json();
  }

}