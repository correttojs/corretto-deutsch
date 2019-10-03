import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Heading, Button, Table, TableHeader, TableRow, TableCell, TableBody, Grid, Box } from 'grommet';
import { Previous, Download } from 'grommet-icons';
import { Spinner } from './Spinner';

const QUERY = gql`
  query Set($id: ID!) {
    set(id: $id){
        title
        id
        audio
        terms {
            word
            translation
        }
    }
  }
`;


export const SetDetail = () => {
    const history = useHistory()
    const {id} = useParams()
    const {data, loading, error} = useQuery(QUERY, {variables: { id },});
    if(loading){
        return <Spinner/>
    }
    if(error){
        return null
    }
    const props = {download:true}
    return <div>
       <Box direction='row-responsive' >  <Heading margin="none">Details of {data.set.title} </Heading> 
       <Button icon={<Previous />}  onClick={() => history.goBack()} />
       </Box>
      
        <div>
        {  data.set.audio &&  
        <Button icon={<Download />} {...props} href={data.set.audio} /> }

            <Table>
  <TableHeader>
    <TableRow>
      <TableCell scope="col">
        Word
      </TableCell>
      <TableCell scope="col" >
        Translation
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
  {
                data.set.terms.map((t: any) => (
                    <TableRow>
                        <TableCell scope="row">{t.word}</TableCell>
                        <TableCell >{t.translation}</TableCell>
                    </TableRow>
                ))
            }
   
  </TableBody>
</Table>
        </div>
    </div>
}