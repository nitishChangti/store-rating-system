import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../store/authSlice";

export default function Message() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.auth.message);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm">
        {message}
      </div>
    </div>
  );
}
