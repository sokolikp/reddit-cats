import { ACTION_TYPES } from "../constants/constants";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import _ from 'lodash';

const storedSavedPosts = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_POSTS);
const initialState = {
  savedPosts: JSON.parse(storedSavedPosts) || []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SAVE_POST: {
            const updatedState = { ...state, savedPosts: [...state.savedPosts, action.payload] };
            const { savedPosts } = updatedState;
            localStorage.setItem('SAVED_POSTS', JSON.stringify(savedPosts));
            return updatedState;
        }
        case ACTION_TYPES.UNSAVE_POST: {
            const savedPosts = _.filter(state.savedPosts, (post) => {
                return post.id !== action.payload.id;
            });
            localStorage.setItem('SAVED_POSTS', JSON.stringify(savedPosts));
            return { ...state, savedPosts: savedPosts };
        }
    default:
        return state
  }
};

export default rootReducer;
