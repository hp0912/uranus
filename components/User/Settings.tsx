import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input, message, Modal, Result, Row, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SETUSER, UserContext } from '../../store/user';
import { ISTSAuthForFormResult, IUserEntity } from '../../types';
import { AliyunOSSDir, AliyunOSSHost } from '../../utils/constant';
import { stsAuthForForm, updateUserProfile } from '../../utils/httpClient';

// 样式
import 'antd/lib/slider/style/index.css';
import styles from './user.module.css';
import { UranusPrompt } from '../UranusPrompt';

export const CUserSettings: FC = (props) => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<IUserEntity | null>(() => {
    if (userContext.userState) {
      return userContext.userState;
    }

    return null;
  });

  const unsavedChanges = useRef(false);
  const stsAuthParams = useRef<ISTSAuthForFormResult>({
    OSSAccessKeyId: '',
    policy: '',
    Signature: '',
  });

  useEffect(() => {
    if (userContext.userState) {
      setUserProfile(userContext.userState);
    }
  }, [userContext.userState]);

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

  const beforeUpload = useCallback(async (file: RcFile, FileList: RcFile[]) => {
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
      const filename = `avatar_${new Date().getTime()}${suffix}`;
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
      return Promise.resolve(file);
    } else {
      return Promise.reject(new Error('图片不合法'));
    }
  }, [userContext.userState]);

  const onChange = useCallback((info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      setLoading(false);
      unsavedChanges.current = true;

      const newUserProfile = Object.assign({}, userProfile);
      newUserProfile.avatar = `${AliyunOSSHost}/${(info.file as any).aliyunOSSFilename}`;

      setUserProfile(newUserProfile);
    }
  }, [userProfile]);

  const onNicknameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserProfile = Object.assign({}, userProfile);
    newUserProfile.nickname = event.target.value;
    unsavedChanges.current = true;
    setUserProfile(newUserProfile);
  }, [userProfile]);

  const onSignatureChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserProfile = Object.assign({}, userProfile);
    newUserProfile.signature = event.target.value;
    unsavedChanges.current = true;
    setUserProfile(newUserProfile);
  }, [userProfile]);

  const onPersonalProfileChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUserProfile = Object.assign({}, userProfile);
    newUserProfile.personalProfile = event.target.value;
    unsavedChanges.current = true;
    setUserProfile(newUserProfile);
  }, [userProfile]);

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

  const onSaveClick = useCallback(async () => {
    try {
      setSaving(true);

      if (!userProfile?.avatar) {
        throw new Error('用户头像不能为空');
      }

      if (!userProfile?.nickname) {
        throw new Error('用户昵称不能为空');
      }

      if (userProfile?.nickname.length > 7) {
        throw new Error('用户昵称不能大于7个字符');
      }

      if (userProfile?.signature && userProfile.signature.length > 30) {
        throw new Error('用户签名不能大于30个字符');
      }

      if (userProfile?.personalProfile && userProfile.personalProfile.length > 200) {
        throw new Error('用户简介不能大于200个字符');
      }

      const result = await updateUserProfile(userProfile);

      setSaving(false);
      unsavedChanges.current = false;
      message.success('保存成功');

      if (userContext.userDispatch) {
        userContext.userDispatch({ type: SETUSER, data: result.data.data });
      }
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: '保存失败: ' + ex.message,
      });
      setSaving(false);
    }
  }, [userContext, userProfile]);

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
    <div className={styles.uranus_user_settings}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <span>用户中心</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          个人设置
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row className="uranus-row uranus-row-first" style={{ rowGap: 0 }}>
        <Col span={4} className={styles.user_settings_label}>
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
              onChange={onChange}
              data={getExtraData}
            >
              {
                userProfile && userProfile.avatar ?
                  <img src={userProfile.avatar} alt="avatar" style={{ width: '100%' }} /> :
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
      <Row className="uranus-row" style={{ rowGap: 0 }}>
        <Col span={4} className={styles.user_settings_label}>
          <b>用户昵称</b>
        </Col>
        <Col span={20}>
          <Input
            placeholder="用户昵称，七个字以内"
            value={userProfile && userProfile.nickname ? userProfile.nickname : ''}
            onChange={onNicknameChange}
          />
        </Col>
      </Row>
      <Row className="uranus-row" style={{ rowGap: 0 }}>
        <Col span={4} className={styles.user_settings_label}>
          <b>个性签名</b>
        </Col>
        <Col span={20}>
          <Input
            placeholder="个性签名，三十个字以内"
            value={userProfile && userProfile.signature ? userProfile.signature : ''}
            onChange={onSignatureChange}
          />
        </Col>
      </Row>
      <Row className="uranus-row" style={{ rowGap: 0 }}>
        <Col span={4} className={styles.user_settings_label}>
          <b>个人简介</b>
        </Col>
        <Col span={20}>
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="个人简介，两百个字以内"
            value={userProfile && userProfile.personalProfile ? userProfile.personalProfile : ''}
            onChange={onPersonalProfileChange}
          />
        </Col>
      </Row>
      <Row className="uranus-row" style={{ rowGap: 0 }}>
        <Col span={24} className="save">
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={onSaveClick}
          >
            保存
          </Button>
        </Col>
      </Row>
      <UranusPrompt hasChange={unsavedChanges.current} />
    </div>
  );
};