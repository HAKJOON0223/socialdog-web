import React from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FIND_USER_BY_USERNAME, GET_PROFILE_OPEN_USER } from 'apllo-gqls/users';
import { useForm } from 'react-hook-form';
import MainHeader from 'screen/common-comp/header/MainHeader';
import FormInput from 'screen/common-comp/input/FormInput';
import TextBase from 'screen/common-comp/texts/TextBase';
import UserCardThin from 'screen/common-comp/user-card/UserCardThin';
import BaseWrapper from 'screen/common-comp/wrappers/BaseWrapper';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import styled from 'styled-components';
import { FindUserByUsernameInputDto } from '__generated__/globalTypes';
import { QFindUserByUsername, QFindUserByUsernameVariables } from '__generated__/QFindUserByUsername';
import { QGetProfileOpenUser } from '__generated__/QGetProfileOpenUser';
import UserCardThinLoading from 'screen/common-comp/user-card/UserCardThinLoading';
import MainFooter from 'screen/common-comp/footer/MainFooter';

const FormWrapper = styled.div`
  width: 100%;
  height: 54px;
  padding: 10px;
  background-color: white;
  border-bottom: 2px solid ${({ theme }) => theme.color.achromatic.lightGray};
  display: flex;
  align-items: center;
`;

const SButton = styled.button`
  height: 100%;
  width: 50px;
  margin-left: 14px;
  cursor: pointer;
`;

function SearchScreen() {
  const [findUserByUsername, { data: findUserData, loading: findUserLoading }] = useLazyQuery<
    QFindUserByUsername,
    QFindUserByUsernameVariables
  >(FIND_USER_BY_USERNAME);
  const { data: profileOpenUsers, loading: profileOpenUserLoading } =
    useQuery<QGetProfileOpenUser>(GET_PROFILE_OPEN_USER);
  const { register, getValues } = useForm<FindUserByUsernameInputDto>();

  const onSearch = async () => {
    await findUserByUsername({ variables: { args: getValues() } });
  };

  return (
    <>
      <MainHeader />
      <BaseWrapper  p={''}>
        <WrapperRow w="100%" jc="center" h="30px">
          <TextBase text={'?????? ??????'} />
        </WrapperRow>
        <FormWrapper>
          <FormInput register={register('username')} ph={'???????????? ??????????????????'} />
          <SButton onClick={onSearch}>??????</SButton>
        </FormWrapper>
        <WrapperColumn p={'0 8px'} w="100%">
          {findUserLoading || profileOpenUserLoading ? (
            Array(5)
              .fill('')
              .map(() => <UserCardThinLoading key={Math.random()} />)
          ) : (
            <>
              {findUserData?.findUsersByUsername.data?.map((findResult) => (
                <UserCardThin key={findResult.id} {...findResult} />
              ))}
              {!findUserData?.findUsersByUsername.data && (
                <WrapperColumn w="100%" p={'10px 0'}>
                  <TextBase text={'???????????? ??????'} />
                  {profileOpenUsers?.getProfileOpenUser.data?.map((user) => (
                    <UserCardThin key={user.id} {...user} />
                  ))}
                </WrapperColumn>
              )}
            </>
          )}
        </WrapperColumn>
      </BaseWrapper>
      <MainFooter />
    </>
  );
}

export default SearchScreen;
