import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ADDRESS } from 'apllo-gqls/posts';
import React, { useEffect, useState } from 'react';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import WrapperInfinityScroll from 'screen/common-comp/wrappers/WrapperInfinityScroll';
import { IPlaceTerms } from 'types/GooglePlace';
import { QGetPostsByAddress, QGetPostsByAddressVariables } from '__generated__/QGetPostsByAddress';
import AddressSelector from '../components/AddressSelector';
import PostCard from '../components/PostCard';
import PostCardLoading from '../components/PostCardLoading';

function AddressPostsTemplate() {
  const pageItemCount = 6;
  const [postsLimit, setPostsLimit] = useState(pageItemCount);
  const [searchAddressTerms, setSearchAddressTerms] = useState<IPlaceTerms | null | undefined>();
  const address = searchAddressTerms?.map((term) => term.value).join(' ') || '대한민국';
  const {
    data: postDatas,
    loading: postsLoading,
    error: postsError,
    fetchMore,
  } = useQuery<QGetPostsByAddress, QGetPostsByAddressVariables>(GET_POSTS_BY_ADDRESS, {
    variables: {
      address,
      page: {
        offset: 0,
        limit: postsLimit,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const posts = postDatas?.getPostsByAddress.data;

  useEffect(() => {
    setPostsLimit(pageItemCount);
  }, [searchAddressTerms]);

  useEffect(() => {
    // console.log(posts?.length, pageLimit);
    if (posts && postsLimit > pageItemCount) {
      if (posts.length + pageItemCount === postsLimit) {
        console.log('fetched');
        fetchMore({
          variables: {
            page: {
              offset: posts.length,
              limit: pageItemCount,
            },
          },
        });
      }
    }
  }, [posts]);

  const getNextPage = () => {
    if (!postsError) {
      setPostsLimit((prev) => prev + pageItemCount);
    }
  };

  return (
    <WrapperColumn>
      <AddressSelector addressTerms={searchAddressTerms} setAddressTerms={setSearchAddressTerms} />
      <WrapperColumn p={'0 8px'} w={'100%'}>
        <WrapperInfinityScroll fetchHandler={getNextPage}>
          {posts?.map((post) => (
            <PostCard {...post} />
          ))}
          {postsLoading &&
            Array(pageItemCount)
              .fill('')
              .map(() => <PostCardLoading key={Math.random()} />)}
        </WrapperInfinityScroll>
      </WrapperColumn>
    </WrapperColumn>
  );
}

export default AddressPostsTemplate;