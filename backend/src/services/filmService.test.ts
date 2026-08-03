import { describe, it, expect } from 'vitest';
import { mapMovieToFilmDetails } from './filmService';

describe('mapMovieToFilmDetails', () => {
  it('builds posterUrl from poster_path', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.posterUrl).toBe('https://image.tmdb.org/t/p/w500/abc.jpg');
  });

  it('returns null posterUrl when poster_path is null', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: null,
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.posterUrl).toBe(null);
  });

  it('parses releaseYear from the release_date year', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '1999-03-31',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.releaseYear).toBe(1999);
  });

  it('returns null releaseYear when release_date is empty', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.releaseYear).toBe(null);
  });

  it('builds backdropUrl from backdrop_path with the w1280 size', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/xyz.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.backdropUrl).toBe('https://image.tmdb.org/t/p/w1280/xyz.jpg');
  });

  it('returns null backdropUrl when backdrop_path is null', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: null,
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: { cast: [], crew: [] },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.backdropUrl).toBe(null);
  });

  it('picks the director out of the crew', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: {
        cast: [],
        crew: [
          { name: 'Wally Pfister', job: 'Director of Photography' },
          { name: 'Christopher Nolan', job: 'Director' },
          { name: 'Hans Zimmer', job: 'Original Music Composer' },
        ],
      },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.director).toBe('Christopher Nolan');
  });

  it('returns null director when the crew has no Director', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: {
        cast: [],
        crew: [{ name: 'Hans Zimmer', job: 'Original Music Composer' }],
      },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.director).toBe(null);
  });

  it('keeps the name and character of each cast member', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: {
        cast: [
          { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
          { name: 'Elliot Page', character: 'Ariadne' },
        ],
        crew: [],
      },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.cast).toEqual([
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { name: 'Elliot Page', character: 'Ariadne' },
    ]);
  });

  it('keeps only the first six cast members', () => {
    const movie = {
      id: 27205,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets.',
      poster_path: '/abc.jpg',
      backdrop_path: '/wide.jpg',
      release_date: '2010-07-16',
      vote_average: 8.4,
      vote_count: 30000,
      imdb_id: 'tt1375666',
      credits: {
        cast: [
          { name: 'Actor 1', character: 'Role 1' },
          { name: 'Actor 2', character: 'Role 2' },
          { name: 'Actor 3', character: 'Role 3' },
          { name: 'Actor 4', character: 'Role 4' },
          { name: 'Actor 5', character: 'Role 5' },
          { name: 'Actor 6', character: 'Role 6' },
          { name: 'Actor 7', character: 'Role 7' },
        ],
        crew: [],
      },
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.cast).toHaveLength(6);
    expect(result.cast[5].name).toBe('Actor 6');
  });
});
