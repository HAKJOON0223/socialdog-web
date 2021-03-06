import { gql, makeReference, useApolloClient, useMutation } from '@apollo/client';
import { TOGGLE_LIKE_POST } from 'apllo-gqls/posts';
import React from 'react'
import { MToggleLikePost, MToggleLikePostVariables } from '__generated__/MToggleLikePost';

interface IToggleLikeHandler {
  id: string
  __typename: string
  liked:boolean
  likes:number
}

function useToggleLike (){
  const {cache} = useApolloClient();
  const [toggleLike] = useMutation<MToggleLikePost, MToggleLikePostVariables>(TOGGLE_LIKE_POST);
  const toggleLikeHandler = async ({id, __typename, liked, likes}:IToggleLikeHandler) => {
    const res = await toggleLike({
      variables: { args: { postId:id } },
    });
    if (!res.data?.toggleLikePost.ok) {
      window.alert(res.data?.toggleLikePost.error);
      return;
    }
    // 좋아요 버튼 토글
    if(liked === true){
        cache.writeFragment({
          id: cache.identify({ id, __typename }),
          fragment: gql`
          fragment post on Posts{
            liked
            likes
          }
        `,
        data: {
          liked: false,
          likes: likes - 1,
        },
      });
    }
    else if(liked === false){
      cache.writeFragment({
        id: cache.identify({ id, __typename }),
        fragment: gql`
        fragment post on Posts{
          liked
          likes
        }
      `,
      data: {
        liked: true,
        likes: likes + 1,
      },
    });
  }
    // 좋아요 누르면, getMyLikedPosts에 추가 및 삭제
    cache.modify({
      id: cache.identify(makeReference('ROOT_QUERY')),
      fields: {
        getMyLikedPosts(existing) {
          return {
            ...existing,
            data: liked
              ? existing.data.filter(
                  (post: { __ref: string }) => post.__ref !== cache.identify({ id, __typename }),
                )
              : [{ __ref: cache.identify({ id, __typename }) }, ...existing.data],
          };
        },
      },
    });
  };
  return toggleLikeHandler
}

export default useToggleLike