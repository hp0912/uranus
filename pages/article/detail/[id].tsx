import { FrownOutlined } from '@ant-design/icons';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Result, Skeleton } from 'antd';
import MarkdownIt from 'markdown-it';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Advertisement01 } from '../../../components/Advertisement/Advertisement01';
import { ArticleDetail } from '../../../components/ArticleDetail';
import { Content } from '../../../components/Content';
import Tocify from '../../../components/Tocify';
import { UranusAvatar } from '../../../components/UranusAvatar';
import { UranusMotto } from '../../../components/UranusMotto';
import { UserContext } from '../../../store/user';
import { IArticleEntity, IUserEntity } from '../../../types';
import { useSetState } from '../../../utils/commonHooks';
import { articleGet, userStatus } from '../../../utils/httpClient';
import { MdHeadingAnchor } from '../../../utils/MdHeadingAnchor';

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

// 样式
import 'highlight.js/styles/an-old-hope.css';
import 'react-markdown-editor-lite/lib/index.css';

interface IArticleProps {
  article: IArticleEntity | null;
  user: IUserEntity | null;
  error: string | null;
  loading: boolean;
}

export default function ArticleDetailPage(props: IArticleProps) {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const articleId = router.query.id as string;
  const token = router.query.token as string;
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

  const [articleState, setArticleState] = useSetState<IArticleProps>(() => {
    const { article, user, error, loading } = props;
    return { article, user, error: error, loading };
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    articleGet(null, articleId, token).then(result => {
      const { article, user } = result.data.data;
      setArticleState({ article, user, error: null, loading: false });
    }).catch((reason: Error) => {
      setArticleState({ article: null, user: null, error: reason.message, loading: false });
    });
    // eslint-disable-next-line
  }, [userContext.userState, articleId, token]);

  const refresh = useCallback(async () => {
    articleGet(null, articleId, token).then(result => {
      const { article, user } = result.data.data;
      setArticleState({ article, user, error: null, loading: false });
    }).catch((reason: Error) => {
      setArticleState({ article: null, user: null, error: reason.message, loading: false });
    });
    // eslint-disable-next-line
  }, [articleId, token]);

  const articleDesc = md.render(articleState.article && articleState.article.desc ? articleState.article.desc : '');
  const articleContent = md.render(articleState.article && articleState.article.content ? articleState.article.content : '');

  return (
    <>
      {
        articleState.article && !articleState.error &&
        (
          <Head>
            <title>{articleState.article.title}</title>
            <meta name="keywords" content={articleState.article.keyword?.join(',')} />
            <meta name="description" property="og:description" content={articleState.article.desc} />
          </Head>
        )
      }
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
                title={articleState.error}
              />
            )
          }
        </Skeleton>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req: { headers } } = context;
  const { id, token } = context.query;
  const ssrHost = process.env.SSR_BASE_URL!;

  try {
    const [
      { data: { data: userState } },
      { data: { data: { article, user } } },
    ] = await Promise.all([
      userStatus(ssrHost, headers),
      articleGet(ssrHost, id as string, token as string, headers),
    ]);

    return {
      props: {
        userState,
        article,
        user,
        error: null,
        loading: false,
      }
    };
  } catch (ex) {
    return {
      props: {
        userState: null,
        article: null,
        user: null,
        error: ex.message,
        loading: false,
      }
    };
  }
};

