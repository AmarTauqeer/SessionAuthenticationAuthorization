import PostList from "@/components/PostList";
import { UserContext } from "@/components/UserContext";
import React, { useContext, useEffect, useState } from "react";
import Category from "./category";
import { useRouter } from "next/router";
import LatestPosts from "@/components/LatestPosts";

const Post = (props) => {
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const [auth, setAuth] = useState();
  const [posts, setPosts] = useState([]);
  const userInfo = useContext(UserContext);
  const router = useRouter();

  const getPosts = async (category_id, post_id) => {
    let response = [];
    let dataArray = [];
    if (category_id == 0 && post_id == 0) {
      response = await fetch(`${url}/api/post-list/`);
    } else if (post_id > 0 && category_id == 0) {
      response = await fetch(`${url}/api/post/${post_id}`);
    } else {
      response = await fetch(`${url}/api/post-list/category/${category_id}`);
    }
    const res = await response.json();

    let arr = Array.isArray(res);

    if (!arr) {
      let users = [];
      users = await getUser();
      let createdBy = "";

      if (users.length > 0) {
        createdBy = await users.filter((u) => {
          if (u.id == res.created_by) {
            return u.first_name;
          }
        });
      }
      if (createdBy.length > 0) {
        let data = {
          id: res.post_id,
          category: res.category,
          post_title: res.post_title,
          post_description: res.post_description,
          created_at: res.created_at,
          created_by: createdBy[0].first_name,
          like: res.like,
        };
        dataArray.push(data);
        setPosts(dataArray);
      }
    } else {
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        let createdBy = "";
        let users = [];

        users = await getUser();

        if (users.length > 0) {
          createdBy = await users.filter((u) => {
            if (u.id == element.created_by) {
              return u.first_name;
            }
          });
        }
        // console.log(createdBy);
        if (createdBy.length > 0) {
          let data = {
            id: element.post_id,
            category: element.category,
            post_title: element.post_title,
            post_description: element.post_description,
            created_at: element.created_at,
            created_by: createdBy[0].first_name,
            like: element.like,
          };
          dataArray.push(data);
        }
      }
      setPosts(dataArray);
    }
  };

  const getUser = async () => {
    // console.log(token);
    const response = await fetch(`${url}/api/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "json/application",
        // Authorization: `Token ${token}`,
      },
    });
    const res = await response.json();
    return res;
  };

  useEffect(() => {
    let category_id = 0;
    let post_id = 0;
    if (router.query) {
      if (router.query.category_id) {
        category_id = router.query.category_id;
      }
      if (router.query.post_id) {
        post_id = router.query.post_id;
      }
    }
    if (category_id > 0 && post_id == 0) {
      getPosts(category_id, 0);
    } else if (post_id > 0 && category_id == 0) {
      getPosts(0, post_id);
    } else {
      getPosts(0, 0);
    }
  }, [userInfo, router.query]);

  return (
    <UserContext.Provider value={auth}>
      <div className="flex justify-center items-center md:w-[1240px] lg:w-[1240px]">
        <div className="grid md:grid-cols-7 lg:grid-cols-7 gap-2 w-full m-2 ">
          <div className="flex flex-col col-span-2 rounded-2xl mb-3">
            <div>
              <Category />
            </div>
            <div>
              <LatestPosts posts={posts} />
            </div>
          </div>
          <div className="flex flex-col col-span-5">
            <PostList posts={posts} user={userInfo} />
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Post;
