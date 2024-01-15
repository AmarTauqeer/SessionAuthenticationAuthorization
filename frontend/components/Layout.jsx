import { useRouter } from "next/router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { UserContext } from "./UserContext";

export default function Layout(props) {
  const router = useRouter();
  return (
    <UserContext.Provider value={props.auth}>
      {router.pathname !== "/login" && router.pathname !== "/signup" ? (
        <div className="flex min-h-[100vh] flex-col">
          <Navbar />
          <main className="pt-24 flex-1 w-full">
            <div className="flex justify-center items-center">{props.children}</div>
          </main>
          <Footer />
        </div>
      ) : (
        <div>{props.children}</div>
      )}
    </UserContext.Provider>
  );
}
