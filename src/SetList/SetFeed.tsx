import React, { useRef } from 'react';
import { Button, TextInput, Box } from 'grommet';
import { List } from 'grommet-icons';
import { useSetsLazyQuery } from '../generated/graphql';

export const SetFeedId: React.FC<{
  feedId: string | null;
}> = ({ feedId }) => {
  const inputRef = useRef<any>(null);

  const [getSets, { data, loading, error, called }] = useSetsLazyQuery();
  return (
    <Box direction="row-responsive" alignContent="center">
      <Box width="small" alignContent="center">
        <TextInput placeholder="type here" defaultValue={feedId || '107302659'} ref={inputRef} />
      </Box>
      <Button
        margin="small"
        icon={<List />}
        label={'Get Sets'}
        onClick={() => {
          if (inputRef.current && inputRef.current.value) {
            localStorage.setItem('feedId', inputRef.current.value);
            getSets({ variables: { feedId: inputRef.current && inputRef.current.value } });
          }
        }}
      />
    </Box>
  );
};
