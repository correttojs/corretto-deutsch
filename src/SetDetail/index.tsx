import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Heading, Button, Table, TableHeader, TableRow, TableCell, TableBody, Box } from 'grommet';
import { Previous, Download, InProgress } from 'grommet-icons';
import { Spinner } from '../Spinner';
import { useSetQuery } from '../generated/graphql';

export const SetDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const { data, loading, error } = useSetQuery({ variables: { id: id ?? '' } });
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return null;
  }
  if (!data) {
    return null;
  }
  const props = { download: true };
  return (
    <div>
      <Box direction="row-responsive">
        {' '}
        <Heading margin="none">Details of {data.set.title} </Heading>
        <Button icon={<Previous />} onClick={() => history.goBack()} />
      </Box>

      <div>
        {data.set.audio && data.set.audio !== 'PROGRESS' && (
          <Button icon={<Download />} {...props} href={data.set.audio} />
        )}
        {data.set.audio === 'PROGRESS' && <Button icon={<InProgress />} />}
        {data.set.audio && data.set.audio !== 'PROGRESS' && (
          <audio controls>
            <source src={data.set.audio} type="audio/mpeg" />
          </audio>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col">Word</TableCell>
              <TableCell scope="col">Translation</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.set?.terms?.map((t: any, key: number) => (
              <TableRow key={key}>
                <TableCell scope="row">{t.word}</TableCell>
                <TableCell>{t.translation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
