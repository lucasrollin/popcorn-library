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
    };

    const result = mapMovieToFilmDetails(movie);

    expect(result.backdropUrl).toBe(null);
  });
});
