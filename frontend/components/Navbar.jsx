import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";

const Navbar = () => {
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const [toggle, setToggel] = useState(false);
  const [shadow, setShadow] = useState(false);
  const userInfo = useContext(UserContext);
  const router = useRouter();

  const handleToggle = (e) => {
    setToggel(!toggle);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener("scroll", handleShadow);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      const response = await fetch(`${url}/api/logout/`);

      if ((await response.status) == 200) {
        localStorage.removeItem("userInfo");
        await router.push("/login");
      }
    };
    fetchData();
  };

  return (
    <>
      <div
        className={
          shadow
            ? "fixed w-full h-20 shadow-xl z-[100]"
            : "fixed w-full h-20 z-[100]"
        }
      >
        <div className="flex justify-between items-center font-bold text-white w-full h-full px-2 2xl:px-16 bg-red-600">
          <h2 className="text-2xl">
            <Link href="/">My Blog</Link>
          </h2>
          <div className="text-white">
            <ul className="hidden md:flex">
              <Link href="/">
                <li className="ml-10 text-sm uppercase hover:border-b">Post</li>
              </Link>

              {userInfo && userInfo !== undefined && userInfo !== null ? (
                <>
                  <Link href="/post/create">
                    <li className="ml-10 text-sm uppercase hover:border-b">
                      Post Create
                    </li>
                  </Link>
                  <Link href="/">
                    <li className="ml-10 text-sm uppercase hover:border-b border border-white rounded-full px-2">
                      {userInfo.user.first_name}
                    </li>
                  </Link>
                  <Link href="/login" onClick={handleLogout}>
                    <li className="ml-5 text-sm" onClick={handleLogout}>
                      Logout
                    </li>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <li className="ml-10 text-sm uppercase hover:border-b">
                      Login
                    </li>
                  </Link>
                  <Link href="/signup">
                    <li className="ml-10 text-sm uppercase hover:border-b">
                      Signup
                    </li>
                  </Link>
                </>
              )}
            </ul>
            <div className="md:hidden" onClick={handleToggle}>
              <AiOutlineMenu size={25} />
            </div>
          </div>
        </div>
        <div
          className={
            toggle
              ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70"
              : ""
          }
        >
          <div
            className={
              toggle
                ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-3 ease-in duration-500"
                : "fixed left-[-100%] p-10 ease-in duration-500"
            }
          >
            <div className="flex w-full justify-between items-center">
              <h4>
                <Link onClick={() => setToggel(false)} href="/">
                  My Blog
                </Link>
              </h4>
              <div
                className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer"
                onClick={handleToggle}
              >
                <AiOutlineClose size={25} />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
              <p className="w-[85%] md:w-[90%] py-4"></p>
            </div>
            <div className="py-4 flex flex-col">
              <ul className="uppercase">
                <Link onClick={() => setToggel(false)} href="/">
                  <li className="py-2 text-sm">Post</li>
                </Link>

                {userInfo && userInfo !== undefined && userInfo !== null ? (
                  <>
                    <Link href="/post/create" onClick={() => setToggel(false)}>
                      <li
                        className="md:ml-10 py-2 text-sm uppercase hover:border-b"
                        onClick={() => setToggel(false)}
                      >
                        Post Create
                      </li>
                    </Link>
                    <Link onClick={() => setToggel(false)} href="/logout">
                      <div className="flex flex-col justify-start">
                        <div className="text-semibold">{userInfo.user.first_name}</div>
                        <li className="py-4 text-sm" onClick={handleLogout}>
                          Logout
                        </li>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link onClick={() => setToggel(false)} href="/signup">
                      <li className="py-4 text-sm">Signup</li>
                    </Link>
                    <Link onClick={() => setToggel(false)} href="/login">
                      <li className="py-4 text-sm">Login</li>
                    </Link>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
