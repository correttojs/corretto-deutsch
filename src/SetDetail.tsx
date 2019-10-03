import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


const QUERY = gql`
  query Set($id: ID!) {
    set(id: $id){
        title
        id
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
        return null
    }
    if(error){
        return null
    }
    return <div>
        Details of {data.set.title} {id} <button onClick={() => history.goBack()}>Back</button>
        <div>
            {
                data.set.terms.map((t: any) => (
                    <div>{t.word} => {t.translation}</div>
                ))
            }
        </div>
    </div>
}