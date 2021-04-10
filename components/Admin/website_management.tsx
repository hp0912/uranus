import { Breadcrumb, Button, Col, message, Row, Switch } from 'antd';
import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { reducer, UPDATEWEBSITESETTINGS } from '../../store/websiteSettings';
import { IWebsiteSettingsEntity } from '../../types';
import { websiteSettingsShow, websiteSettingsUpdate } from '../../utils/httpClient';
import { Controlled as CodeMirror } from 'react-codemirror2';

// 样式
import 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';

const CodeMirrorOptions = {
  mode: 'xml',
  theme: 'material',
  lineNumbers: true,
};

const WebsiteManagement: FC = () => {
  const [saving, setSaving] = useState(false);
  const [state, dispatch] = useReducer<(preState: IWebsiteSettingsEntity | null, action: { type: string, data: IWebsiteSettingsEntity | null }) => IWebsiteSettingsEntity | null>(reducer, null);

  useEffect(() => {
    websiteSettingsShow().then(result => {
      dispatch({
        type: UPDATEWEBSITESETTINGS,
        data: result.data.data || { motto: '', advertisement: '', commentReview: false, messageReview: false },
      });
    });
  }, []);

  const onMottoBeforeChange = useCallback((editor, data, value) => {
    dispatch({ type: UPDATEWEBSITESETTINGS, data: { motto: value } });
  }, []);

  const onAdverBeforeChange = useCallback((editor, data, value) => {
    dispatch({ type: UPDATEWEBSITESETTINGS, data: { advertisement: value } });
  }, []);

  const onCommentReviewChange = useCallback((checked: boolean) => {
    dispatch({ type: UPDATEWEBSITESETTINGS, data: { commentReview: checked } });
  }, []);

  const onMessageReviewChange = useCallback((checked: boolean) => {
    dispatch({ type: UPDATEWEBSITESETTINGS, data: { messageReview: checked } });
  }, []);

  const onSaveClick = useCallback(async () => {
    try {
      setSaving(true);

      if (!state?.motto || !state.advertisement) {
        throw new Error('参数不合法');
      }

      const result = await websiteSettingsUpdate(state);
      dispatch({ type: UPDATEWEBSITESETTINGS, data: result.data.data });

      message.success('保存成功');
      setSaving(false);
    } catch (ex) {
      setSaving(false);
    }
  }, [state]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>网站设置</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Row className="uranus-row">
          <Col span={2}>
            价值观：
          </Col>
          <Col span={22}>
            <CodeMirror
              value={state?.motto as string}
              options={CodeMirrorOptions}
              onBeforeChange={onMottoBeforeChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={2}>
            广告：
          </Col>
          <Col span={22}>
            <CodeMirror
              value={state?.advertisement as string}
              options={CodeMirrorOptions}
              onBeforeChange={onAdverBeforeChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={2}>
            评论审核：
          </Col>
          <Col span={22}>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={state?.commentReview}
              onChange={onCommentReviewChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={2}>
            留言审核：
          </Col>
          <Col span={22}>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={state?.messageReview}
              onChange={onMessageReviewChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
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
      </div>
    </>
  );
};

export default WebsiteManagement;
