import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import { useHistory } from 'react-router-dom';

const QUERY = gql`
  {
    sets{
        title
        id
    }
  }
`;


const DELETE = gql`
    mutation delete($id: ID!){
        deleteSetAudio(id: $id){
        audio
        title
    }
    }
`;

const DOWNLOAD = gql`
    mutation download($id: ID!){
        mergeSetAudio(id: $id){
        audio
        title
    }
    }
`;

export const SetList = () => {
    const history = useHistory()
    const {data, loading, error} = useQuery(QUERY);
    const [download, {loading:downloadLoading, data: downloadData }] = useMutation(DOWNLOAD);
    const [deleteSet, { data: deleteData }] = useMutation(DELETE);
    if(loading || downloadLoading){
        return <div>Loading</div>
    }
    if(error){
        return <div>Error {JSON.stringify(error)}</div>
    }
    return (
        <div>
            {
              downloadData &&  <a href={downloadData.mergeSetAudio.audio} download>Click to download {downloadData.mergeSetAudio.title}</a> 
            }
             {
              deleteData &&  <div> {deleteData.deleteSetAudio.title} deleted</div>
            }
            {
                data.sets.map((item: any, i: number) => (
                    <div key={i}>{item.title}
                    <button onClick={()=>deleteSet({variables: {id: item.id}})}>Delete</button>  
                    <button onClick={()=>download({variables: {id: item.id}})}>Download</button>  
                    <button onClick={() => history.push(`/set/${item.id}`)}>Details</button></div>
                ))
            }
        </div>
    )
}