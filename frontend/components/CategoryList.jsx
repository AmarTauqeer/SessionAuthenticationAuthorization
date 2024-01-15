import React from "react";
import { useRouter } from "next/router";
const CategoryList = ({ categories }) => {
  const router = useRouter();
  const handleClick = (id) => {
    router.push({
      pathname: "/",
      query: { category_id: id },
    });
  };
  const handleAll = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-col w-80 md:w-full bg-red-500 rounded-2xl">
      <div className="text-xl font-semibold text-center m-4 text-white">Categories</div>
      {categories.length > 0 &&
        categories.map((c) => (
          <div className="flex items-center bg-white shadow-xl border border-solid p-3 hover:bg-red-500 hover:text-white" key={c.category_id} onClick={() => handleClick(c.category_id)}>
            <div
              className="cursor-pointer"
              onClick={() => handleClick(c.category_id)}
            >
              {c.category_name}
            </div>
          </div>
        ))}
      <div className="cursor-pointer bg-white shadow-xl border border-solid p-3 hover:bg-red-500 hover:text-white" onClick={handleAll}>
        All
      </div>
    </div>
  );
};

export default CategoryList;
