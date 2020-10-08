import { Button, Col, Input, message, Modal, Row, Tooltip } from "antd";
import GIF from 'gif.js';
import React, { FC, useCallback, useRef, useState } from "react";
import { useSetState } from "../../utils/commonHooks";
import { VideoIcon } from "./VideoIcon";

export const Video2GIF: FC = (props) => {
  const [visible, setVisible] = useState(false);
  const [videoState, setVideoState] = useSetState<{ fileName: string, videoSrc: string, progress: string }>({ fileName: '', videoSrc: '', progress: '' });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [gifSrc, setGifSrc] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = React.createRef<HTMLInputElement>();
  const fileRef = useRef<File>();

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onShow = useCallback(() => {
    setVisible(true);
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
    setVideoState({ fileName: '', videoSrc: '', progress: '' });
    setPreviewVisible(false);
    setGifSrc('');
    setLoading(false);
  }, []);

  const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || !files.length) {
      fileRef.current = undefined;
      return false;
    }

    const file = files[0];
    fileRef.current = file;
    setVideoState({ fileName: file.name, videoSrc: URL.createObjectURL(file) });
    setPreviewVisible(true);
    // eslint-disable-next-line
  }, []);

  const isSameFrame = useCallback((a: ImageData, b: ImageData) => {
    if (a.data.length !== b.data.length) {
      return false;
    }

    const max = a.data.length;

    for (let i = 0; i < max; i++) {
      if (a.data[i] !== b.data[i]) {
        return false;
      }
    }

    return true;
  }, []);

  const createVideo = useCallback((url: string): Promise<HTMLVideoElement> => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.src = url;
    video.width = 800;

    setVideoState({ progress: '视频加载中...' });

    return new Promise((resolve, reject) => {
      video.onerror = reject;
      video.addEventListener('loadeddata', () => resolve(video));
    });
    // eslint-disable-next-line
  }, []);

  const encodeGIF = useCallback(async (video: HTMLVideoElement): Promise<Blob> => {
    setVideoState({ progress: '视频准备中...' });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = video.videoWidth;
    const widthRatio = width / video.videoWidth;
    let height = (canvas.height = widthRatio * video.videoHeight);

    if (width / 500 > 1) {
      height = height / (width / 500);
      width = 500;
    }

    const gif = new GIF({ width, height, workers: 4, workerScript: 'gif.worker.js' });

    return new Promise((resolve, reject) => {
      let lastTime = video.currentTime;
      let lastPixels: ImageData;

      const capture = () => {
        ctx!.drawImage(video, 0, 0, width, height);
        const pixels = ctx!.getImageData(0, 0, width, height);
        const duration = video.currentTime - lastTime;

        // tslint:disable-next-line: no-bitwise
        setVideoState({ progress: `视频抓取中: ${(video.currentTime / video.duration * 100) | 0}%...` });

        if (!lastPixels || !isSameFrame(lastPixels, pixels)) {
          lastPixels = pixels;
          lastTime = video.currentTime;
          gif.addFrame(canvas, { copy: true, delay: duration * 1000 });
        }
        if (!video.ended) {
          requestAnimationFrame(capture);
        } else {
          gif.render();
        }
      };

      requestAnimationFrame(capture);

      gif.on('finished', blob => {
        resolve(blob);
      });

      gif.on('progress', p => {
        if (p === 1) {
          setVideoState({ progress: `视频转换完毕!` });
        } else {
          // tslint:disable-next-line: no-bitwise
          setVideoState({ progress: `视频转换中: ${(p * 100) | 0}%...` });
        }
      });

      video.play();
      video.onerror = reject;
    });
    // eslint-disable-next-line
  }, []);

  const onConvertClick = async () => {
    if (!fileRef.current) {
      message.error('请选择要转换的视频文件');
      return;
    }

    setLoading(true);
    setGifSrc('');

    const video = await createVideo(videoState.videoSrc);
    const time = video.duration;
    let flag = true;

    if (time > 60) {
      await new Promise((resolve, reject) => {
        Modal.confirm({
          title: '温馨提醒',
          content: '当前视频长度大于一分钟，如果继续转换可能会导致电脑的性能占用过高，是否继续?',
          onOk: () => {
            flag = true;
            resolve();
          },
          onCancel: () => {
            flag = false;
            resolve();
          },
        });
      });
    }

    if (flag) {
      const blob = await encodeGIF(video);
      const gifUrl = URL.createObjectURL(blob);
      setGifSrc(gifUrl);
    } else {
      setVideoState({ progress: '' });
    }

    setLoading(false);
  };

  return (
    <>
      <Tooltip title="视频转gif">
        <VideoIcon onClick={onShow} />
      </Tooltip>
      <Modal
        visible={visible}
        title="视频转gif"
        destroyOnClose
        footer={null}
        onCancel={onCancel}
      >
        <Row>
          <Col span={19}>
            <Input value={videoState.fileName} placeholder="点击这里上传视频" readOnly onClick={onUploadClick} />
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".mp4, .ogg, .webm" onChange={onFileChange} />
          </Col>
          <Col span={5}>
            <Button type="primary" onClick={onConvertClick} loading={loading}>开始转换</Button>
          </Col>
        </Row>
        {
          previewVisible &&
          (
            <Row>
              <Col span={24}>
                <p style={{ margin: "15px 0" }}><b>预览</b></p>
                <video style={{ width: "100%" }} src={videoState.videoSrc} controls preload="true" />
              </Col>
            </Row>
          )
        }
        {
          videoState.progress !== '' &&
          (
            <Row>
              <Col span={24}>
                <p style={{ margin: "15px 0", color: "#f7cf02" }}>{videoState.progress}</p>
              </Col>
            </Row>
          )
        }
        {
          gifSrc !== '' &&
          (
            <Row>
              <Col span={24}>
                <a href={gifSrc} target="_blank" rel="noopener noreferrer">
                  <img style={{ width: "100%" }} src={gifSrc} alt="gif" />
                </a>
              </Col>
            </Row>
          )
        }
        <Row>
          <Col span={24}>
            <p style={{ margin: "15px 0 8px 0" }}><b>说明</b></p>
            <p style={{ margin: "8px 0", color: "#2b95e2" }}>全部转换均在浏览器内进行，不会消耗设备流量</p>
            <p style={{ marginTop: 8, marginBottom: 0, color: "#2b95e2" }}>如果转换时间过长请使用其他浏览器尝试，推荐使用Chrome</p>
          </Col>
        </Row>
      </Modal>
    </>
  );
};