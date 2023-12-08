import { signOut } from "@src/features/account/accountSlice"
import { RootState } from "./store"
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

/**
 * When unauthorized sign out the user 
 * (which auto redirects to /)
*/
export const rtkQueryAuthHandler: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (action.payload.status === 401) {
        toast.warn('Unauthorized!')
        next(signOut())
      } else {
        return next(action)
      }
    }
    return next(action)
  }
