import { BASE_URL, LS_USER_KEY, lUserDefault } from "@src/app/baseApi";
import { useAppDispatch } from "@src/app/hooks";
import { lStorage } from "@src/app/utilities";
import { setIsAuthenticated } from "@src/features/account/accountSlice";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const params: JSONObject = new URLSearchParams(location.search)
  const dispatch = useAppDispatch()

  function inIframe() {
    try {
      return window !== window.parent;
    } catch (e) {
      return true;
    }
  }

  function login() {
    window.sdk.signin(
      BASE_URL as string,
      '/api/v1/auth/sign-in',
      params.code,
      params.state
    ).then((resp: JSONObject) => {
      if (resp?.status === "ok") {
        lStorage(LS_USER_KEY, lUserDefault(true))
        dispatch(setIsAuthenticated(true))
        if (inIframe()) window.parent.postMessage({
          tag: "Casdoor",
          type: "SilentSignin",
          data: "success"
        }, "*");
        navigate("/dashboard/graph", { replace: true })
      } else {
        console.error(resp)
        localStorage.removeItem(LS_USER_KEY)
        dispatch(setIsAuthenticated(false))
        navigate("/", { replace: true })
      }
    })
  }

  useEffect(() => {
    login()
  }, [])

  return <></>
}