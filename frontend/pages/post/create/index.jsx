import React, { useEffect, useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import Link from "next/link";
import { toast } from "sonner";

const PostCreate = () => {
  const router = useRouter();
  const [valueDate, setValueDate] = useState(new Date());

  const [categoryData, setCategoryData] = useState([]);
  //   const [imagePreviw, setImagePreview] = useState("");
  //   const [savedImage, setSavedImage] = useState("");
  //   const [file, setFile] = useState("");
  //   const inputRef = useRef(null);
  const userInfo = useContext(UserContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      created_at: new Date(),
      post_title: "",
      category: 1,
      post_description: "",
      created_by: 0,
    },
  });

  const url = process.env.NEXT_PUBLIC_BASEURL;

  //   const onChangePicture = (e) => {
  //     let currentDate = new Date();
  //     const day = currentDate.getDate();
  //     const month = currentDate.getMonth() + 1;
  //     const year = currentDate.getFullYear();
  //     let date = year + "-" + month + "-" + day;
  //     setValue("postImage", date + "-" + e.target.files[0].name);
  //     setImagePreview(URL.createObjectURL(e.target.files[0]));
  //     setFile(e.target.files[0]);
  //   };

  const handleCancel = () => {
    router.push(`/`);
  };

  const onSubmit = async (data) => {
    let dateISO = valueDate.toISOString();

    const formData = new FormData();

    // formData.append("file", file);
    // formData.append("postImage", data.postImage);
    formData.append("post_title", data.post_title);
    formData.append("post_description", data.post_description);
    formData.append("category", parseInt(data.category));
    formData.append("created_by", userInfo.user.id);
    formData.append("created_at", dateISO);

    const response = await fetch(`${url}/api/post-create/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${userInfo.token}`,
      },

      body: formData,
    });
    const res = await response.json();

    if (res) {
      router.push("/");
      return true;
    } else {
      toast.error("There are some errors to insert the record.");
      return false;
    }
  };

  const fetchCategory = async () => {
    const response = await fetch(`${url}/api/category-list/`);
    const res = await response.json();
    setCategoryData(res);
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  console.log(userInfo);

  return (
    <>
      {userInfo != undefined ? (
        <>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="font-semibold text-md flex justify-center items-center mt-5 mb-5 md:text-xl">
              Post Create
            </h1>
            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">Post Tile</span>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="post_title"
                className="px-2 py-2 ml-2 md:ml-0 outline-none border w-80 md:w-96"
                placeholder="enter post title"
                {...register("post_title", {
                  required: true,
                })}
              />
            </div>
            <div className="text-rose-400">
              {errors.post_title?.type === "required" &&
                "Post title is required"}
            </div>
            <div className="flex flex-col mt-6">
              <span className="font-semibold px-2 py-2 md:px-0 md:my-0">Category</span>
              <div className="ml-2 md:ml-0">
                <select
                  className="px-2 py-2 outline-none border w-80 md:w-96"
                  {...register("category", {
                    required: "Category is required.",
                  })}
                >
                  <option value="">Select...</option>
                  {categoryData !== undefined &&
                    categoryData.map((x) => {
                      return (
                        <>
                          <option value={x.category_id}>
                            {x.category_name}
                          </option>
                        </>
                      );
                    })}
                </select>
              </div>
              <div className="text-rose-400">{errors.category?.message}</div>
            </div>
            <div className="flex flex-col mt-6">
              <span className="px-2 py-2 font-semibold md:px-0 md:my-0">Post Content</span>
              <div className="ml-2 md:ml-0">
                <textarea
                  rows={10}
                  className="px-2 py-2 outline-none border w-80 md:w-[600px]"
                  {...register("post_description", {
                    required: true,
                  })}
                />
              </div>
              <div className="text-rose-400">
                {errors.post_description?.type === "required" &&
                  "Post content is required"}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-semibold leading-6 text-gray-900  mb-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold 
              text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-indigo-600  mb-4"
              >
                Save
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center h-screen bg-white">
            <span className="font-semibold text-xl">
              You are not logged in.
            </span>
            <div className="font-semibold text-2xl text-blue-800 pl-6 cursor-pointer hover:text-cyan-800">
              <Link href={"/login"}>Login</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostCreate;
