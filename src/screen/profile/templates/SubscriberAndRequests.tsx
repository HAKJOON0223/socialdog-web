import React, { useState } from 'react';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import styled from 'styled-components';
import TextBase from 'screen/common-comp/texts/TextBase';
import ModalRound from 'screen/common-comp/modal/ModalRound';
import { makeReference, useApolloClient, useMutation, useQuery } from '@apollo/client';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import UserCardThin from 'screen/common-comp/user-card/UserCardThin';
import { GET_MY_SUBSCRIBERS_REQUESTS, RESPONSE_SUBSCRIBE } from 'apllo-gqls/subscribes';
import {
  QGetMySubscribersRequests,
  QGetMySubscribersRequests_getMySubscribers,
  QGetMySubscribersRequests_getSubscribeRequests,
} from '__generated__/QGetMySubscribersRequests';
import { MResponseSubscribe, MResponseSubscribeVariables } from '__generated__/MResponseSubscribe';
import { SubscribeRequestState } from '__generated__/globalTypes';
import ButtonSmallBlue from 'screen/common-comp/button/ButtonSmallBlue';
import ButtonSmallWhite from 'screen/common-comp/button/ButtonSmallWhite';
import { QMe } from '__generated__/QMe';
import { MYPROFILE } from 'apllo-gqls/users';
import useEvictCache from 'hooks/useEvictCache';
import UserCardThinLoading from 'screen/common-comp/user-card/UserCardThinLoading';

interface ITabBox {
  selected: boolean;
}

const TabBox = styled.div<ITabBox>`
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.selected ? p.theme.color.blue.primaryBlue : p.theme.color.achromatic.lightGray)};
`;

interface ISubscriberAndRequests {
  closeModal: () => void;
}

function SubscriberAndRequests({ closeModal }: ISubscriberAndRequests) {
  const { cache } = useApolloClient();
  const evitCache = useEvictCache();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { data: mySubscriberRequests, loading: mySubscriberRequestsLoading } =
    useQuery<QGetMySubscribersRequests>(GET_MY_SUBSCRIBERS_REQUESTS);
  const [responseSubscribe] = useMutation<MResponseSubscribe, MResponseSubscribeVariables>(RESPONSE_SUBSCRIBE);
  const subscribers = mySubscriberRequests?.getMySubscribers.data;
  const subscribeRequests = mySubscriberRequests?.getSubscribeRequests.data;
  const { data: authUserData } = useQuery<QMe>(MYPROFILE);
  const authUser = authUserData?.me.data;

  const onResponseSubscribe = async (fromUserId: string, subscribeRequest: SubscribeRequestState) => {
    const res = await responseSubscribe({ variables: { args: { from: fromUserId, subscribeRequest } } });
    console.log(res);
    if (!res.data?.responseSubscribe.ok) {
      window.alert(res.data?.responseSubscribe.error);
      return;
    }
    if (subscribeRequest === SubscribeRequestState.CONFIRMED) {
      cacheSubscribeConfirm(fromUserId);
    }
    if (subscribeRequest === SubscribeRequestState.REJECTED) {
      cacheSubscribeReject(fromUserId);
    }
    if (subscribeRequest === SubscribeRequestState.REQUESTED) {
      cacheSubscribePostPone(fromUserId);
    }
  };

  const cacheSubscribeConfirm = (fromUserId: string) => {
    const identifiedId = cache.identify({ id: fromUserId, __typename: 'UserProfile' });
    // console.log(identifiedId);
    cache.modify({
      id: cache.identify(makeReference('ROOT_QUERY')),
      fields: {
        getMySubscribers(existing: QGetMySubscribersRequests_getMySubscribers) {
          return { ...existing, data: [{ __ref: identifiedId }, ...existing.data] };
        },
        getSubscribeRequests(existing: QGetMySubscribersRequests_getSubscribeRequests) {
          return { ...existing, data: existing.data.filter((data: any) => data.__ref !== identifiedId) };
        },
      },
    });
    if (authUser) {
      evitCache(authUser?.id, 'UserProfile');
    }
  };

  const cacheSubscribeReject = (fromUserId: string) => {
    const identifiedId = cache.identify({ id: fromUserId, __typename: 'UserProfile' });
    // console.log(identifiedId);
    cache.modify({
      id: cache.identify(makeReference('ROOT_QUERY')),
      fields: {
        getSubscribeRequests(existing: { data: [{ __ref: string }] }) {
          return { ...existing, data: existing.data.filter((data: any) => data.__ref !== identifiedId) };
        },
        getMyRejectRequests(existing: { data: [{ __ref: string }] }) {
          if (!existing) {
            return undefined;
          }
          return { ...existing, data: [{ __ref: identifiedId }, ...existing.data] };
        },
      },
    });
    if (authUser) {
      evitCache(authUser?.id, 'UserProfile');
    }
  };

  const cacheSubscribePostPone = (fromUserId: string) => {
    const identifiedId = cache.identify({ id: fromUserId, __typename: 'UserProfile' });
    // console.log(identifiedId);
    cache.modify({
      id: cache.identify(makeReference('ROOT_QUERY')),
      fields: {
        getMySubscribers(existing: QGetMySubscribersRequests_getMySubscribers) {
          return { ...existing, data: existing.data.filter((data: any) => data.__ref !== identifiedId) };
        },
        getSubscribeRequests(existing: QGetMySubscribersRequests_getSubscribeRequests) {
          return { ...existing, data: [{ __ref: identifiedId }, ...existing.data] };
        },
      },
    });
  };

  return (
    <ModalRound closeModal={closeModal} title="????????? ??? ??????">
      <WrapperRow jc="space-around">
        <TabBox selected={selectedTab === 0} onClick={() => setSelectedTab(0)}>
          <TextBase text={'?????????'} />
        </TabBox>
        <TabBox selected={selectedTab === 1} onClick={() => setSelectedTab(1)}>
          <TextBase text={'?????? ??????'} />
        </TabBox>
      </WrapperRow>
      <WrapperColumn>
        <>
          {selectedTab === 0 && (
            <>
              {subscribers?.map((subscriber) => (
                <WrapperRow key={subscriber.id} w="100%" p={'0px 12px'}>
                  <UserCardThin onClick={closeModal} {...subscriber} />
                  <ButtonSmallBlue
                    title="??????"
                    onClick={() => onResponseSubscribe(subscriber.id, SubscribeRequestState.REQUESTED)}
                  />
                </WrapperRow>
              ))}
            </>
          )}
          {selectedTab === 1 && (
            <>
              {subscribeRequests?.map((user) => (
                <WrapperRow key={user.id} w="100%" p={'0px 12px'}>
                  <UserCardThin onClick={closeModal} {...user} />
                  <ButtonSmallBlue
                    title="??????"
                    onClick={() => onResponseSubscribe(user.id, SubscribeRequestState.CONFIRMED)}
                  />

                  <ButtonSmallWhite
                    title="??????"
                    onClick={() => onResponseSubscribe(user.id, SubscribeRequestState.REJECTED)}
                  />
                </WrapperRow>
              ))}
            </>
          )}
          {mySubscriberRequestsLoading && (
            <>
              {Array(6)
                .fill('')
                .map((_) => (
                  <WrapperRow key={Math.random()} w={'100%'} p={'0px 12px'}>
                    <UserCardThinLoading />
                  </WrapperRow>
                ))}
            </>
          )}
        </>
      </WrapperColumn>
    </ModalRound>
  );
}

export default SubscriberAndRequests;
