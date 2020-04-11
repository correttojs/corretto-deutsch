import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
   __typename?: 'Mutation';
  mergeSetAudio?: Maybe<Set>;
  deleteSetAudio?: Maybe<Set>;
};


export type MutationMergeSetAudioArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSetAudioArgs = {
  id: Scalars['ID'];
};

export type Query = {
   __typename?: 'Query';
  sets: Array<Set>;
  set: Set;
};


export type QuerySetsArgs = {
  feedId: Scalars['ID'];
};


export type QuerySetArgs = {
  id: Scalars['ID'];
};

export type Set = {
   __typename?: 'Set';
  id: Scalars['ID'];
  title: Scalars['String'];
  terms?: Maybe<Array<Maybe<Term>>>;
  audio?: Maybe<Scalars['String']>;
};

export type Term = {
   __typename?: 'Term';
  id: Scalars['ID'];
  word: Scalars['String'];
  translation: Scalars['String'];
  wordAudio: Scalars['String'];
  translationAudio: Scalars['String'];
};

export type SetQueryVariables = {
  id: Scalars['ID'];
};


export type SetQuery = (
  { __typename?: 'Query' }
  & { set: (
    { __typename?: 'Set' }
    & Pick<Set, 'title' | 'id' | 'audio'>
    & { terms?: Maybe<Array<Maybe<(
      { __typename?: 'Term' }
      & Pick<Term, 'word' | 'translation'>
    )>>> }
  ) }
);

export type SetsQueryVariables = {
  feedId: Scalars['ID'];
};


export type SetsQuery = (
  { __typename?: 'Query' }
  & { sets: Array<(
    { __typename?: 'Set' }
    & Pick<Set, 'title' | 'id' | 'audio'>
  )> }
);

export type DeleteMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteMutation = (
  { __typename?: 'Mutation' }
  & { deleteSetAudio?: Maybe<(
    { __typename?: 'Set' }
    & Pick<Set, 'audio' | 'title' | 'id'>
  )> }
);

export type DownloadMutationVariables = {
  id: Scalars['ID'];
};


export type DownloadMutation = (
  { __typename?: 'Mutation' }
  & { mergeSetAudio?: Maybe<(
    { __typename?: 'Set' }
    & Pick<Set, 'audio' | 'title' | 'id'>
  )> }
);


export const SetDocument = gql`
    query Set($id: ID!) {
  set(id: $id) {
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

/**
 * __useSetQuery__
 *
 * To run a query within a React component, call `useSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SetQuery, SetQueryVariables>) {
        return ApolloReactHooks.useQuery<SetQuery, SetQueryVariables>(SetDocument, baseOptions);
      }
export function useSetLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SetQuery, SetQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SetQuery, SetQueryVariables>(SetDocument, baseOptions);
        }
export type SetQueryHookResult = ReturnType<typeof useSetQuery>;
export type SetLazyQueryHookResult = ReturnType<typeof useSetLazyQuery>;
export type SetQueryResult = ApolloReactCommon.QueryResult<SetQuery, SetQueryVariables>;
export const SetsDocument = gql`
    query Sets($feedId: ID!) {
  sets(feedId: $feedId) {
    title
    id
    audio
  }
}
    `;

/**
 * __useSetsQuery__
 *
 * To run a query within a React component, call `useSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSetsQuery({
 *   variables: {
 *      feedId: // value for 'feedId'
 *   },
 * });
 */
export function useSetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SetsQuery, SetsQueryVariables>) {
        return ApolloReactHooks.useQuery<SetsQuery, SetsQueryVariables>(SetsDocument, baseOptions);
      }
export function useSetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SetsQuery, SetsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SetsQuery, SetsQueryVariables>(SetsDocument, baseOptions);
        }
export type SetsQueryHookResult = ReturnType<typeof useSetsQuery>;
export type SetsLazyQueryHookResult = ReturnType<typeof useSetsLazyQuery>;
export type SetsQueryResult = ApolloReactCommon.QueryResult<SetsQuery, SetsQueryVariables>;
export const DeleteDocument = gql`
    mutation delete($id: ID!) {
  deleteSetAudio(id: $id) {
    audio
    title
    id
  }
}
    `;
export type DeleteMutationFn = ApolloReactCommon.MutationFunction<DeleteMutation, DeleteMutationVariables>;

/**
 * __useDeleteMutation__
 *
 * To run a mutation, you first call `useDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMutation, { data, loading, error }] = useDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMutation, DeleteMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteMutation, DeleteMutationVariables>(DeleteDocument, baseOptions);
      }
export type DeleteMutationHookResult = ReturnType<typeof useDeleteMutation>;
export type DeleteMutationResult = ApolloReactCommon.MutationResult<DeleteMutation>;
export type DeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMutation, DeleteMutationVariables>;
export const DownloadDocument = gql`
    mutation download($id: ID!) {
  mergeSetAudio(id: $id) {
    audio
    title
    id
  }
}
    `;
export type DownloadMutationFn = ApolloReactCommon.MutationFunction<DownloadMutation, DownloadMutationVariables>;

/**
 * __useDownloadMutation__
 *
 * To run a mutation, you first call `useDownloadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDownloadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [downloadMutation, { data, loading, error }] = useDownloadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDownloadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DownloadMutation, DownloadMutationVariables>) {
        return ApolloReactHooks.useMutation<DownloadMutation, DownloadMutationVariables>(DownloadDocument, baseOptions);
      }
export type DownloadMutationHookResult = ReturnType<typeof useDownloadMutation>;
export type DownloadMutationResult = ApolloReactCommon.MutationResult<DownloadMutation>;
export type DownloadMutationOptions = ApolloReactCommon.BaseMutationOptions<DownloadMutation, DownloadMutationVariables>;