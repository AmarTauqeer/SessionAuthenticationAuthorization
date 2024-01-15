import CommentList from "@/components/CommentList";

const Comment = (props) => {
  return (
    <div>
      <CommentList userInfo={props.userInfo} post={props.post_id} />
    </div>
  );
};

export default Comment;
