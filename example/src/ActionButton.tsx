import { Button } from 'react-native';

interface ActionButtonProps {
  readonly label: string;
  readonly title: string;
  readonly action: () => Promise<string>;
  readonly run: (label: string, action: () => Promise<string>) => Promise<void>;
}

export const ActionButton = ({ label, title, action, run }: ActionButtonProps) => {
  const onPress = () => {
    void run(label, action);
  };

  return <Button onPress={onPress} title={title} />;
};
