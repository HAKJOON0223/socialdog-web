import { gql, useApolloClient, useMutation } from '@apollo/client';
import { EDIT_POST } from 'apllo-gqls/posts';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ButtonSubmit from 'screen/common-comp/button/ButtonSubmit';
import FormTextArea from 'screen/common-comp/input/FormTextArea';
import PlaceSearch from 'screen/common-comp/place-search/PlaceSearch';
import TextBase from 'screen/common-comp/texts/TextBase';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import { routes } from 'screen/routes';
import { alretError } from 'utils/alret';
import { EditPostInputDto } from '__generated__/globalTypes';
import { MEditPost, MEditPostVariables } from '__generated__/MEditPost';
import { QGetSubscribingPosts_getSubscribingPosts_data } from '__generated__/QGetSubscribingPosts';
import UploadImgViewer from '../components/UploadImgViewer';
import { IPostWriteTemplate } from '../PostWriteScreen';

interface IPostEditTemplate extends IPostWriteTemplate {
  postData: QGetSubscribingPosts_getSubscribingPosts_data;
}

function PostEditTemplate({
  postData,
  requestSignedUrl,
  searchResult,
  setSearchResult,
  uploadedFiles,
  inputFileHandler,
  uploadFilesToS3,
  setIsSaving,
  setUploadedFiles,
}: IPostEditTemplate) {
  const navigate = useNavigate();
  const { cache } = useApolloClient();
  const { register, handleSubmit, formState, getValues, setValue } = useForm<EditPostInputDto>({ mode: 'onChange' });
  const [editPost] = useMutation<MEditPost, MEditPostVariables>(EDIT_POST);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(JSON.parse(postData.photos));

  useEffect(() => {
    // console.log(postData);
    setValue('contents', postData.contents);
    setSearchResult({ value: { description: postData.address, place_id: postData.placeId } });
  }, []);

  const onSubmitForm = async (formData: EditPostInputDto) => {
    setIsSaving(true);
    try {
      // ????????? ??????????????? ????????? ????????? ??????.
      // if (uploadedFiles) {
      //   const res = await requestSignedUrl();
      //   const preSignedUrls = res.data?.createPreSignedUrls;
      //   if (!preSignedUrls?.ok) {
      //     throw new Error('PreSignedUrl ?????? ??????');
      //   }
      //   const uploadResult = await uploadFilesToS3(uploadedFiles!, preSignedUrls.urls!);
      //   photoUrls = uploadResult.map((result) => {
      //     if (result.status !== 200) {
      //       throw new Error('s3 ????????? ??????');
      //     }
      //     if (!result.config.url) {
      //       throw new Error('s3 ????????? ??????');
      //     }
      //     return result.config.url.split('?Content')[0];
      //   });
      // }
      const createOrEditRes = await editPost({
        variables: {
          args: {
            ...formData,
            postId: postData.id,
            address: searchResult?.value.description,
            placeId: searchResult?.value.place_id,
            photoUrls: uploadedPhotos,
          },
        },
      });
      if (!createOrEditRes.data?.editPost.ok) {
        window.alert('????????? ????????? ??????????????????.');
        setIsSaving(false);
        return;
      }
      // ????????? ?????? ??????
      cache.writeFragment({
        id: cache.identify({ id: postData.id, __typename: postData.__typename }),
        fragment: gql`
          fragment EditPost on Posts {
            id
            __typename
            address
            placeId
            photos
            contents
          }
        `,
        data: {
          __typename: postData.__typename,
          id: postData.id,
          address: searchResult?.value.description,
          placeId: searchResult?.value.place_id,
          photos: JSON.stringify(uploadedPhotos),
          contents: formData.contents,
        },
      });
      window.alert('????????? ????????? ??????????????????.');
      setIsSaving(false);
      navigate(routes.home, { replace: true });
    } catch (e) {
      console.log(e);
      alretError();
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <WrapperColumn w="100%">
        <UploadImgViewer
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          inputFileHandler={inputFileHandler}
          uploadedPhotos={uploadedPhotos}
          setUploadedPhotos={setUploadedPhotos}
        />
        <WrapperColumn w="100%" ai="flex-start">
          <WrapperRow jc="flex-start" w="100%">
              <TextBase text={`?????? ?????? : ${postData.address || '??????'}`} p="10px 0" />
          </WrapperRow>
          <PlaceSearch searchResult={searchResult} setSearchResult={setSearchResult} />
        </WrapperColumn>
        <WrapperColumn w="100%" ai="flex-start">
          <TextBase text="??????" p="10px 0px" />
          <FormTextArea register={register('contents', { required: '????????? ??????????????????', maxLength: 300 })} />
        </WrapperColumn>
        {formState.errors.contents?.message && <TextBase text={formState.errors.contents?.message} />}
        <WrapperColumn p='20px 0 50px 0' w='100%'>
          <ButtonSubmit title="??????" onClick={() => {}} />
        </WrapperColumn>
      </WrapperColumn>
    </form>
  );
}
export default PostEditTemplate;
