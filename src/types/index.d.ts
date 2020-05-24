export interface IArticleEntity {
  id: number;
  title: string;
  coverPicture?: string;
  desc?: string;
  content?: string;
  tags?: number[];
  auditStatus: number;
  createdBy: number;
  createdTime: number;
  modifyTime: number;
}