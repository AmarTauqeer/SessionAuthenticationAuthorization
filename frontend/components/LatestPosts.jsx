import { useRouter } from "next/router";
import React from "react";

const LatestPosts = ({ posts }) => {
  const router = useRouter();
  const handleClick = (id) => {
    router.push({
      pathname: "/",
      query: { post_id: id },
    });
  };
  return (
    <div className="flex flex-col w-80 md:w-full bg-red-500 rounded-2xl mt-4">
      <div className="text-xl font-semibold text-center m-4 text-white">
        Latest Posts
      </div>
      {posts.length > 0 &&
        posts.map((p) => (
          <div
            className="flex items-center bg-white shadow-xl border border-solid p-3 hover:bg-red-500 hover:text-white"
            key={p.id}
            onClick={() => handleClick(p.id)}
          >
            <div className="cursor-pointer" onClick={() => handleClick(p.id)}>
              {p.post_title}
            </div>
          </div>
        ))}
    </div>
  );
};

export default LatestPosts;
