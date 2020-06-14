import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input, message, Result, Row, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { /* SETUSER, */ UserContext } from '../../store/user';
import { ISTSAuthForFormResult } from '../../types';
import { AliyunOSSHost } from '../../utils/constant';
import { stsAuthForForm } from '../../utils/httpClient';

// 样式
import './settings.css';

export const CUserSettings: FC = (props) => {
  const userContext = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(() => {
    if (userContext.userState) {
      return userContext.userState.avatar;
    }

    return '';
  });

  const stsAuthParams = useRef<ISTSAuthForFormResult>({
    OSSAccessKeyId: '',
    policy: '',
    Signature: '',
  });

  useEffect(() => {
    if (userContext.userState) {
      setImageUrl(userContext.userState.avatar);
    }
  }, [userContext.userState]);

  // const onUserSettingsUpdate = useCallback((user: IUserEntity) => {
  //   if (userContext.userDispatch) {
  //     userContext.userDispatch({ type: SETUSER, data: user });
  //   }
  // }, []);

  const getBase64 = useCallback((img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }, []);

  const onPreview = useCallback(async (file: UploadFile<any>) => {
    let src = file.url;

    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();

        if (file.originFileObj) {
          reader.readAsDataURL(file.originFileObj);
        }

        reader.onload = () => {
          return resolve(reader.result as string);
        };
      });
    }

    const image = new Image();

    if (src) {
      image.src = src;
    }

    const imgWindow = window.open(src);

    if (imgWindow) {
      imgWindow.document.write(image.outerHTML);
    }
  }, []);

  const beforeUpload = useCallback(async (file) => {
    if (!userContext.userState) {
      return Promise.reject('请先登录');
    }

    const validImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp';

    if (!validImage) {
      message.error('非法的图片格式');
    }

    const limitSize = file.size / 1024 / 1024 < 2.5;

    if (!limitSize) {
      message.error('图片大小不得超过2.5M');
    }

    try {
      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      const filename = `uranus/user/avatar_${userContext.userState.id}${suffix}`;
      const tokenResult = await stsAuthForForm(filename);
      const sts = tokenResult.data.data as ISTSAuthForFormResult;

      stsAuthParams.current = sts;
    } catch (ex) {
      return Promise.reject('获取sts权限失败');
    }

    if (validImage && limitSize) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('图片不合法'));
    }
  }, [userContext.userState]);

  const transformFile = useCallback((file: RcFile) => {
    // const suffix = file.name.slice(file.name.lastIndexOf('.'));
    // const filename = Date.now() + suffix;
    // file.url = OSSData.dir + filename;

    return file;
  }, []);

  const onChange = useCallback((info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imgUrl: string) => {
        setLoading(false);
        setImageUrl(imgUrl);
      });
    }
  }, []);

  const getExtraData = useCallback((file) => {
    if (!userContext.userState) {
      return Promise.reject('请先登录');
    }

    if (!stsAuthParams.current.OSSAccessKeyId) {
      throw new Error('图片上传授权失败，请刷新页面后重试');
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = `uranus/user/avatar_${userContext.userState.id}${suffix}`;

    return {
      key: filename,
      OSSAccessKeyId: stsAuthParams.current.OSSAccessKeyId,
      policy: stsAuthParams.current.policy,
      Signature: stsAuthParams.current.Signature,
    };
  }, [userContext.userState]);

  if (!userContext.userState) {
    return (
      <Result
        status="403"
        className="uranus-403"
        title="403"
        subTitle="亲, 登录信息已过期..."
      />
    );
  }

  return (
    <div className="uranus-user-settings">
      <Breadcrumb>
        <Breadcrumb.Item>
          <span>用户中心</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          个人设置
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row className="uranus-row uranus-row-first">
        <Col span={4} className="user-settings-label">
          <b>用户头像</b>
        </Col>
        <Col span={20}>
          <ImgCrop rotate>
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={AliyunOSSHost}
              onPreview={onPreview}
              beforeUpload={beforeUpload}
              transformFile={transformFile}
              onChange={onChange}
              data={getExtraData}
            >
              {
                imageUrl ?
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                  (
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  )
              }
            </Upload>
          </ImgCrop>
        </Col>
      </Row>
      <Row className="uranus-row">
        <Col span={4} className="user-settings-label">
          <b>用户昵称</b>
        </Col>
        <Col span={20}>
          <Input
            placeholder="用户昵称，十五个字以内"
          />
        </Col>
      </Row>
      <Row className="uranus-row">
        <Col span={4} className="user-settings-label">
          <b>个性签名</b>
        </Col>
        <Col span={20}>
          <Input
            placeholder="个性签名，三十个字以内"
          />
        </Col>
      </Row>
      <Row className="uranus-row">
        <Col span={4} className="user-settings-label">
          <b>个人简介</b>
        </Col>
        <Col span={20}>
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="个人简介，两百个字以内"
          />
        </Col>
      </Row>
      <Row className="uranus-row">
        <Col span={24} className="user-settings-save">
          <Button
            type="primary"
            size="large"
          >
            保存
          </Button>
        </Col>
      </Row>
    </div>
  );
};