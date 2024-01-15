import { useContext, useEffect, useState } from "react";
import "@/styles/globals.css";
// import "notyf/notyf.min.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Toaster, toast } from "sonner";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  const [auth, setAuth] = useState();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("userInfo"));
    setAuth(auth);
  }, [pageProps]);
  return (
    <Layout auth={auth}>
      <Toaster richColors position="top-center" duration={2000} />
      <Component {...pageProps} />
    </Layout>
  );
}
