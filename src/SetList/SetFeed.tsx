import React, { useRef } from 'react';
import { Grid, Button, TextInput } from 'grommet';
import { List } from 'grommet-icons';
import { QueryLazyOptions } from '@apollo/react-hooks';

export const SetFeedId: React.FC<{
  feedId: string | null;
  getSets: (options?: QueryLazyOptions<Record<string, any>> | undefined) => void;
}> = ({ feedId, getSets }) => {
  const inputRef = useRef<any>(null);
  return (
    <Grid columns={['small', 'small']}>
      <TextInput placeholder="type here" defaultValue={feedId || '107302659'} ref={inputRef} />

      <Button
        icon={<List />}
        label={'Get Sets'}
        onClick={() => {
          if (inputRef.current && inputRef.current.value) {
            localStorage.setItem('feedId', inputRef.current.value);
            getSets({ variables: { feedId: inputRef.current && inputRef.current.value } });
          }
        }}
      />
    </Grid>
  );
};
