import { ACTION_TYPES } from "../constants/constants";

export const savePost = post => ({ type: ACTION_TYPES.SAVE_POST, payload: post });
export const unsavePost = post => ({ type: ACTION_TYPES.UNSAVE_POST, payload: post });
