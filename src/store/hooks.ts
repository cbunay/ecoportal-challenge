import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

export const useCalendarDispatch = useDispatch.withTypes<AppDispatch>();
export const useCalendarSelector = useSelector.withTypes<RootState>();
export const useCalendarStore = useStore.withTypes<AppStore>();
