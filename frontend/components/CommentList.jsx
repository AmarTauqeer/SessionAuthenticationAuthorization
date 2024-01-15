import React, { useEffect, useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "sonner";
import ReplyList from "./ReplyList";
import { LuSendHorizonal } from "react-icons/lu";

import { MdDeleteOutline } from "react-icons/md";
const CommentList = ({ userInfo, post }) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const [valueDate, setValueDate] = useState(new Date());
  const [comments, setComments] = useState([]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      created_at: new Date(),
      comment_text: "",
      post: 0,
      created_by: 0,
    },
  });

  const fetchComments = async (post) => {
    let dataArray = [];
    const response = await fetch(`${url}/api/comment-list/`);
    const res = await response.json();
    if (res.length > 0) {
      const filterComments = res.filter((r) => r.post == post);
      for (let i = 0; i < filterComments.length; i++) {
        const element = filterComments[i];
        let createdBy = "";
        let users = [];
        users = await getUsers();

        if (users.length > 0) {
          createdBy = await users.filter((u) => {
            if (u.id == element.created_by) {
              return u.first_name;
            }
          });
        }
        let data = {
          comment_id: element.comment_id,
          comment_text: element.comment_text,
          created_at: element.created_at,
          created_by: createdBy[0].first_name,
          post: element.post,
          like:element.like,
        };
        dataArray.push(data);
      }
      if (dataArray.length > 0) {
        setComments(dataArray);
      }
    } else {
      setComments([]);
    }
  };
  const getUsers = async () => {
    const response = await fetch(`${url}/api/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "json/application",
      },
    });
    const res = await response.json();
    return await res;
  };

  const onSubmit = async (data,e) => {
    e.preventDefault();
    let dateISO = valueDate.toISOString();

    const formData = new FormData();
    // formData.append("file", file);
    // formData.append("postImage", data.postImage);
    formData.append("comment_text", data.comment_text);
    formData.append("post", parseInt(post));
    formData.append("created_by", parseInt(userInfo.user.id));
    formData.append("created_at", dateISO);

    const response = await fetch(`${url}/api/comment-create/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${userInfo.token}`,
      },

      body: formData,
    });
    const res = await response.json();
    console.log(res);

    if (res != "You don't have permission for this action") {
      toast.success("Comment has been added.");
      setValue("comment_text", "");
      await fetchComments(post);
      return true;
    } else {
      toast.error(res);
      return false;
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/comment-delete/${id}`, {
      method: "DELETE",
      headers: {
        AUTHORIZATION: `Token ${userInfo.token}`,
      },
    });
    if (response.status == 200) {
      toast.success("Record has been deleted successfully.");
      await fetchComments(post);
    } else {
      toast.error("You don't have permission for this action");
      return false;
    }
  };
  useEffect(() => {
    if (post != undefined) {
      fetchComments(post);
    }
  }, [post]);

  return (
    <div className="flex flex-col w-[290px] md:w-full ">
      {/* <div className="text-xl font-semibold">Comments</div> */}
      {userInfo != undefined && (
        <div>
          <form>
            <div className="flex justify-between lg:flex-row bg-gray-100 rounded-xl w-64 md:w-[500px]">
              <input
                type="text"
                autoComplete="comment_text"
                className="px-2 py-2 outline-none bg-gray-100 rounded-xl flex w-[450px]"
                placeholder="write your comment"
                {...register("comment_text", {
                  required: true,
                })}
              />
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="py-1 mr-2 cursor-pointer"
              >
                <LuSendHorizonal size={22} />
              </button>
            </div>

            <div className="text-rose-400">
              {errors.comment_text?.type === "required" &&
                "Comment is required"}
            </div>
          </form>
        </div>
      )}
      {comments.length > 0 &&
        comments.map((c) => (
          <>
            <div className="flex justify-start w-full items-center">
              <div className="flex flex-col md:flex-row justify-center items-center px-4">
                <div className="mr-6">{c.created_by}</div>
                <div>{moment(c.created_at).format("MMM DD, YYYY")}</div>
                <div className="ml-6">{c.comment_text}</div>
                <div className="px-1 py-1 cursor-pointer text-rose-400">
                  <button>
                    <MdDeleteOutline
                      onClick={() => handleDelete(c.comment_id)}
                      size={22}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:px-4 py-1">
              <ReplyList comment_id={c.comment_id} userInfo={userInfo} />
            </div>
          </>
        ))}
    </div>
  );
};

export default CommentList;
