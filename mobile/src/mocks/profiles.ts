// TEMPORÁRIO: perfis fictícios para simular o app com utilizadores registados,
// enquanto a API ainda não devolve perfis. São os mesmos do seed do servidor
// (server/prisma/seed.ts). Apagar quando os ecrãs passarem a ler da API.

export type MockProfile = {
  id: string;
  name: string;
  gender: 'Feminino' | 'Masculino';
  birthDate: string;
  city: string;
  denomination: string;
  church: string;
  ministry: string | null;
  favoriteVerse: string;
  intention: 'Amizade' | 'Namoro' | 'Casamento';
  bio: string;
  isVerified: boolean;
  // A primeira é a foto principal.
  photos: string[];
  latitude: number;
  longitude: number;
};

const photos = (slug: string) =>
  [0, 1, 2].map((n) => `https://picsum.photos/seed/fematch-${slug}-${n}/600/900`);

export const mockProfiles: MockProfile[] = [
  {
    id: 'beatriz',
    name: 'Beatriz',
    gender: 'Feminino',
    birthDate: '2001-03-14',
    city: 'Lisboa',
    denomination: 'Evangélica',
    church: 'Igreja da Graça, Lisboa',
    ministry: 'Louvor',
    favoriteVerse: 'Filipenses 4:13',
    intention: 'Namoro',
    bio: 'Canto no grupo de louvor e adoro caminhadas na serra.',
    isVerified: true,
    photos: photos('beatriz'),
    latitude: 38.7223,
    longitude: -9.1393,
  },
  {
    id: 'tiago',
    name: 'Tiago',
    gender: 'Masculino',
    birthDate: '1998-07-02',
    city: 'Porto',
    denomination: 'Batista',
    church: 'Igreja Batista do Porto',
    ministry: 'Jovens',
    favoriteVerse: 'Josué 1:9',
    intention: 'Casamento',
    bio: 'Engenheiro, líder de jovens e fã de futebol.',
    isVerified: false,
    photos: photos('tiago'),
    latitude: 41.1579,
    longitude: -8.6291,
  },
  {
    id: 'ines',
    name: 'Inês',
    gender: 'Feminino',
    birthDate: '2003-11-21',
    city: 'Braga',
    denomination: 'Católica',
    church: 'Paróquia de São Domingos, Braga',
    ministry: null,
    favoriteVerse: '1 Coríntios 13:4',
    intention: 'Amizade',
    bio: 'Estudante de enfermagem. Café, livros e boas conversas.',
    isVerified: true,
    photos: photos('ines'),
    latitude: 41.5454,
    longitude: -8.4265,
  },
  {
    id: 'rafael',
    name: 'Rafael',
    gender: 'Masculino',
    birthDate: '1995-01-30',
    city: 'Coimbra',
    denomination: 'Assembleia de Deus',
    church: 'Assembleia de Deus de Coimbra',
    ministry: 'Multimédia',
    favoriteVerse: 'Salmos 23:1',
    intention: 'Casamento',
    bio: 'Trato do som e da transmissão na igreja. Gosto de cozinhar.',
    isVerified: false,
    photos: photos('rafael'),
    latitude: 40.2033,
    longitude: -8.4103,
  },
  {
    id: 'mariana',
    name: 'Mariana',
    gender: 'Feminino',
    birthDate: '1999-05-09',
    city: 'Lisboa',
    denomination: 'Presbiteriana',
    church: 'Igreja Presbiteriana de Lisboa',
    ministry: null,
    favoriteVerse: 'Provérbios 3:5',
    intention: 'Namoro',
    bio: 'Designer, viajante e apaixonada por fotografia.',
    isVerified: true,
    photos: photos('mariana'),
    latitude: 38.7369,
    longitude: -9.1427,
  },
  {
    id: 'joao',
    name: 'João',
    gender: 'Masculino',
    birthDate: '2002-09-17',
    city: 'Faro',
    denomination: 'Católica',
    church: 'Paróquia de Santa Maria, Faro',
    ministry: null,
    favoriteVerse: 'Mateus 6:33',
    intention: 'Amizade',
    bio: 'Surf de manhã, estudo de gestão à tarde.',
    isVerified: false,
    photos: photos('joao'),
    latitude: 37.0194,
    longitude: -7.9304,
  },
  {
    id: 'sara',
    name: 'Sara',
    gender: 'Feminino',
    birthDate: '1996-12-03',
    city: 'Setúbal',
    denomination: 'Adventista',
    church: 'Igreja Adventista de Setúbal',
    ministry: 'Crianças',
    favoriteVerse: 'Jeremias 29:11',
    intention: 'Casamento',
    bio: 'Professora primária. Adoro crianças e animais.',
    isVerified: true,
    photos: photos('sara'),
    latitude: 38.5244,
    longitude: -8.8882,
  },
  {
    id: 'miguel',
    name: 'Miguel',
    gender: 'Masculino',
    birthDate: '2000-04-25',
    city: 'Porto',
    denomination: 'Metodista',
    church: 'Igreja Metodista do Porto',
    ministry: 'Ação social',
    favoriteVerse: 'Romanos 8:28',
    intention: 'Namoro',
    bio: 'Voluntário num banco alimentar. Toco guitarra.',
    isVerified: false,
    photos: photos('miguel'),
    latitude: 41.1496,
    longitude: -8.611,
  },
  {
    id: 'catarina',
    name: 'Catarina',
    gender: 'Feminino',
    birthDate: '2005-02-11',
    city: 'Aveiro',
    denomination: 'Evangélica',
    church: 'Comunidade Cristã de Aveiro',
    ministry: null,
    favoriteVerse: 'Isaías 41:10',
    intention: 'Amizade',
    bio: 'Primeiro ano de arquitetura. Ainda a conhecer a cidade!',
    isVerified: true,
    photos: photos('catarina'),
    latitude: 40.6405,
    longitude: -8.6538,
  },
  {
    id: 'daniel',
    name: 'Daniel',
    gender: 'Masculino',
    birthDate: '1993-08-19',
    city: 'Lisboa',
    denomination: 'Ortodoxa',
    church: 'Paróquia Ortodoxa de Lisboa',
    ministry: null,
    favoriteVerse: 'João 3:16',
    intention: 'Casamento',
    bio: 'Médico. Corro maratonas e gosto de jogos de tabuleiro.',
    isVerified: false,
    photos: photos('daniel'),
    latitude: 38.7071,
    longitude: -9.1355,
  },
];

// Quem já deu Gosto a quem está a usar o app: gostar de volta dá match.
export const LIKES_YOU = ['beatriz', 'ines', 'mariana', 'sara', 'catarina', 'tiago', 'miguel'];

export function findProfile(id: string) {
  return mockProfiles.find((p) => p.id === id);
}

export function getAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}
