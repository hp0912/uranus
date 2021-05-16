import OSS from 'ali-oss';
import { Affix, Breadcrumb, Button, Col, Input, InputNumber, message, Modal, Row, Select, Skeleton, Switch } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import MarkdownIt from 'markdown-it';
import React, { FC, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import MdEditor from 'react-markdown-editor-lite';
import { HtmlType } from 'react-markdown-editor-lite/editor/preview';
import { reducer, UPDATEARTICLE } from '../../store/articleEdit';
import { UserContext } from '../../store/user';
import { ArticleCategory, IArticleEntity, ITagEntity, ShareWith } from '../../types';
import { AliyunOSSDir, AliyunOSSHost } from '../../utils/constant';
import { articleGet, articleSave, stsAuth, tagList } from '../../utils/httpClient';
import { CoverUpload } from './CoverUpload';
import { UranusPrompt } from '../UranusPrompt';

// 图标
import { SaveOutlined } from '@ant-design/icons';

// markdown 插件
import hljs from 'highlight.js';
import abbr from 'markdown-it-abbr';
import mdcontainer from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import twemoji from 'twemoji';

// css
import 'highlight.js/styles/an-old-hope.css';
import 'react-markdown-editor-lite/lib/index.css';
import styles from '../components.module.css';

const css = {
  MdEditor: { height: '800px' },
};

const articleInit: IArticleEntity = {
  title: '',
  category: undefined,
  coverPicture: '',
  desc: '',
  content: '',
  tags: [],
  charge: false,
  amount: 0,
  shareWith: ShareWith.private,
};

const { TextArea } = Input;

interface IArticleEditProps {
  breadcrumbClassName?: string;
}

const ArticleEdit: FC<IArticleEditProps> = (props) => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  // MarkdownIt
  const md = useMemo<MarkdownIt>(() => {
    const _md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      langPrefix: 'uranus-article-code hljs ',
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });

    _md.use(emoji).use(mark).use(ins).use(abbr).use(footnote).use(sup).use(sub).use(mdcontainer, 'uranus-warning');

    _md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content);
    };

    return _md;
  }, []);

  const [initLoading, setInitLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<ITagEntity[]>([]);
  const [coverPicture, setCoverPicture] = useState<UploadFile[]>([]);
  const [state, dispatch] = useReducer<(preState: IArticleEntity | null, action: { type: string, data: IArticleEntity | null }) => IArticleEntity | null>(reducer, null);

  const unsavedChanges = useRef(false);

  useEffect(() => {
    if (router.query.id === 'new') {
      Promise.all([
        Promise.resolve<IArticleEntity>(articleInit),
        tagList(),
      ]).then(([article, tagsResult]) => {
        setTags(tagsResult.data.data);
        setCoverPicture([]);
        dispatch({ type: UPDATEARTICLE, data: article });
        setInitLoading(false);
      }).catch((reason: Error) => {
        Modal.error({
          title: '错误',
          content: reason.message,
        });
      });
    } else {
      Promise.all([
        articleGet(null, router.query.id as string),
        tagList(),
      ]).then(([articleResult, tagsResult]) => {
        setTags(tagsResult.data.data);
        const { article } = articleResult.data.data;
        dispatch({ type: UPDATEARTICLE, data: article });

        const coverPic = article.coverPicture;
        const filename = coverPic.slice(coverPic.lastIndexOf('/'));
        const fileType = filename.slice(filename.lastIndexOf('.'));

        setCoverPicture([{
          uid: article.createdBy,
          size: 0,
          name: filename,
          type: `image/${fileType}`,
          url: coverPic,
          status: 'done',
        }]);
        setInitLoading(false);
      }).catch((reason: Error) => {
        Modal.error({
          title: '错误',
          content: reason.message,
        });
      });
    }
  }, [router.query.id]);

  const onTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { title: event.target.value } });
  }, []);

  const onCoverChange = useCallback((fileList: UploadFile[]) => {
    unsavedChanges.current = true;
    setCoverPicture(fileList);
  }, []);

  const onTagChange = useCallback((value: string[]) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { tags: value } });
  }, []);

  const handlekeywordChange = useCallback((value: string[]) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { keyword: value } });
  }, []);

  const onShareWithChange = useCallback((value: ShareWith) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { shareWith: value } });
  }, []);

  const onCategoryChange = useCallback((value: ArticleCategory) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { category: value } });
  }, []);

  const onDescChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { desc: event.target.value } });
  }, []);

  const renderHTML = useCallback<(text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType)>((text) => {
    return md.render(text);
  }, [md]);

  const onChargeChange = useCallback((checked: boolean) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: checked ? { charge: checked } : { charge: checked, amount: 0 } });
  }, []);

  const onAmountChange = useCallback((value: string | number | null | undefined) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { amount: value as number } });
  }, []);

  const onEditorChange = useCallback((data: {
    text: string;
    html: string;
  }) => {
    unsavedChanges.current = true;
    dispatch({ type: UPDATEARTICLE, data: { content: data.text } });
  }, []);

  const onImageUpload = useCallback(async (file: File) => {
    try {
      if (!userContext.userState) {
        return Promise.reject('请先登录');
      }

      const stsResult = await stsAuth();
      const { AccessKeyId, AccessKeySecret, SecurityToken } = stsResult.data.data;
      const client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: 'uranus-houhou',
        secure: true,
      });

      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      const filename = `${AliyunOSSDir}/${userContext.userState.id}/article_picture_${new Date().getTime()}${suffix}`;

      await client.put(filename, file);

      return `${AliyunOSSHost}/${filename}`;
    } catch (ex) {
      return 'https://img.houhoukang.com/uranus/system/upload-failed.png';
    }
  }, [userContext.userState]);

  const onSaveClick = useCallback(async () => {
    try {
      setSaving(true);

      if (state?.title === '' || state?.content === '') {
        throw new Error('文章标题、内容不能为空');
      }

      if (state?.title && state.title.length > 50) {
        throw new Error('文章标题不能超过50个字');
      }

      if (!coverPicture.length) {
        throw new Error('文章封面不能为空');
      } else if (coverPicture[0].url && !coverPicture[0].url.match(/\.(?:jpeg|jpg|png|webp|bmp|gif|svg)$/)) {
        throw new Error('文章封面格式不合法');
      }

      const result = await articleSave({
        id: router.query.id === 'new' ? 'new' : state?.id,
        title: state?.title,
        category: state?.category,
        coverPicture: coverPicture[0].url,
        desc: state?.desc,
        content: state?.content,
        tags: state?.tags,
        keyword: state?.keyword,
        charge: state?.charge,
        amount: state?.amount,
        shareWith: state?.shareWith,
      });

      unsavedChanges.current = false;
      setSaving(false);

      if (state?.shareWith === ShareWith.private) {
        message.success('保存成功');
      } else {
        if (userContext.userState && userContext.userState?.accessLevel < 7) {
          Modal.success({
            content: '保存成功，等待管理员审核',
          });
        } else if (userContext.userState) {
          message.success('保存成功');
        }
      }

      if (router.query.id === 'new') {
        const baseURL = router.basePath;
        router.push(`${baseURL}${result.data.data.id}`);
      }
    } catch (ex) {
      Modal.error({
        title: '保存失败',
        content: ex.message as string,
      });
      setSaving(false);
    }
  }, [state, coverPicture, router.query.id, router, userContext.userState]);

  return (
    <>
      <Breadcrumb className={props.breadcrumbClassName ? props.breadcrumbClassName : 'uranus-admin-breadcrumb'}>
        <Breadcrumb.Item>编辑文章</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Skeleton loading={initLoading}>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <Input placeholder="文章标题" value={state?.title} onChange={onTitleChange} />
            </Col>
          </Row>
          <Row style={{ rowGap: 0 }}>
            <Col span={24}>
              <Select placeholder="文章类别" className="uranus-row-select" value={state?.category} onChange={onCategoryChange}>
                <Select.Option value={ArticleCategory.frontend}>
                  前端优选
                </Select.Option>
                <Select.Option value={ArticleCategory.gossip}>
                  神秘空间
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ rowGap: 0 }}>
            <Col span={24}>
              <CoverUpload value={coverPicture} onChange={onCoverChange} />
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <Select
                mode="multiple"
                className="uranus-row-select"
                placeholder="文章标签"
                value={state?.tags}
                onChange={onTagChange}
              >
                {
                  tags.map(tag => {
                    return (
                      <Select.Option key={tag.id} value={tag.id as string}>{tag.name}</Select.Option>
                    );
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <Select mode="tags" className="uranus-row-select" placeholder="SEO 关键词" value={state?.keyword} onChange={handlekeywordChange}>
                {
                  state?.keyword?.map(kw => {
                    return (
                      <Select.Option key={kw} value={kw}>{kw}</Select.Option>
                    );
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <Select placeholder="文章可见范围" className="uranus-row-select" value={state?.shareWith} onChange={onShareWithChange}>
                <Select.Option value={ShareWith.private}>
                  仅自己可见
                </Select.Option>
                <Select.Option value={ShareWith.public}>
                  所有人可见
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <TextArea
                value={state?.desc}
                onChange={onDescChange}
                placeholder="文章描述，支持markdown"
                autoSize={{ minRows: 10, maxRows: 30 }}
              />
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <Switch
                checkedChildren="付费阅读"
                unCheckedChildren="免费阅读"
                checked={state?.charge}
                onChange={onChargeChange}
              />
              <InputNumber className={styles.uranus_article_amount} placeholder="付费金额 [元]" min={0.01} disabled={!state?.charge} value={state?.amount} precision={2} onChange={onAmountChange} />
            </Col>
          </Row>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={24}>
              <MdEditor
                value={state?.content}
                style={css.MdEditor}
                renderHTML={renderHTML}
                onChange={onEditorChange}
                onImageUpload={onImageUpload}
              />
            </Col>
          </Row>
        </Skeleton>
        <Row className="uranus-row" style={{ rowGap: 0 }}>
          <Col span={24} className="save">
            <Affix offsetBottom={5}>
              <Button
                size="large"
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                disabled={initLoading}
                onClick={onSaveClick}
              >
                保存
              </Button>
            </Affix>
          </Col>
        </Row>
        <UranusPrompt hasChange={unsavedChanges.current} />
      </div>
    </>
  );
};

export default ArticleEdit;