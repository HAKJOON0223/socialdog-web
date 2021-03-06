import { gql, makeReference, useApolloClient, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import { GET_SUBSCRIBING_POSTS } from 'apllo-gqls/posts';
import { QGetSubscribingPosts } from '__generated__/QGetSubscribingPosts';
import PostCard from '../components/PostCard';
import PostCardLoading from '../components/PostCardLoading';
import NoContents from 'screen/common-comp/no-contents/NoContents';
import WrapperInfinityQueryScroll from 'screen/common-comp/wrappers/WrapperInfinityQueryScroll';
import RefreshButton from '../components/RefreshButton';

function SubscribingsTemplate() {
  const pageItemCount = 6;
  const [itemLimit, setItemLimit] = useState(pageItemCount);
  const [isLastPage, setIsLastPage] = useState(false);
  const client = useApolloClient();
  const getSubscribingPosts = useQuery<QGetSubscribingPosts>(GET_SUBSCRIBING_POSTS, {
    variables: {
      page: {
        take: itemLimit,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
    onError: (e) => console.log(e),
  });

  const posts = getSubscribingPosts.data?.getSubscribingPosts.data;

  const removeSubscribingPosts = () => {
    client.cache.modify({
      id: client.cache.identify(makeReference('ROOT_QUERY')),
      fields: {
        getSubscribingPosts() {
          return undefined;
        },
      },
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
    setIsLastPage(false);
  };

  return (
    <WrapperColumn p={'0 8px'}>
      <RefreshButton onClick={removeSubscribingPosts} />
      <WrapperInfinityQueryScroll
        query={getSubscribingPosts}
        pageItemCount={pageItemCount}
        setItemLimit={setItemLimit}
        itemLimit={itemLimit}
        isLastPage={isLastPage}
        setIsLastPage={setIsLastPage}
      >
        {posts?.map((post, idx) => (
          <PostCard key={post.id} {...post} />
        ))}
        {getSubscribingPosts.loading &&
          Array(pageItemCount)
            .fill('')
            .map(() => <PostCardLoading key={Math.random()} />)}
      </WrapperInfinityQueryScroll>
      {!getSubscribingPosts.loading && !posts?.length && (
        <NoContents text={`?????? ???????????? ????????? ?????????, \n ????????? ???????????? ?????????.`} />
      )}
    </WrapperColumn>
  );
}

export default SubscribingsTemplate;
