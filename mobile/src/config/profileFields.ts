import type { IconName } from '@/components/Icon';

// Campos do perfil que aparecem como chips no ecrã Perfil e como linhas em "Editar perfil".
// Com `options` escolhe-se de uma lista; sem elas escreve-se texto livre.

export type FieldId =
  | 'city'
  | 'church'
  | 'denomination'
  | 'height'
  | 'job'
  | 'education'
  | 'family'
  | 'drinking'
  | 'intention'
  | 'ministry'
  | 'languages';

export type ProfileField = {
  id: FieldId;
  label: string;
  icon: IconName;
  options?: string[];
  placeholder?: string;
  // Campos importantes contam para o "Completa o teu perfil".
  important?: boolean;
  // Secção do ecrã Perfil onde o campo aparece.
  group: 'faith' | 'about';
};

export const DENOMINATIONS = [
  'Católica',
  'Evangélica',
  'Batista',
  'Assembleia de Deus',
  'Presbiteriana',
  'Metodista',
  'Adventista',
  'Ortodoxa',
  'Outra',
];

export const INTENTIONS = ['Amizade', 'Namoro', 'Casamento'];

export const PROFILE_FIELDS: ProfileField[] = [
  {
    id: 'city',
    group: 'about',
    label: 'Cidade',
    icon: 'bx-home-alt',
    placeholder: 'Ex.: Lisboa',
    important: true,
  },
  {
    id: 'church',
    group: 'faith',
    label: 'Igreja',
    icon: 'bx-church',
    placeholder: 'Ex.: Igreja da Graça, Lisboa',
    important: true,
  },
  {
    id: 'denomination',
    group: 'faith',
    label: 'Denominação',
    icon: 'bx-book-bookmark',
    options: DENOMINATIONS,
    important: true,
  },
  {
    id: 'intention',
    group: 'faith',
    label: 'Intenção',
    icon: 'bx-heart',
    options: INTENTIONS,
    important: true,
  },
  {
    id: 'ministry',
    group: 'faith',
    label: 'Ministério',
    icon: 'bx-donate-heart',
    placeholder: 'Ex.: Louvor',
  },
  { id: 'height', group: 'about', label: 'Altura', icon: 'bx-ruler', placeholder: 'Ex.: 1,75 m' },
  {
    id: 'job',
    group: 'about',
    label: 'Emprego',
    icon: 'bx-briefcase',
    placeholder: 'Ex.: Enfermeira',
  },
  {
    id: 'education',
    group: 'about',
    label: 'Educação',
    icon: 'bx-book-reader',
    options: ['Secundário', 'Licenciatura', 'Mestrado', 'Doutoramento'],
  },
  {
    id: 'family',
    group: 'about',
    label: 'Planos de família',
    icon: 'bx-child',
    options: ['Quero ter filhos', 'Não quero ter filhos', 'Ainda não sei'],
  },
  {
    id: 'drinking',
    group: 'about',
    label: 'Estilo de vida',
    icon: 'bx-leaf',
    options: ['Não bebo', 'Bebo socialmente', 'Não fumo', 'Pratico desporto'],
  },
  {
    id: 'languages',
    group: 'about',
    label: 'Idiomas',
    icon: 'bx-world',
    options: ['Português', 'Inglês', 'Espanhol', 'Francês'],
  },
];
