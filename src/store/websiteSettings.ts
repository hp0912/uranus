import { IWebsiteSettingsEntity } from "../types";

export const UPDATEWEBSITESETTINGS = 'UPDATEWEBSITESETTINGS';

export const reducer = (state: IWebsiteSettingsEntity | null, action: { type: string, data: IWebsiteSettingsEntity | null }) => {
  switch (action.type) {
    case UPDATEWEBSITESETTINGS:
      return Object.assign({}, state, action.data);
    default:
      return null;
  }
};