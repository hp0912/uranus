import { Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { FC, useState } from 'react';

interface IWatermelonUploadProps {
  dir: string;
  name: string;
  filename: string;
  desc: string;
  width: number;
  height: number;
  isCircle: boolean;
  onChange: (data: { dir: string, filename: string, blob: Blob | null }) => void;
}

export const WatermelonUpload: FC<IWatermelonUploadProps> = (props) => {
  const [uploadState, setUploadState] = useState({ imageURL: '' });

  const fileInput = React.createRef<HTMLInputElement>();

  const onUploadClick = () => {
    fileInput.current?.click();
  };

  const squareImage = async (img: HTMLImageElement): Promise<{ imgBlob: Blob | null, imgURL: string }> => {
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) { // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
      Modal.error({ title: '浏览器版本太低', content: '浏览器版本太低，暂不支持图片裁剪' });
      return { imgBlob: null, imgURL: '' };
    }

    canvas.width = props.width;
    canvas.height = props.height;
    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, props.width, props.height);
    context?.save();
    context?.beginPath();

    let naturalWidth = 0;
    let naturalHeight = 0;

    const r = props.height / props.width;
    if (img.naturalHeight / img.naturalWidth > r) {
      naturalWidth = img.naturalWidth;
      naturalHeight = naturalWidth * r;
    } else {
      naturalHeight = img.naturalHeight;
      naturalWidth = naturalHeight / r;
    }

    context?.drawImage(img, 0, 0, naturalWidth, naturalHeight, 0, 0, props.width, props.height);
    context?.restore();

    const imgBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob: Blob | null) => {
        resolve(blob);
      },
        'image/png'
      );
    });
    const imgURL = canvas.toDataURL('image/png');

    return { imgBlob, imgURL };
  }

  const circleImage = async (img: HTMLImageElement): Promise<{ imgBlob: Blob | null, imgURL: string }> => {
    let radius = 0;
    if (props.width > props.height) {
      radius = props.width / 2;
    } else {
      radius = props.height / 2;
    }

    const diameter = radius * 2;

    const canvas = document.createElement('canvas');
    if (!canvas.getContext) { // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
      Modal.error({ title: '浏览器版本太低', content: '浏览器版本太低，暂不支持图片裁剪' });
      return { imgBlob: null, imgURL: '' };
    }

    canvas.width = diameter;
    canvas.height = diameter;
    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, diameter, diameter);
    context?.save();
    context?.beginPath();
    context?.arc(radius, radius, radius, 0, Math.PI * 2, false);
    context?.clip();

    let natural = 0;
    if (img.naturalWidth > img.naturalHeight) {
      natural = img.naturalHeight;
    } else {
      natural = img.naturalWidth;
    }

    context?.drawImage(img, 0, 0, natural, natural, 0, 0, props.width, props.height);
    context?.restore();

    const imgBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob: Blob | null) => {
        resolve(blob);
      },
        'image/png'
      );
    });
    const imgURL = canvas.toDataURL('image/png');

    return { imgBlob, imgURL };
  }

  const onUploadChange: React.ChangeEventHandler<HTMLInputElement> = function (ev) {
    const fr = new FileReader();
    fr.readAsDataURL(ev?.target?.files![0]);
    fr.onload = function (fev) {
      const img = new Image();
      img.src = fev.target?.result as string;
      img.onload = () => {
        if (props.isCircle) {
          circleImage(img).then(result => {
            setUploadState({ imageURL: result.imgURL });
            props.onChange({ dir: props.dir, filename: props.filename, blob: result.imgBlob });
          });
        } else {
          squareImage(img).then(result => {
            setUploadState({ imageURL: result.imgURL });
            props.onChange({ dir: props.dir, filename: props.filename, blob: result.imgBlob });
          });
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 188, margin: '8px 0' }}>
      <div>
        <span>{props.name}({props.desc})</span>
      </div>
      <div style={{
        width: '112px',
        height: '112px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        border: '1px dashed #d9d9d9',
        borderRadius: '2px',
        cursor: 'pointer',
      }}>
        {
          uploadState.imageURL ?
            <img src={uploadState.imageURL} alt="avatar" style={{ width: '98%', height: '98%', cursor: 'pointer' }} onClick={onUploadClick} /> :
            (
              <div style={{ color: 'goldenrod', textAlign: 'center' }} onClick={onUploadClick}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>点击上传</div>
              </div>
            )
        }
        <input type="file" style={{ display: 'none' }} ref={fileInput} onChange={onUploadChange} />
      </div>
    </div>
  );
}