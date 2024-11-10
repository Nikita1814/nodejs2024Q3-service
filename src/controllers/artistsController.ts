import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { CrateTrackDto, UpdateTrackDto } from 'src/interfaces/trackDtos';
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
  create(@Body() createTrackDto: CrateTrackDto, @Res() res: Response ) {

    if (!createTrackDto.name || !createTrackDto.artistId || !createTrackDto.albumId || createTrackDto.duration ) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Please provide all the fields for the track' });
        return
    } else {
    const newTrack = {
        id: randomUUID(),
        ...createTrackDto
    }
    this.dbService.database.tracks.push(newTrack);
    res.status(HttpStatus.CREATED).json(newTrack);
  }
}

//   @Put(':id')
//   update(@Body() updateTrackDto: UpdateTrackDto, @Res() res: Response, @Param('id') id: string ) {

//     if (!this.uuidRegex.test(id)){
//         res.status(HttpStatus.BAD_REQUEST).json({ message: 'the track id sent is not a valid UUID' });
//         return
//     } 
//     const foundTrack = this.dbService.database.tracks.find((track) => track.id === id);

//     if (!foundTrack){
//         res.status(HttpStatus.NOT_FOUND).json({ message: 'track not found' });
//         return
//     } else {

//     const indexOfTrack = this.dbService.database.tracks.findIndex((track) => track.id === id);
    
//     this.dbService.database.tracks[indexOfTrack] = {
//         ...this.dbService.database.tracks[indexOfTrack],
//         ...updateTrackDto
//     }

//     res.status(HttpStatus.OK).json( this.dbService.database.tracks[indexOfTrack]);
//     return
//     }
//   }

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

    const sliced = this.dbService.database.tracks.splice(indexOfArtist,1)

    res.status(HttpStatus.NO_CONTENT).json();
  }

}