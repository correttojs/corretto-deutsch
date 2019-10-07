import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Download, Task, Trash, Music, InProgress } from 'grommet-icons';
import { Grid, Table, Button, TableHeader, TableRow, TableCell, TableBody, Box } from 'grommet';
import { Spinner } from '../Spinner';
import { Alert } from './Alert';
import { SetFeedId } from './SetFeed';
import { SaveOffline } from './SaveOffline';

const QUERY = gql`
  query Sets($feedId: ID!) {
    sets(feedId: $feedId) {
      title
      id
      audio
    }
  }
`;

const DELETE = gql`
  mutation delete($id: ID!) {
    deleteSetAudio(id: $id) {
      audio
      title
      id
    }
  }
`;

const DOWNLOAD = gql`
  mutation download($id: ID!) {
    mergeSetAudio(id: $id) {
      audio
      title
      id
    }
  }
`;

export const SetList = () => {
  const history = useHistory();

  const [getSets, { data, loading, error, called }] = useLazyQuery(QUERY);
  const [download, { loading: downloadLoading }] = useMutation(DOWNLOAD);
  const [
    deleteSet,
    { loading: deleteLoading, called: deleteCalled, data: deleteData },
  ] = useMutation(DELETE);
  if (!called) {
    const feedId = localStorage.getItem('feedId');
    if (!feedId) {
      return <SetFeedId getSets={getSets} feedId={feedId} />;
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
        <SetFeedId feedId={null} getSets={getSets} />
      </div>
    );
  }
  const props = { download: true };
  return (
    <div>
      <SaveOffline items={data.sets} />
      <SetFeedId feedId={null} getSets={getSets} />
      <Alert
        show={deleteCalled && !deleteLoading && deleteData}
        message={`${deleteData && deleteData.deleteSetAudio.title} deleted`}
      />
      <Box>
        <Grid columns={['medium', 'xsmall', 'xsmall', 'xsmall']} gap="small">
          {data.sets.map((item: any, i: number) => (
            <>
              <Box>
                {item.title}{' '}
                {item.audio && item.audio !== 'PROGRESS' && (
                  <audio controls>
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
                      caches.open('audio').then(cache => {
                        cache.delete(item.audio);
                      });
                    }}
                  />
                )}
                {!item.audio && (
                  <Button
                    icon={<Music />}
                    onClick={() => {
                      download({ variables: { id: item.id } }).then(data => {
                        // setTimeout(() => {
                        // }, 1000)
                        // caches.open('audio').then(cache => {
                        //   fetch(data.data.mergeSetAudio.audio).then(response => {
                        //     if (response !== null) {
                        //       cache.put(item.audio, response);
                        //     }
                        //   });
                        // });
                      });
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
            </>
          ))}
        </Grid>
      </Box>
    </div>
  );
};
