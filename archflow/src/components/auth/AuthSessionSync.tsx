"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthStatus } from "@/store/slices/authSlice";

export function AuthSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setAuthStatus({ status: "loading" }));
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      dispatch(
        setAuthStatus({
          status: "authenticated",
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          },
        }),
      );
      return;
    }

    dispatch(setAuthStatus({ status: "unauthenticated", user: null }));
  }, [dispatch, session, status]);

  return null;
}
