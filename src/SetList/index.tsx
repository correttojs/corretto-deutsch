import React from 'react';
import { useHistory } from 'react-router-dom';
import { Download, Task, Trash, Music, InProgress } from 'grommet-icons';
import { Grid, Button, Box } from 'grommet';
import { Spinner } from '../Spinner';
import { Alert } from './Alert';
import { SetFeedId } from './SetFeed';
import { useSetsLazyQuery, useDeleteMutation, useDownloadMutation } from '../generated/graphql';

export const SetList = () => {
  const history = useHistory();

  const [getSets, { data, loading, error, called }] = useSetsLazyQuery();
  const [download, { loading: downloadLoading }] = useDownloadMutation();
  const [
    deleteSet,
    { loading: deleteLoading, called: deleteCalled, data: deleteData },
  ] = useDeleteMutation();
  if (!called) {
    const feedId = localStorage.getItem('feedId');
    if (!feedId) {
      return <SetFeedId feedId={feedId} />;
    } else {
      getSets({ variables: { feedId } });
    }
  }

  if (!called || loading || downloadLoading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div>
        <div>Error {JSON.stringify(error)}</div>
        <SetFeedId feedId={null} />
      </div>
    );
  }
  if (!data) {
    return null;
  }
  const props = { download: true };
  return (
    <div>
      <SetFeedId feedId={null} />
      <Alert
        show={deleteCalled && !deleteLoading && !!deleteData}
        message={`${deleteData && deleteData?.deleteSetAudio?.title} deleted`}
      />
      <Box>
        <Grid columns={['flex', '30px', '30px', '30px']}>
          {data?.sets?.map((item, k) => (
            <React.Fragment key={k}>
              <Box>
                {item.title}{' '}
                {item.audio && item.audio !== 'PROGRESS' && (
                  <audio controls style={{ width: '100%' }}>
                    <source src={item.audio} type="audio/mpeg" />
                  </audio>
                )}
              </Box>
              <Box>
                {item.audio && (
                  <Button
                    icon={<Trash />}
                    onClick={() => {
                      deleteSet({ variables: { id: item.id } });
                    }}
                  />
                )}
                {!item.audio && (
                  <Button
                    icon={<Music />}
                    onClick={() => {
                      download({ variables: { id: item.id } });
                    }}
                  />
                )}
              </Box>
              <Box>
                {item.audio && item.audio !== 'PROGRESS' && (
                  <Button icon={<Download />} {...props} href={item.audio} />
                )}
                {item.audio === 'PROGRESS' && <Button icon={<InProgress />} />}
              </Box>
              <Box>
                <Button icon={<Task />} onClick={() => history.push(`/set/${item.id}`)} />
              </Box>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </div>
  );
};
