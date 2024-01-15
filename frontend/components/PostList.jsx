// import { PhotoIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { SlLike } from "react-icons/sl";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { FaRegComment } from "react-icons/fa6";
import Comment from "@/pages/comment";
import { toast } from "sonner";
import { useRouter } from "next/router";

const PostList = ({ posts, user }) => {
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const [comment, setComment] = useState(false);
  const [like, setLike] = useState(false);
  const router = useRouter();

  const handleEdit = async (id) => {
    router.push(`/post/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/post-delete/${id}`, {
      method: "DELETE",
      headers: {
        AUTHORIZATION: `Token ${user.token}`,
      },
    });
    if (response.status == 200) {
      toast.success("Record has been deleted successfully.");
      router.push("/");
    } else {
      toast.error("There are issues to delete the record.");
      return false;
    }
  };

  const handleLike=async(id)=>{
    const response = await fetch(`${url}/api/post-update/`, {
      method: "PATCH",
      headers: {
        'Content-Type':"application/json",
        AUTHORIZATION: `Token ${user.token}`,
      },
      body:JSON.stringify({
        post_id:id,
        like:!like,
      })
    });
    const res = await response.json();
    if (res) {
      setLike(!like)
      router.push("/")
    }
  }

  const folderPath = process.env.NEXT_PUBLIC_FOLDER_PATH;
  return (
    <>
      {posts.length>0 &&
        posts.map((post) => (
          <>
            <div className="flex flex-col w-80  md:w-full lg:w-full justify-center items-center mb-4 py-4 bg-white rounded-lg shadow-2xl">
              <div
                className="transition duration-100 text-center mb-8 cursor-pointer hover:text-pink-600 
              text-3xl font-semibold mt-6"
              >
                <Link href={`/post/${post.id}`}>{post.post_title}</Link>
              </div>
              <div className="flex justify-start w-full items-center mb-2 p-2">
                <span className="text-justify">{post.post_description}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-start w-full items-center mb-2 mt-1 px-2">
                <div className="flex items-center w-full">
                  <div className="mr-6">{post.created_by}</div>
                  <div>{moment(post.created_at).format("MMM DD, YYYY")}</div>
                </div>

                {user != undefined && (
                  <div className="flex justify-center md:justify-end items-center w-full">
                    <div className="mt-4 px-2 py-1 cursor-pointer">
                      <SlLike
                        size={25}
                        onClick={() => handleLike(post.id)}
                        style={{ color: post.like ? "blue" : "gray" }}
                      />
                    </div>
                    <div className="mt-4 px-2 py-1 cursor-pointer">
                      <FaRegComment
                        size={25}
                        onClick={() => setComment(!comment)}
                      />
                    </div>
                    <div className="mt-4 px-2 py-1 cursor-pointer text-yellow-500">
                      <MdModeEditOutline
                        size={30}
                        onClick={() => handleEdit(post.id)}
                      />
                    </div>
                    <div className="mt-4 text-red-500 px-1 py-1 cursor-pointer">
                      <MdDeleteOutline
                        onClick={() => handleDelete(post.id)}
                        size={30}
                      />
                    </div>
                  </div>
                )}
              </div>
              {comment && (
                <div className="w-full p-4 md:px-4 md:py-4">
                  <Comment post_id={post.id} userInfo={user} />
                </div>
              )}
            </div>
          </>
        ))}
    </>
  );
};

export default PostList;
