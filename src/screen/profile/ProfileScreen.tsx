import React, { Fragment, useState, useEffect } from 'react';
import MainHeader from 'screen/common-comp/header/MainHeader';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, MYPROFILE } from 'apllo-gqls/users';
import TextBase from 'screen/common-comp/texts/TextBase';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import BaseWrapper from 'screen/common-comp/wrappers/BaseWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { QGetUserProfile, QGetUserProfileVariables } from '__generated__/QGetUserProfile';
import { QMe } from '__generated__/QMe';
import { BlockState } from '__generated__/globalTypes';
import { faIdBadge } from '@fortawesome/free-regular-svg-icons';
import { theme } from 'assets/styles/theme';
import MyPosts from './templates/MyPosts';
import MyLikedPosts from './templates/MyLikedPosts';
import UserProfileTemplate from './templates/UserProfileTemplate';
import UserProfileLoading from './templates/UserProfileLoading';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import WrapperButton from 'screen/common-comp/wrappers/WrapperButton';
import MainFooter from 'screen/common-comp/footer/MainFooter';

export type Params = {
  username: string;
};

type PostType = 'MY' | 'LIKED';

function ProfileScreen() {
  const [postsType, setPostType] = useState<PostType>('MY');
  const { username } = useParams<Params>();
  if (!username) {
    return <></>;
  }
  const { data: authUserData } = useQuery<QMe>(MYPROFILE);
  const authUser = authUserData?.me.data;

  const { data: userData, loading: userDataLoading } = useQuery<QGetUserProfile, QGetUserProfileVariables>(
    GET_USER_PROFILE,
    {
      variables: { args: { username } },
    },
  );
  const user = userData?.getUserProfile.data;
  const userProfileState = userData?.getUserProfile;
  // console.log('user', user, userProfileState);

  const isMyProfile = () => {
    return authUser?.id === user?.id;
  };

  const isBlokingPerson = () => {
    return userProfileState?.blocking === BlockState.BLOCKING;
  };

  const isProfileOpened = () => {
    if (username === authUser?.username) {
      return true;
    }
    // ???????????? open??? false?????????, ????????????????????? null????????? ?????????. ????????? bool????????? bool?????????, null??? true
    return typeof userProfileState?.profileOpened === 'boolean' ? userProfileState?.profileOpened : true;
  };

  const isSelectedPostType = (type: PostType) => {
    return type === postsType;
  };

  // Todo.
  // ????????? ????????? ???????????? ?????? ?????? ???????????? ?????????
  // ????????? ?????? ?????? ?????????.(????????? UseEffect?????? ?????? ????????? ??????)
  useEffect(() => {
    setPostType('MY');
  }, [username]);

  return (
    <Fragment key={`${username}`}>
      <MainHeader />
      <BaseWrapper p="">
        {!userDataLoading && userData ? <UserProfileTemplate userData={userData} /> : <UserProfileLoading />}
        {isMyProfile() && (
          <WrapperRow h="60px" w="100%" jc="space-around" bc={'white'}>
            <WrapperButton onClick={() => setPostType('MY')}>
              <FontAwesomeIcon
                icon={faIdBadge}
                size="2x"
                color={isSelectedPostType('MY') ? theme.color.blue.primaryBlue : theme.color.achromatic.darkGray}
              />
            </WrapperButton>
            <WrapperButton onClick={() => setPostType('LIKED')}>
              <FontAwesomeIcon
                icon={faPaw}
                size="2x"
                color={isSelectedPostType('LIKED') ? theme.color.blue.primaryBlue : theme.color.achromatic.darkGray}
              />
            </WrapperButton>
          </WrapperRow>
        )}
        {isBlokingPerson() ? (
          <TextBase text={'????????? ???????????????'} />
        ) : (
          <>
            {isProfileOpened() ? (
              <>
                {isSelectedPostType('MY') && <MyPosts username={username} itemsCount={12} />}
                {isSelectedPostType('LIKED') && <MyLikedPosts itemsCount={12} />}
              </>
            ) : (
              <WrapperColumn p="50px 0" h="200px" jc={'space-between'}>
                <FontAwesomeIcon color={theme.color.achromatic.darkGray} size="4x" icon={faUserLock} />
                <TextBase color={theme.color.achromatic.darkGray} text={'????????? ???????????????.'} />
              </WrapperColumn>
            )}
          </>
        )}
      </BaseWrapper>
      <MainFooter />
    </Fragment>
  );
}

export default ProfileScreen;
