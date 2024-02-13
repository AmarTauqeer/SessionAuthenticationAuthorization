import { useState, React, useEffect } from "react";
import { useRouter } from "next/router";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";

export default function Login() {
  const url = process.env.NEXT_PUBLIC_BASEURL;
  const router = useRouter();
  const [email, setEmail] = useState("amar.tauqeer@gmail.com");
  const [password, setPassword] = useState("amar");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${url}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      if (res.detail !== undefined) {
        toast.error("User name or password is invalid");
        return false;
      } else {
        localStorage.setItem("userInfo",JSON.stringify(res))
        router.push("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col text-center items-center justify-center h-screen">
        <div className="bg-white rounded-2xl shadow-2xl flex">
          <div className="w-64 md:w-[450px] p-5">
            <div className="text-left font-bold ml-6 md:ml-0">
              <span className="text-green-500">Blog</span>Application
            </div>
            <div className="py-12">
              <h2 className="text-sm uppercase md:text-2xl font-bold text-green-500 mb-1">
                Login
              </h2>
              <div className="border-2 w-[40px] md:w-[70px] border-green-500 inline-block mb-12"></div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-[250px] md:w-80 lg:w-80 flex items-center border">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center mt-3">
                <div className="bg-gray-100 w-[250px] md:w-80 lg:w-80 flex items-center">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center mt-5 mb-3">
                <div className="flex">
                  <div className="text-sm mr-2">Don&rsquo;t have an account</div> 
                  <div>
                    <Link
                      className="flex justify-end text-sm underline text-blue-600"
                      href="/signup"
                    >
                      Signup?
                    </Link>
                  </div>
                </div>
              </div>
              <a
                onClick={handleSubmit}
                href="#"
                className=" bg-green-500 w-48 md:w-80 lg:w-80 text-sm md:text-lg text-white px-6 md:px-8 py-1 inline-block font-semibold hover:bg-green-400"
              >
                Sign In
              </a>
              <div className="flex items-center justify-center mt-3">
                <p
                  className={
                    message === "Unauthenticated" ||
                    message ===
                      "This password is too short. It must contain at least 8 characters." ||
                    message === "This field may not be null."
                      ? "bg-red-500 text-lg text-white"
                      : "bg-rose-500 text-lg text-white"
                  }
                >
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
