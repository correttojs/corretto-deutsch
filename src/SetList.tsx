import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, { useReducer, useRef } from 'react';
import { useHistory } from 'react-router-dom';

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
    const [getSets, {data, loading, error, called}] = useLazyQuery(QUERY);
    const [download, {loading:downloadLoading, data: downloadData }] = useMutation(DOWNLOAD);
    const [deleteSet, { data: deleteData }] = useMutation(DELETE);
    const inputRef =useRef<HTMLInputElement>(null);
    if(!called){
        return <div>

            <input type="text" ref={inputRef} defaultValue='107302659'/>
            <button type='button' onClick={() => {
                getSets({variables: {feedId: inputRef.current && inputRef.current.value}} )
            }}>Get sets</button>
        </div>
    }
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
                 {item.audio &&     <button onClick={()=>deleteSet({variables: {id: item.id}})}>Delete</button>  }
                {!item.audio &&  <button onClick={()=>download({variables: {id: item.id}})}>Create Audio</button>  }
                {item.audio && <a href={item.audio} download>Download</a> }
                    <button onClick={() => history.push(`/set/${item.id}`)}>Details</button></div>
                ))
            }
        </div>
    )
}