import { Placeholder, Screen } from '@/components';

export default function MatchesScreen() {
  return (
    <Screen edges={['top']}>
      <Placeholder
        title="Matches"
        description="As pessoas com quem deste match vão aparecer aqui."
      />
    </Screen>
  );
}
