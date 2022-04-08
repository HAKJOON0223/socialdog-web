import { useMutation, useQuery } from '@apollo/client';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DELETE_COMMENT } from 'apllo-gqls/comments';
import { MYPROFILE } from 'apllo-gqls/users';
import { theme } from 'assets/styles/theme';
import useEvictCache from 'hooks/useEvictCache';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhoto from 'screen/common-comp/image/ProfilePhoto';
import TextBase from 'screen/common-comp/texts/TextBase';
import WrapperColumn from 'screen/common-comp/wrappers/WrapperColumn';
import WrapperRow from 'screen/common-comp/wrappers/WrapperRow';
import { routes } from 'screen/routes';
import { alretError } from 'utils/alret';
import { MDeleteComment, MDeleteCommentVariables } from '__generated__/MDeleteComment';
import { QMe } from '__generated__/QMe';

interface ICommentCard {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    photo: string | null;
  };
  __typename: string;
  reCommentCounts?: number;
  authorId?: string;
  setParentComment?: () => void;
}

function CommentCard({ id, content, user, authorId, __typename, reCommentCounts, setParentComment }: ICommentCard) {
  const evictCache = useEvictCache();
  const navigate = useNavigate();
  const { data: meData } = useQuery<QMe>(MYPROFILE);
  const authUser = meData?.me.data;

  const [deleteComment] = useMutation<MDeleteComment, MDeleteCommentVariables>(DELETE_COMMENT);

  const deleteCommentHandler = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제할까요?')) {
      return;
    }
    const res = await deleteComment({ variables: { args: { id: commentId } } });
    if (!res.data?.deleteComment.ok) {
      alretError();
      return;
    }
    evictCache(commentId, __typename);
  };

  const isDeletable = () => {
    return authUser?.id === user.id || authorId === user.id;
  };

  const moveToCommentDetail = () => {
    navigate(`${routes.commentDetailBase}${id}`);
  };

  return (
    <WrapperColumn w="100%">
      <WrapperRow w="100%" p="8px 0px">
        <ProfilePhoto url={user.photo} size="48px" />
        <WrapperColumn w="100%" ai="flex-start" p="0px 8px" onClick={setParentComment}>
          <TextBase text={user.username} />
          <TextBase text={content} />
        </WrapperColumn>
        {isDeletable() && (
          <>
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              color={theme.color.achromatic.black}
              onClick={() => {
                deleteCommentHandler(id);
              }}
            />
          </>
        )}
      </WrapperRow>
      {Boolean(reCommentCounts) && (
        <WrapperRow onClick={moveToCommentDetail}>
          <TextBase text={`댓글 수${reCommentCounts}`} />
        </WrapperRow>
      )}
    </WrapperColumn>
  );
}

CommentCard.defaultProps = {
  reCommentCounts: 0,
  authorId: '',
  setParentComment: () => {},
};

export default CommentCard;