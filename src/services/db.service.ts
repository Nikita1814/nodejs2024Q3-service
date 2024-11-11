import { Injectable } from '@nestjs/common';
import { DbFields, DbValues, TempDb } from 'src/interfaces/dbInterfaces';


@Injectable()
export class TempDatabaseService {

  database: TempDb = {
    users: [],
    artists: [],
    tracks: [],
    albums: [],
    favorites: {
      artists: [],
      tracks: [],
      albums: []
    }
  }

// additem('users', {})
}