import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Download, Task, Trash, Music } from 'grommet-icons';
import { Table, Button, TableHeader, TableRow, TableCell, TableBody, Box } from 'grommet';
import { Spinner } from '../Spinner';
import { Alert } from './Alert';
import { SetFeedId } from './SetFeed';

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
      <SetFeedId feedId={null} getSets={getSets} />
      <Alert
        show={deleteCalled && !deleteLoading && deleteData}
        message={`${deleteData && deleteData.deleteSetAudio.title} deleted`}
      />
      <Box>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col">Set</TableCell>
              <TableCell scope="col">Delete/Create</TableCell>
              <TableCell scope="col">Download</TableCell>
              <TableCell scope="col">Details</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sets.map((item: any, i: number) => (
              <TableRow key={i}>
                <TableCell scope="row">{item.title}</TableCell>
                <TableCell>
                  {item.audio && (
                    <Button
                      icon={<Trash />}
                      onClick={() => deleteSet({ variables: { id: item.id } })}
                    />
                  )}
                  {!item.audio && (
                    <Button
                      icon={<Music />}
                      onClick={() => download({ variables: { id: item.id } })}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {item.audio && <Button icon={<Download />} {...props} href={item.audio} />}
                </TableCell>
                <TableCell>
                  <Button icon={<Task />} onClick={() => history.push(`/set/${item.id}`)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
};
