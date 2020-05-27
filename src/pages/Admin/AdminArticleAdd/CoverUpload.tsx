import { Modal, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback } from 'react';
import { useSetState } from '../../../utils/commonHooks';
import { CoverUploadButton } from './CoverUploadButton';

import "./coverUpload.css";

export const CoverUpload: FC = (props) => {
  const [coverState, setCoverState] = useSetState<{
    previewImage: string;
    previewVisible: boolean;
    previewTitle: string;
    fileList: UploadFile[];
  }>({ previewImage: '', previewVisible: false, previewTitle: '', fileList: [] });

  const getBase64 = useCallback((file: Blob | File | undefined) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  const onPreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setCoverState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || (file.url && file.url.substring(file.url.lastIndexOf('/') + 1)),
    });
  }, []);

  const onChange = useCallback((info: UploadChangeParam<UploadFile>) => {
    setCoverState({ fileList: info.fileList });
  }, []);

  const onCancel = useCallback(() => {
    setCoverState({ previewVisible: false });
  }, []);

  return (
    <div className="uranus-cover-upload">
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={coverState.fileList}
        onPreview={onPreview}
        onChange={onChange}
      >
        {
          coverState.fileList.length > 0 ?
          null :
          <CoverUploadButton />
        }
      </Upload>
      <Modal
        visible={coverState.previewVisible}
        title={coverState.previewTitle}
        footer={null}
        onCancel={onCancel}
      >
        <img alt="文章标题" style={{ width: '100%' }} src={coverState.previewImage} />
      </Modal>
    </div>
  );
};