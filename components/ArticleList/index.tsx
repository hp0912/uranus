import { Avatar, List, message, Tag } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import MarkdownIt from 'markdown-it';
import React, { FC, useContext, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'timeago.js';
import { UserContext } from '../../store/user';
import { ArticleCategory, IArticleEntity, ITagEntity, IUserEntity } from '../../types';
import { useSetState } from '../../utils/commonHooks';
import { DEFAULTAVATAR, defaultPageSize } from '../../utils/constant';
import { articleList } from '../../utils/httpClient';
import { ArticleActionsLazyLoad } from '../ArticleActions';
import { CoverLazyLoad } from '../CoverLazyLoad';
import { ParsedUrlQuery } from 'node:querystring';

// markdown 插件
import hljs from 'highlight.js';
import abbr from 'markdown-it-abbr';
import emoji from 'markdown-it-emoji';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import twemoji from 'twemoji';

// 样式
import 'highlight.js/styles/an-old-hope.css';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './articleList.module.css';

export interface IArtListParams {
  category: ArticleCategory;
  searchValue: string;
  pagination: PaginationConfig;
}

export interface IArticleListProps {
  category: ArticleCategory;
  articles: IArticleEntity[],
  users: IUserEntity[],
  tags: ITagEntity[],
  total: number;
  current: number,
  pageSize: number,
}

interface IArticleListState {
  articles: IArticleEntity[];
  userMap: { [userId: string]: IUserEntity };
  tagMap: { [tagId: string]: ITagEntity };
  loading: boolean;
  pagination: PaginationConfig;
}

function Array2Map<T extends { id?: string }>(arr: T[]): { [id: string]: T } {
  const dataMap: { [id: string]: T } = {};
  arr.forEach(data => {
    dataMap[data.id!] = data;
  });
  return dataMap;
}

export function parseQuery(query: ParsedUrlQuery): { current: number, pageSize: number, searchValue: string } {
  const { keyword: search, current: cur, pageSize: size } = query;

  let searchValue = '';
  if (typeof search === 'string') {
    searchValue = search;
  } else if (search instanceof Array) {
    searchValue = search[0];
  }

  let current = 1;
  if (typeof cur === 'string') {
    current = Number(cur) || 1;
  } else if (cur instanceof Array) {
    current = Number(cur[0]);
  }

  let pageSize: number = defaultPageSize;
  if (typeof size === 'string') {
    pageSize = Number(size);
  } else if (size instanceof Array) {
    pageSize = Number(size[0]);
  }

  return { current, pageSize, searchValue };
}

export const ArticleList: FC<IArticleListProps> = (props) => {
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

    _md.use(emoji).use(mark).use(ins).use(abbr).use(sup).use(sub);

    _md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content);
    };

    return _md;
  }, []);

  const [articleListState, setArticleListState] = useSetState<IArticleListState>(() => {
    const { articles, tags, users, total, current, pageSize } = props;
    const userMap = Array2Map(users);
    const tagMap = Array2Map(tags);

    return {
      articles,
      userMap,
      tagMap,
      loading: false,
      pagination: {
        current,
        pageSize,
        showQuickJumper: false,
        hideOnSinglePage: true,
        total,
      },
    };
  });

  const getArticleList = async (params: IArtListParams) => {
    try {
      setArticleListState({ loading: true });

      const articlesResult = await articleList(params);
      const { articles, users, tags, total } = articlesResult.data.data;
      const userMap = Array2Map(users as IUserEntity[]);
      const tagMap = Array2Map(tags as ITagEntity[]);

      setArticleListState({
        loading: false,
        articles,
        userMap,
        tagMap,
        pagination: {
          ...articleListState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setArticleListState({ loading: false });
    }
  };

  const isFirstRender = useRef(true);
  const artListRef = useRef<(params: IArtListParams) => Promise<void>>(getArticleList);
  artListRef.current = getArticleList;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const { current, pageSize, searchValue } = parseQuery(router.query);
    const params: IArtListParams = { category: props.category, pagination: { current, pageSize }, searchValue };

    artListRef.current(params);
    // eslint-disable-next-line
  }, [userContext.userState, props.category, router.query.current, router.query.pageSize, router.query.searchValue]);

  return (
    <div style={{ paddingBottom: 15 }}>
      <List
        itemLayout="vertical"
        size="large"
        loading={articleListState.loading}
        pagination={{
          ...articleListState.pagination,
          itemRender: (
            page: number,
            type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
            originalElement: React.ReactElement<HTMLElement, string | React.JSXElementConstructor<any>>,
          ) => {
            const { pageSize, searchValue } = parseQuery(router.query);
            return (
              <Link href={`${router.pathname}?current=${page}&pageSize=${pageSize}${searchValue ? `&keyword=${searchValue}` : ''}`}>
                {originalElement}
              </Link>
            );
          },
        }}
        dataSource={articleListState.articles}
        renderItem={item => (
          <List.Item
            key={item.title}
          >
            <div className={styles.title}>
              <div className={styles.user_avatar}>
                <Avatar size={50} src={articleListState.userMap[item.createdBy!] ? articleListState.userMap[item.createdBy!].avatar : DEFAULTAVATAR} />
              </div>
              <div className={styles.article_title}>
                <div className={styles.article_title_name}>
                  <Link href={`/article/detail/${item.id!}`}>
                    <a className={styles.article_title_link}>{item.title}</a>
                  </Link>
                </div>
                <div className={styles.article_title_others}>
                  {
                    item.tags && item.tags.map(tagId => {
                      return (
                        <Tag
                          color={articleListState.tagMap[tagId] ? articleListState.tagMap[tagId].color : undefined}
                          key={tagId}
                        >
                          {articleListState.tagMap[tagId] ? articleListState.tagMap[tagId].name : '不存在的标签'}
                        </Tag>
                      );
                    })
                  }
                  <span className={styles.article_title_timeago}>
                    {
                      item.createdTime === item.modifyTime ?
                        `${articleListState.userMap[item.createdBy!] ? articleListState.userMap[item.createdBy!].nickname : '神秘人'} 发表于 ${format(item.createdTime!, 'zh_CN')}` :
                        `${articleListState.userMap[item.modifyBy!] ? articleListState.userMap[item.modifyBy!].nickname : '神秘人'} 更新于 ${format(item.modifyTime as number, 'zh_CN')}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <CoverLazyLoad articleId={item.id!} coverURL={item.coverPicture!} />
            <div className="custom-html-style" dangerouslySetInnerHTML={{ __html: md.render(item.desc || '这家伙很懒，什么都没留下') }} />
            <ArticleActionsLazyLoad article={item} />
          </List.Item>
        )}
      />
    </div>
  );
};
