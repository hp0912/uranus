import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { FC, useCallback, useState } from 'react';

const styles = {
  upload: { width: '112px', height: '112px' },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

interface IWatermelonUploadProps {
  dir: string;
  name: string;
  filename: string;
  desc: string;
}

export const WatermelonUpload: FC<IWatermelonUploadProps> = (props) => {
  const [uploadState, setUploadState] = useState({ loading: false, imageURL: '' });

  const onUploadChange = useCallback(info => {
    if (info.file.status === 'uploading') {
      setUploadState(prevState => {
        return { ...prevState, loading: true };
      });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageURL =>
        setUploadState({ loading: false, imageURL })
      );
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 188, margin: '8px 0' }}>
      <div>
        <span>{props.name}({props.desc})</span>
      </div>
      <div style={styles.upload}>
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={onUploadChange}
        >
          {
            uploadState.imageURL ?
              <img src={uploadState.imageURL} alt="avatar" style={{ width: '100%' }} /> :
              (
                <div style={{ color: 'goldenrod' }}>
                  {uploadState.loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>点击上传</div>
                </div>
              )
          }
        </Upload>
      </div>
    </div>
  );
}