import React, { useEffect, useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LuSendHorizonal } from "react-icons/lu";
import { BsReply } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
const ReplyList = ({ comment_id, userInfo }) => {
  // console.log(comment_id);
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const [replies, setReplies] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      created_at: new Date(),
      reply_text: "",
      comment: 0,
      created_by: 0,
    },
  });

  const fetchReplies = async (id) => {
    let dataArray = [];
    const response = await fetch(`${url}/api/reply-list/`);
    const res = await response.json();
    if (res.length > 0) {
      const filterReplies = res.filter((r) => r.comment == id);
      for (let i = 0; i < filterReplies.length; i++) {
        const element = filterReplies[i];
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
          reply_id: element.reply_id,
          reply_text: element.reply_text,
          created_at: element.created_at,
          created_by: createdBy[0].first_name,
          like:element.like,
        };
        dataArray.push(data);
      }
      if (dataArray.length > 0) {
        setReplies(dataArray);
      }
    } else {
      setReplies([]);
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
    return res;
  };

  useEffect(() => {
    if (comment_id != undefined) {
      fetchReplies(comment_id);
    }
  }, [comment_id]);

  const onSubmit = async (data,e) => {
    e.preventDefault();
    let dateISO = valueDate.toISOString();

    const formData = new FormData();
    formData.append("reply_text", data.reply_text);
    formData.append("comment", parseInt(comment_id));
    formData.append("created_by", parseInt(userInfo.user.id));
    formData.append("created_at", dateISO);

    const response = await fetch(`${url}/api/reply-create/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${userInfo.token}`,
      },

      body: formData,
    });
    const res = await response.json();

    if (res != "You don't have permission for this action") {
      toast.success("Reply has been added.");
      setValue("reply_text", "");
      await fetchReplies(comment_id);
      return true;
    } else {
      toast.error(res);
      return false;
    }
  };
  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/reply-delete/${id}`, {
      method: "DELETE",
      headers: {
        AUTHORIZATION: `Token ${userInfo.token}`,
      },
    });
    if (response.status == 200) {
      toast.success("Record has been deleted successfully.");
      await fetchReplies(comment_id);
    } else {
      toast.error("There are issues to delete the record.");
      return false;
    }
  };

  return (
    <div className="flex flex-col w-64 md:w-full px-4 ">
      {/* <div className="text-xl font-semibold">Replies</div> */}
      {userInfo != undefined && (
        <div>
          <form>
            <div className="flex justify-between lg:flex-row bg-gray-100 rounded-xl w-64 md:w-[500px]">
              <input
                type="text"
                autoComplete="reply_text"
                className="px-2 py-2 outline-none bg-gray-100 rounded-xl flex w-[450px]"
                placeholder="write your reply"
                {...register("reply_text", {
                  required: true,
                })}
              />

              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="py-1 mr-2 cursor-pointer"
              >
                <BsReply size={22} />
              </button>
            </div>
            <div className="text-rose-400">
              {errors.reply_text?.type === "required" && "Reply is required"}
            </div>
          </form>
        </div>
      )}
      {replies.length > 0 &&
        replies.map((c) => (
          <div className="flex justify-start w-full items-center">
            <div className="flex flex-col md:flex-row justify-center items-center px-4">
              <div className="mr-6">{c.created_by}</div>
              <div>{moment(c.created_at).format("MMM DD, YYYY")}</div>
              <div className="ml-6">{c.reply_text}</div>
              <div className="px-1 py-1 cursor-pointer text-rose-400">
                <MdDeleteOutline
                  onClick={() => handleDelete(c.reply_id)}
                  size={22}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ReplyList;
