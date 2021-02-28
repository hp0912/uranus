import { IWebsiteSettingsEntity } from "../types";

export const UPDATEWEBSITESETTINGS = 'UPDATEWEBSITESETTINGS';

export const reducer = (state: IWebsiteSettingsEntity | null, action: { type: string, data: IWebsiteSettingsEntity | null }) => {
  switch (action.type) {
    case UPDATEWEBSITESETTINGS:
      if (action.data) {
        return Object.assign({}, state, action.data);
      } else {
        return null;
      }
    default:
      return null;
  }
};