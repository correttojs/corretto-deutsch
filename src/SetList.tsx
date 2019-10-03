import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, {useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Download, Task, Trash, Music, List } from 'grommet-icons';
import { Table, Button, TableHeader, TableRow, TableCell, TableBody, TextInput, Box, Grid, Meter } from 'grommet';
import { Spinner } from './Spinner';
import { Alert } from './Alert';
const QUERY = gql`
  query Sets($feedId: ID!){
    sets(feedId: $feedId){
        title
        id
        audio
    }
  }
`;


const DELETE = gql`
    mutation delete($id: ID!){
        deleteSetAudio(id: $id){
        audio
        title
        id
    }
    }
`;

const DOWNLOAD = gql`
    mutation download($id: ID!){
        mergeSetAudio(id: $id){
        audio
        title
        id
    }
    }
`;

const SetFeed = ({feedId, getSets}: any) => {
    const inputRef =useRef<any>(null);
    return<Grid columns={['small', 'small']}> 

            <TextInput
                placeholder="type here"
                defaultValue={feedId || '107302659'}
                ref={inputRef}
                />
                
                <Button icon={<List />} label={'Get Sets'} onClick={() => {
                    if(inputRef.current && inputRef.current.value){
    
                        localStorage.setItem('feedId', inputRef.current.value)
                        getSets({variables: {feedId: inputRef.current && inputRef.current.value}} )
                    }
                }}/>
            </Grid>
}


 
export const SetList = () => {
    const history = useHistory()

    const [getSets, {data, loading, error, called}] = useLazyQuery(QUERY);
    const [download, {loading:downloadLoading, }] = useMutation(DOWNLOAD);
    const [deleteSet, { loading: deleteLoading, called: deleteCalled, data: deleteData }] = useMutation(DELETE);
    if(!called){
        const feedId = localStorage.getItem('feedId')
        if(!feedId){
            return <SetFeed getSets={getSets} feedId={feedId} />
        } else {
            getSets({variables: {feedId}} )
        }
        
    }
    
    if(!called || loading || downloadLoading){
        return <Spinner />
    }
    if(error){
        return <div><div>Error {JSON.stringify(error)}</div>
         <SetFeed getSets={getSets} />
         </div>
    }
    const props = {download: true}
    return (
        <div>
            <SetFeed getSets={getSets} />
            <Alert show={ deleteCalled && !deleteLoading && deleteData} message={ `${deleteData && deleteData.deleteSetAudio.title} deleted`}/>
            
<Box>
<Table>
  <TableHeader>
    <TableRow>
      <TableCell scope="col">
        Set
      </TableCell>
      <TableCell scope="col" >
        Delete/Create
      </TableCell>
      <TableCell scope="col" >
        Download
      </TableCell>
      <TableCell scope="col" >
        Details
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
  {
                data.sets.map((item: any, i: number) => (
                <TableRow key={i}>
                       <TableCell scope="row">{item.title}</TableCell>
                       <TableCell>
                 {item.audio &&     <Button icon={<Trash />} onClick={()=>deleteSet({variables: {id: item.id}})} />  }
                { !item.audio &&   <Button icon={<Music />} onClick={()=>download({variables: {id: item.id}})} /> }
              
                </TableCell>
                <TableCell>
                {
                item.audio &&  <Button icon={<Download />}  {...props} href={item.audio} /> 
            }
            </TableCell>
            <TableCell>
                   <Button icon={<Task />}   onClick={() => history.push(`/set/${item.id}`)}/>
                </TableCell>
                   </TableRow>
                ))
            }

              
   
  </TableBody>
</Table>
</Box>
           
        </div>
    )
}