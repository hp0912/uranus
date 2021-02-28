import { Modal, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback, useContext, useRef } from 'react';
import { UserContext } from '../../store/user';
import { ISTSAuthForFormResult } from '../../types';
import { useSetState } from '../../utils/commonHooks';
import { AliyunOSSDir, AliyunOSSHost } from '../../utils/constant';
import { stsAuthForForm } from '../../utils/httpClient';
import { CoverUploadButton } from './CoverUploadButton';

// 样式
import "./coverUpload.css";

interface ICoverUploadProps {
  value: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
}

export const CoverUpload: FC<ICoverUploadProps> = (props) => {
  const userContext = useContext(UserContext);

  const [coverState, setCoverState] = useSetState<{
    previewImage: string;
    previewVisible: boolean;
    previewTitle: string;
  }>({ previewImage: '', previewVisible: false, previewTitle: '' });

  const stsAuthParams = useRef<ISTSAuthForFormResult>({
    OSSAccessKeyId: '',
    policy: '',
    Signature: '',
  });

  const getBase64 = useCallback((file: Blob | File | undefined) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  const beforeUpload = useCallback(async (file) => {
    if (!userContext.userState) {
      return Promise.reject('请先登录');
    }

    const validImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp';

    if (!validImage) {
      Modal.error({
        title: '错误',
        content: '非法的图片格式',
      });
    }

    const limitSize = file.size / 1024 / 1024 < 2.5;

    if (!limitSize) {
      Modal.error({
        title: '错误',
        content: '图片大小不得超过2.5M',
      });
    }

    try {
      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      const filename = `article_cover_${new Date().getTime()}${suffix}`;
      const tokenResult = await stsAuthForForm(filename);
      const sts = tokenResult.data.data as ISTSAuthForFormResult;
      (file as any).aliyunOSSFilename = `${AliyunOSSDir}/${userContext.userState.id}/${filename}`;

      stsAuthParams.current = sts;
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message || ex,
      });
      return Promise.reject('获取sts权限失败');
    }

    if (validImage && limitSize) {
      return Promise.resolve();
    } else {
      Modal.error({
        title: '错误',
        content: '图片格式不支持或者图片大小超过限制',
      });
      return Promise.reject(new Error('图片不合法'));
    }
  }, [userContext.userState]);

  const getExtraData = useCallback((file) => {
    if (!userContext.userState) {
      return Promise.reject('请先登录');
    }

    if (!stsAuthParams.current.OSSAccessKeyId) {
      throw new Error('图片上传授权失败，请刷新页面后重试');
    }

    return {
      key: (file as any).aliyunOSSFilename,
      OSSAccessKeyId: stsAuthParams.current.OSSAccessKeyId,
      policy: stsAuthParams.current.policy,
      Signature: stsAuthParams.current.Signature,
    };
  }, [userContext.userState]);

  const onPreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setCoverState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || (file.url && file.url.substring(file.url.lastIndexOf('/') + 1)),
    });
  }, [getBase64, setCoverState]);

  const onChange = useCallback((info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      info.fileList[0].url = `${AliyunOSSHost}/${(info.file as any).aliyunOSSFilename}`;
    }
    props.onChange(info.fileList);
    // eslint-disable-next-line
  }, [props.onChange]);

  const onCancel = useCallback(() => {
    setCoverState({ previewVisible: false });
  }, [setCoverState]);

  return (
    <div className="uranus-cover-upload">
      <Upload
        name="file"
        action={AliyunOSSHost}
        listType="picture-card"
        fileList={props.value}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
        onChange={onChange}
        data={getExtraData}
      >
        {
          props.value.length > 0 ?
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