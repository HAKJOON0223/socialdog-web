import React, { useEffect, useState } from 'react';
import { gql, useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CREATE_PRESIGNED_URL } from 'apllo-gqls/posts';
import { CHECK_USERNAME_EXIST, EDIT_PROFILE, MYPROFILE } from 'apllo-gqls/users';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import ButtonSubmit from 'screen/common-comp/button/ButtonSubmit';
import MainHeader from 'screen/common-comp/header/MainHeader';
import ImageRound from 'screen/common-comp/image/ImageRound';
import FormInput from 'screen/common-comp/input/FormInput';
import TextBase from 'screen/common-comp/texts/TextBase';
import BaseWrapper from 'screen/common-comp/wrappers/BaseWrapper';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import styled from 'styled-components';
import { EditProfileInputDto, FileType } from '__generated__/globalTypes';
import { MCreatePreSignedUrls, MCreatePreSignedUrlsVariables } from '__generated__/MCreatePreSignedUrls';
import { MEditProfile, MEditProfileVariables } from '__generated__/MEditProfile';
import { QMe } from '__generated__/QMe';
import FormInputButton from 'screen/common-comp/input/FormInputButton';
import { QCheckUsernameExist, QCheckUsernameExistVariables } from '__generated__/QCheckUsernameExist';
import ButtonSmallBlue from 'screen/common-comp/button/ButtonSmallBlue';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import ButtonUpload from 'screen/common-comp/button/ButtonUpload';
import { useNavigate } from 'react-router-dom';
import { routes } from 'screen/routes';
import Compressor from 'compressorjs';
import { removeAllTokens } from 'utils/local-storage';
import { loginState } from 'apollo-setup';
import useUserAgent from 'hooks/useUserAgent';
import ModalBackground from 'screen/common-comp/modal/ModalBackground';
import LoadingSpinner from 'assets/svg/LoadingSpinner';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  max-width: 500px;
  height: 100%;
  margin: 0 auto;
`;

function ProfileEditScreen() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { data: userData, loading: userDataLoading } = useQuery<QMe>(MYPROFILE);
  const user = userData?.me.data;
  // console.log(user);
  const [editProfile, { data, loading: editProfileLoading }] = useMutation<MEditProfile, MEditProfileVariables>(
    EDIT_PROFILE,
  );
  const [createPresignedUrl, { loading: createdPresignedUrlLoading }] = useMutation<
    MCreatePreSignedUrls,
    MCreatePreSignedUrlsVariables
  >(CREATE_PRESIGNED_URL);
  const [checkUsernameExist, { loading: checkUserNAmeExistLoading }] = useLazyQuery<
    QCheckUsernameExist,
    QCheckUsernameExistVariables
  >(CHECK_USERNAME_EXIST);
  const { register, handleSubmit, setValue, getValues, watch } = useForm<EditProfileInputDto>();
  const [profileOpenState, setProfileOpenState] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>();
  const [uploadedFileUrl, setUploadedFileUrl] = useState<null | string>();
  const userAgent = useUserAgent();

  const checkUsernameExsistHandler = async () => {
    const username = getValues('username');
    if (username) {
      const res = await checkUsernameExist({ variables: { args: { username } } });
      if (res.data?.checkUsernameExist.isExist) {
        window.alert('????????? ???????????????.');
      } else {
        window.alert('????????? ??? ?????? ???????????????.');
      }
    }
  };

  const compressImg = async (file: File) => {
    const compressedFile = new Promise((resolve, reject) => {
      (() =>
        new Compressor(file, {
          quality: 0.6,
          maxHeight: 1200,
          maxWidth: 1200,
          success: resolve,
          error: reject,
        }))();
    }).then((result: any) => {
      const file = new File([result], result.name, { lastModified: result.lastModified });
      return file;
    });
    return compressedFile;
  };

  const onSubmit = async (formData: EditProfileInputDto) => {
    let newPhoto: string | undefined = '';
    if (uploadedFile) {
      const resPresigned = await createPresignedUrl({
        variables: { args: { files: [{ filename: `userPhoto/${uploadedFile[0].name}`, fileType: FileType.IMAGE }] } },
      });
      if (!resPresigned.data?.createPreSignedUrls.ok) {
        window.alert('preSignedUrl?????? ??????');
        return;
      }
      const s3Res = await axios.put(resPresigned.data.createPreSignedUrls.urls[0], await compressImg(uploadedFile[0]));
      if (s3Res.status !== 200) {
        window.alert('s3 ????????? ??????');
        return;
      }
      newPhoto = s3Res?.config?.url && s3Res?.config?.url.split('?Content')[0];
    }

    const result = await editProfile({
      variables: {
        args: {
          photo: newPhoto || user?.photo,
          username: formData.username,
          profileOpen: profileOpenState,
        },
      },
    });
    if (!result.data?.editProfile.ok) {
      window.alert(result.data?.editProfile.error);
      return;
    }
    client.cache.writeFragment({
      id: `UserProfile:${user?.id}`,
      fragment: gql`
        fragment NewProfileAll on UserProfile {
          __typename
          id
          username
          photo
          profileOpen
        }
      `,
      data: {
        __typename: 'UserProfile',
        id: user?.id,
        username: formData.username || user?.username,
        photo: newPhoto || user?.photo,
        profileOpen: profileOpenState,
      },
    });
    window.alert('?????????????????????.');
    navigate(`${routes.home}${formData.username}`, { replace: true });
  };

  useEffect(() => {
    if (!uploadedFile) {
      setUploadedFileUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedFile[0]);
    setUploadedFileUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setProfileOpenState(user.profileOpen || false);
    }
  }, [user]);

  const logoutHandler = () => {
    removeAllTokens();
    navigate(routes.home);
    loginState(false);
  };

  return (
    <>
      <MainHeader />
      <BaseWrapper>
        {user && (
          <WrapperColumn jc={'space-around'}>
            <TextBase text={'????????? ??????'} m={'16px 0'} />
            <WrapperColumn>
              {uploadedFileUrl ? (
                <ImageRound url={uploadedFileUrl} size="80px" />
              ) : (
                <>
                  {user.photo ? (
                    <ImageRound url={user.photo} size="80px" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} size="5x" />
                  )}
                </>
              )}
              <ButtonUpload
                onChange={(e) => {
                  setUploadedFile(e.target.files);
                }}
                accept="image/*"
              />
            </WrapperColumn>
            <WrapperColumn p="20px 0px 0px 0px">
              {userAgent !== 'APP' && <ButtonSmallBlue title="????????????" onClick={logoutHandler} />}
            </WrapperColumn>
            <FormWrapper>
              <WrapperColumn w={'100%'} ai="flex-start">
                <TextBase text={'????????? ??????'} m={'16px 0'} />
                <FormInputButton
                  input={{ ph: '15??? ????????? ??????????????????', register: register('username'), maxLen: 15 }}
                  button={{
                    title: '????????????',
                    onClick: checkUsernameExsistHandler,
                    enable: user.username !== watch('username'),
                  }}
                />
              </WrapperColumn>
              <WrapperRow w={'100%'}>
                <TextBase
                  text={`????????? ?????? ?????? : ${profileOpenState ? '??????' : '????????? '}`}
                  m={'20px 10px 20px 0px'}
                />
                <ButtonSmallBlue title="??????" onClick={() => setProfileOpenState((prev) => !prev)} />
              </WrapperRow>
              <ButtonSubmit title="????????????" onClick={handleSubmit(onSubmit)} />
            </FormWrapper>
          </WrapperColumn>
        )}
      </BaseWrapper>
      {(editProfileLoading || createdPresignedUrlLoading || checkUserNAmeExistLoading) && (
        <ModalBackground closeModal={() => {}}>
          <LoadingSpinner />
        </ModalBackground>
      )}
    </>
  );
}

export default ProfileEditScreen;
