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
  // Campos importantes mostram um ponto vermelho enquanto estão vazios.
  important?: boolean;
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
  { id: 'city', label: 'Cidade', icon: 'bx-home-alt', placeholder: 'Ex.: Lisboa', important: true },
  {
    id: 'church',
    label: 'Igreja',
    icon: 'bx-church',
    placeholder: 'Ex.: Igreja da Graça, Lisboa',
    important: true,
  },
  {
    id: 'denomination',
    label: 'Denominação',
    icon: 'bx-book-bookmark',
    options: DENOMINATIONS,
    important: true,
  },
  { id: 'intention', label: 'Intenção', icon: 'bx-heart', options: INTENTIONS, important: true },
  { id: 'ministry', label: 'Ministério', icon: 'bx-donate-heart', placeholder: 'Ex.: Louvor' },
  { id: 'height', label: 'Altura', icon: 'bx-ruler', placeholder: 'Ex.: 1,75 m' },
  { id: 'job', label: 'Emprego', icon: 'bx-briefcase', placeholder: 'Ex.: Enfermeira' },
  {
    id: 'education',
    label: 'Educação',
    icon: 'bx-book-reader',
    options: ['Secundário', 'Licenciatura', 'Mestrado', 'Doutoramento'],
  },
  {
    id: 'family',
    label: 'Planos de família',
    icon: 'bx-child',
    options: ['Quero ter filhos', 'Não quero ter filhos', 'Ainda não sei'],
  },
  {
    id: 'drinking',
    label: 'Estilo de vida',
    icon: 'bx-leaf',
    options: ['Não bebo', 'Bebo socialmente', 'Não fumo', 'Pratico desporto'],
  },
  {
    id: 'languages',
    label: 'Idiomas',
    icon: 'bx-world',
    options: ['Português', 'Inglês', 'Espanhol', 'Francês'],
  },
];
