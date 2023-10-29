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

  function login() {
    window.sdk.signin(
      BASE_URL as string,
      '/api/v1/auth/sign-in',
      params.code,
      params.state
    ).then((res: JSONObject) => {
      if (res?.status === "ok") {
        if (inIframe()) window.parent.postMessage({
          tag: "Casdoor",
          type: "SilentSignin",
          data: "success"
        }, "*");
        dispatch(setIsAuthenticated(true))
        navigate("/app/dashboard/graphs", { replace: true })
      } else {
        console.error(res)
        localStorage.removeItem(LS_USER_KEY)
        dispatch(setIsAuthenticated(false))
        navigate("/", { replace: true })
      }
    })
  }

  function inIframe() {
    try {
      return window !== window.parent;
    } catch (e) {
      return true;
    }
  }

  useEffectOnce(() => {
    login()
  })

  return <></>
}