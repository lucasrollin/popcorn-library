import { PrismaClient } from '../src/generated/prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.rating.deleteMany();
  await prisma.listFilm.deleteMany();
  await prisma.list.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.film.deleteMany();

  const passwordHash = await argon2.hash('password123');

  const alice = await prisma.user.create({
    data: { email: 'alice@example.com', username: 'alice', password: passwordHash },
  });

  const bob = await prisma.user.create({
    data: { email: 'bob@example.com', username: 'bob', password: passwordHash },
  });

  const inception = await prisma.film.create({
    data: {
      tmdbId: 27205,
      imdbId: 'tt1375666',
      title: 'Inception',
      overview:
        'Cobb is a skilled thief, the absolute best in the dangerous art of extraction: stealing valuable secrets from deep within the subconscious during the dream state.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
      releaseYear: 2010,
      tmdbRating: 8.4,
      tmdbVotesCount: 36000,
    },
  });

  const fightClub = await prisma.film.create({
    data: {
      tmdbId: 550,
      imdbId: 'tt0137523',
      title: 'Fight Club',
      overview:
        'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      releaseYear: 1999,
      tmdbRating: 8.4,
      tmdbVotesCount: 27000,
    },
  });

  const list = await prisma.list.create({
    data: {
      name: 'My favorites',
      description: 'A selection of films worth watching.',
      isPublic: true,
      userId: alice.id,
    },
  });

  await prisma.listFilm.createMany({
    data: [
      { listId: list.id, filmId: inception.id },
      { listId: list.id, filmId: fightClub.id },
    ],
  });

  await prisma.rating.createMany({
    data: [
      { score: 5, userId: alice.id, filmId: inception.id },
      { score: 4, userId: bob.id, filmId: inception.id },
      { score: 5, userId: alice.id, filmId: fightClub.id },
    ],
  });

  console.log('Seed done: 2 users, 2 films, 1 list (2 films), 3 ratings');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
