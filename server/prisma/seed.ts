// Seed: cria 10 utilizadores fictícios para testes locais.
// Correr com `npm run db:seed`. Pode ser corrido várias vezes: apaga primeiro
// os utilizadores do seed (emails @example.com) e volta a criá-los.
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import {
  ChurchAttendance,
  Denomination,
  Gender,
  Intention,
  PrismaClient,
} from '../src/generated/prisma/client.js';

const { DATABASE_URL, SEED_USER_PASSWORD } = process.env;

if (!DATABASE_URL || !SEED_USER_PASSWORD) {
  console.error('Define DATABASE_URL e SEED_USER_PASSWORD no .env (vê o .env.example).');
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

// Todos os dados são inventados. As idades vão dos 19 aos 33 anos.
const people = [
  {
    name: 'Beatriz',
    gender: Gender.FEMININO,
    birthDate: '2001-03-14',
    denomination: Denomination.EVANGELICA,
    church: 'Igreja da Graça, Lisboa',
    churchAttendance: ChurchAttendance.SEMANAL,
    ministry: 'Louvor',
    favoriteVerse: 'Filipenses 4:13',
    intention: Intention.NAMORO,
    bio: 'Canto no grupo de louvor e adoro caminhadas na serra.',
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    name: 'Tiago',
    gender: Gender.MASCULINO,
    birthDate: '1998-07-02',
    denomination: Denomination.BATISTA,
    church: 'Igreja Batista do Porto',
    churchAttendance: ChurchAttendance.VARIAS_VEZES_POR_SEMANA,
    ministry: 'Jovens',
    favoriteVerse: 'Josué 1:9',
    intention: Intention.CASAMENTO,
    bio: 'Engenheiro, líder de jovens e fã de futebol.',
    lat: 41.1579,
    lng: -8.6291,
  },
  {
    name: 'Inês',
    gender: Gender.FEMININO,
    birthDate: '2003-11-21',
    denomination: Denomination.CATOLICA,
    church: 'Paróquia de São Domingos, Braga',
    churchAttendance: ChurchAttendance.SEMANAL,
    ministry: null,
    favoriteVerse: '1 Coríntios 13:4',
    intention: Intention.AMIZADE,
    bio: 'Estudante de enfermagem. Café, livros e boas conversas.',
    lat: 41.5454,
    lng: -8.4265,
  },
  {
    name: 'Rafael',
    gender: Gender.MASCULINO,
    birthDate: '1995-01-30',
    denomination: Denomination.ASSEMBLEIA_DE_DEUS,
    church: 'Assembleia de Deus de Coimbra',
    churchAttendance: ChurchAttendance.SEMANAL,
    ministry: 'Multimédia',
    favoriteVerse: 'Salmos 23:1',
    intention: Intention.CASAMENTO,
    bio: 'Trato do som e da transmissão na igreja. Gosto de cozinhar.',
    lat: 40.2033,
    lng: -8.4103,
  },
  {
    name: 'Mariana',
    gender: Gender.FEMININO,
    birthDate: '1999-05-09',
    denomination: Denomination.PRESBITERIANA,
    church: 'Igreja Presbiteriana de Lisboa',
    churchAttendance: ChurchAttendance.QUINZENAL,
    ministry: null,
    favoriteVerse: 'Provérbios 3:5',
    intention: Intention.NAMORO,
    bio: 'Designer, viajante e apaixonada por fotografia.',
    lat: 38.7369,
    lng: -9.1427,
  },
  {
    name: 'João',
    gender: Gender.MASCULINO,
    birthDate: '2002-09-17',
    denomination: Denomination.CATOLICA,
    church: 'Paróquia de Santa Maria, Faro',
    churchAttendance: ChurchAttendance.MENSAL,
    ministry: null,
    favoriteVerse: 'Mateus 6:33',
    intention: Intention.AMIZADE,
    bio: 'Surf de manhã, estudo de gestão à tarde.',
    lat: 37.0194,
    lng: -7.9304,
  },
  {
    name: 'Sara',
    gender: Gender.FEMININO,
    birthDate: '1996-12-03',
    denomination: Denomination.ADVENTISTA,
    church: 'Igreja Adventista de Setúbal',
    churchAttendance: ChurchAttendance.SEMANAL,
    ministry: 'Crianças',
    favoriteVerse: 'Jeremias 29:11',
    intention: Intention.CASAMENTO,
    bio: 'Professora primária. Adoro crianças e animais.',
    lat: 38.5244,
    lng: -8.8882,
  },
  {
    name: 'Miguel',
    gender: Gender.MASCULINO,
    birthDate: '2000-04-25',
    denomination: Denomination.METODISTA,
    church: 'Igreja Metodista do Porto',
    churchAttendance: ChurchAttendance.SEMANAL,
    ministry: 'Ação social',
    favoriteVerse: 'Romanos 8:28',
    intention: Intention.NAMORO,
    bio: 'Voluntário num banco alimentar. Toco guitarra.',
    lat: 41.1496,
    lng: -8.611,
  },
  {
    name: 'Catarina',
    gender: Gender.FEMININO,
    birthDate: '2005-02-11',
    denomination: Denomination.EVANGELICA,
    church: 'Comunidade Cristã de Aveiro',
    churchAttendance: ChurchAttendance.OCASIONAL,
    ministry: null,
    favoriteVerse: 'Isaías 41:10',
    intention: Intention.AMIZADE,
    bio: 'Primeiro ano de arquitetura. Ainda a conhecer a cidade!',
    lat: 40.6405,
    lng: -8.6538,
  },
  {
    name: 'Daniel',
    gender: Gender.MASCULINO,
    birthDate: '1993-08-19',
    denomination: Denomination.ORTODOXA,
    church: 'Paróquia Ortodoxa de Lisboa',
    churchAttendance: ChurchAttendance.QUINZENAL,
    ministry: null,
    favoriteVerse: 'João 3:16',
    intention: Intention.CASAMENTO,
    bio: 'Médico. Corro maratonas e gosto de jogos de tabuleiro.',
    lat: 38.7071,
    lng: -9.1355,
  },
];

async function main() {
  const { count } = await prisma.user.deleteMany({
    where: { email: { endsWith: '@example.com' } },
  });
  if (count > 0) console.log(`Removidos ${count} utilizadores de seeds anteriores.`);

  // O hash é lento de propósito (é isso que protege as passwords); calcula-se uma vez.
  const passwordHash = await bcrypt.hash(SEED_USER_PASSWORD!, 10);

  for (const [index, person] of people.entries()) {
    const slug = person.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    await prisma.user.create({
      data: {
        email: `${slug}@example.com`,
        phone: `+3519100000${String(index).padStart(2, '0')}`,
        passwordHash,
        birthDate: new Date(person.birthDate),
        isVerified: index % 2 === 0,
        profile: {
          create: {
            name: person.name,
            bio: person.bio,
            gender: person.gender,
            denomination: person.denomination,
            church: person.church,
            churchAttendance: person.churchAttendance,
            servesInMinistry: person.ministry !== null,
            ministry: person.ministry,
            favoriteVerse: person.favoriteVerse,
            intention: person.intention,
            latitude: person.lat,
            longitude: person.lng,
          },
        },
        photos: {
          create: [0, 1].map((position) => ({
            url: `https://picsum.photos/seed/fematch-${slug}-${position}/600/800`,
            position,
            isApproved: true,
          })),
        },
      },
    });
  }

  console.log(`Criados ${people.length} utilizadores fictícios (emails @example.com).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
