import { BASE_URL, LS_USER_KEY } from "@/app/api";
import { useAppDispatch } from "@/app/hooks";
import { useEffectOnce } from "@/components/utils";
import { setIsAuthenticated, setUser } from "@/features/account/accountSlice";
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
        if (inIframe()) window.parent.postMessage({
          tag: "Casdoor",
          type: "SilentSignin",
          data: "success"
        }, "*");
        dispatch(setIsAuthenticated(true))
        navigate("/app/dashboard/graphs", { replace: true })
      } else {
        console.error(resp)
        dispatch(setIsAuthenticated(false))
        navigate("/", { replace: true })
      }
    })
  }

  useEffectOnce(() => {
    login()
  })

  return <></>
}