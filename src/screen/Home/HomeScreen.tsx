import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import MainHeader from 'screen/common-comp/header/MainHeader';
import BaseWrapper from 'screen/common-comp/wrappers/BaseWrapper';
import styled from 'styled-components';
import PostCard from './components/PostCard';
import { QGetSubscribingPosts } from '../../__generated__/QGetSubscribingPosts';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import { GET_SUBSCRIBING_POSTS } from 'apllo-gqls/posts';
import WrapperInfinityScroll from 'screen/common-comp/wrappers/WrapperInfinityScroll';
import PostCardLoading from './components/PostCardLoading';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { theme } from 'assets/styles/theme';
import AddressSelector from './components/AddressSelector';
import { IPlaceSerchResult, IPlaceTerms } from 'types/GooglePlace';
import SubscribingsTemplate from './templates/SubscribingsTemplate';

const SectionWrapper = styled.div``;

const ADDRESS = 'ADDRESS';
const SUBSCRIBING = 'SUBSCRIBING';

const mockupAddress = [
  { offset: 0, value: '대한민국' },
  { offset: 5, value: '광주광역시' },
  { offset: 11, value: '광산구' },
  { offset: 15, value: '삼도동' },
  { offset: 19, value: '대산로' },
  { offset: 23, value: '눈보뛰' },
];

function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState<'ADDRESS' | 'SUBSCRIBING'>(SUBSCRIBING);
  const [searchAddressTerms, setSearchAddressTerms] = useState<IPlaceTerms | null | undefined>();

  useEffect(() => {
    console.log(searchAddressTerms);
  }, [searchAddressTerms]);

  const tabIconColor = (tabName: string) => {
    if (selectedTab === tabName) {
      return theme.color.blue.primaryBlue;
    }
    return theme.color.achromatic.darkGray;
  };

  return (
    <>
      <MainHeader />
      <BaseWrapper>
        <WrapperRow bc={'white'} w="100%" h="60px" jc="space-around">
          <FontAwesomeIcon
            icon={faMapLocationDot}
            color={tabIconColor(ADDRESS)}
            size="lg"
            onClick={() => setSelectedTab(ADDRESS)}
          />
          <FontAwesomeIcon
            icon={faUserGroup}
            color={tabIconColor(SUBSCRIBING)}
            size="lg"
            onClick={() => setSelectedTab(SUBSCRIBING)}
          />
        </WrapperRow>
        {selectedTab === ADDRESS && (
          <AddressSelector addressTerms={searchAddressTerms} setAddressTerms={setSearchAddressTerms} />
        )}
        {selectedTab === SUBSCRIBING && <SubscribingsTemplate />}
      </BaseWrapper>
    </>
  );
}

export default HomeScreen;
