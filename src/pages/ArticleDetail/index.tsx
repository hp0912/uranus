import { FrownOutlined } from "@ant-design/icons";
import { Result, Skeleton } from "antd";
import MarkdownIt from "markdown-it";
import React, { FC, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Advertisement01 } from '../../components/Advertisement/Advertisement01';
import { ArticleDetail } from '../../components/ArticleDetail';
import { Content } from "../../components/Content";
import { Header } from '../../components/Header';
import Tocify from "../../components/Tocify";
import { UranusAvatar } from '../../components/UranusAvatar';
import { UranusMotto } from '../../components/UranusMotto';
import { UserContext } from "../../store/user";
import { IArticleEntity, IUserEntity } from "../../types";
import { useSetState } from "../../utils/commonHooks";
import { articleGet } from "../../utils/httpClient";
import { MdHeadingAnchor } from "../../utils/MdHeadingAnchor";

// markdown 插件
import hljs from "highlight.js";
import abbr from 'markdown-it-abbr';
import mdcontainer from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import twemoji from 'twemoji';

// 样式
import "highlight.js/styles/an-old-hope.css";
import 'react-markdown-editor-lite/lib/index.css';

interface IArticleState {
  article: IArticleEntity | null;
  user: IUserEntity | null;
  error: Error | null;
  loading: boolean;
}

export const ArticleDetailPage: FC = (props) => {
  const userContext = useContext(UserContext);
  const params = useParams<{ articleId: string }>();

  const tocify = useRef<Tocify>();

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

    _md.use(emoji).use(mark).use(ins).use(abbr).use(footnote).use(sup).use(sub).use(mdcontainer, 'uranus-warning').use(MdHeadingAnchor, { tocify });

    _md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content);
    };

    return _md;
  }, []);

  const [articleState, setArticleState] = useSetState<IArticleState>({
    article: null,
    user: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    articleGet(params.articleId).then(result => {
      const { article, user } = result.data.data;
      setArticleState({ article, user, error: null, loading: false });
    }).catch(reason => {
      setArticleState({ article: null, user: null, error: reason, loading: false });
    });
    // eslint-disable-next-line
  }, [userContext.userState, params.articleId]);

  const refresh = useCallback(async () => {
    articleGet(params.articleId).then(result => {
      const { article, user } = result.data.data;
      setArticleState({ article, user, error: null, loading: false });
    }).catch(reason => {
      setArticleState({ article: null, user: null, error: reason, loading: false });
    });
    // eslint-disable-next-line
  }, [params.articleId]);

  const articleDesc = md.render(articleState.article && articleState.article.desc ? articleState.article.desc : "");
  const articleContent = md.render(articleState.article && articleState.article.content ? articleState.article.content : "");

  return (
    <>
      <Header />
      <Content
        left={(
          <>
            <UranusAvatar />
            <Advertisement01 />
          </>
        )}
        right={(
          <>
            <UranusMotto />
            {tocify.current && tocify.current.tocItems.length > 0 && tocify.current.render()}
          </>
        )}
      >
        <Skeleton active loading={articleState.loading}>
          {
            articleState.article && articleState.user && !articleState.error &&
            (
              <ArticleDetail
                article={articleState.article}
                articleDesc={articleDesc}
                articleContent={articleContent}
                user={articleState.user}
                refresh={refresh}
              />
            )
          }
          {
            articleState.error &&
            (
              <Result
                icon={<FrownOutlined />}
                title={articleState.error.message}
              />
            )
          }
        </Skeleton>
      </Content>
    </>
  );
};

