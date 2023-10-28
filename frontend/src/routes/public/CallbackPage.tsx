import { BASE_URL } from "@/app/api";
import { useEffectOnce } from "@/components/utils";
import { useLocation } from "react-router-dom";

export default function CallbackPage() {
  const location = useLocation()
  const params: JSONObject = new URLSearchParams(location.search)

  function login() {
    window.sdk.signin(BASE_URL as string, '/api/v1/sign-in', params.code, params.state).then((res: any) => {
      if (res?.success) {
        if (inIframe()) {
          const message = { tag: "Casdoor", type: "SilentSignin", data: "success" };
          window.parent.postMessage(message, "*");
        }
        window.location.href = '/app/dashboard/graphs'
      } else {
        console.error(res)
        window.location.href = '/'
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