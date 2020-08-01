import { Avatar, List, message, Tag } from "antd";
import { PaginationConfig } from "antd/lib/pagination";
import MarkdownIt from "markdown-it";
import React, { FC, useCallback, useContext, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { format } from "timeago.js";
import url from 'url';
import { UserContext } from "../../store/user";
import { IArticleEntity, ITagEntity, IUserEntity } from "../../types";
import { useSetState } from "../../utils/commonHooks";
import { DEFAULTAVATAR } from "../../utils/constant";
import { articleList } from "../../utils/httpClient";
import { ArticleActionsLazyLoad } from "../ArticleActions";
import { CoverLazyLoad } from "../CoverLazyLoad";

// markdown 插件
import hljs from "highlight.js";
import abbr from 'markdown-it-abbr';
import emoji from 'markdown-it-emoji';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import twemoji from 'twemoji';

// 样式
import "highlight.js/styles/vs2015.css";
import 'react-markdown-editor-lite/lib/index.css';
import "../components.css";
import "./articleList.css";

interface IArtListParams {
  searchValue: string;
  pagination: PaginationConfig;
}

interface IArticleListState {
  articles: IArticleEntity[];
  userMap: { [userId: string]: IUserEntity };
  tagMap: { [tagId: string]: ITagEntity };
  loading: boolean;
  pagination: PaginationConfig;
}

export const ArticleList: FC = (props) => {
  const userContext = useContext(UserContext);
  const history = useHistory();
  const loca = useLocation();
  const mat = useRouteMatch();

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

  const [articleListState, setArticleListState] = useSetState<IArticleListState>({
    articles: [],
    userMap: {},
    tagMap: {},
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ["15", "50", "100"],
      showQuickJumper: true,
      hideOnSinglePage: true,
      total: 0,
    },
  });

  useEffect(() => {
    return () => {
      const sTop = document.documentElement.scrollTop;
      if (Number.isInteger(sTop)) {
        localStorage.setItem('uranus-scrollTop', sTop + '');
      }
    };
  }, []);

  useEffect(() => {
    const json = url.parse(loca.search, true, false);
    const query = json.query;
    const searchValue = query.searchValue ? query.searchValue as string : '';
    const current = query.current ? query.current as string : '1';
    const pageSize = query.pageSize ? query.pageSize as string : '15';
    const params: IArtListParams = { pagination: { current: Number(current), pageSize: Number(pageSize) }, searchValue };

    getArticleList(params);
  }, [userContext.userState, loca.search]);

  const getArticleList = useCallback(async (params: IArtListParams) => {
    try {
      setArticleListState({ loading: true });

      const articlesResult = await articleList(params);
      const { articles, users, tags, total } = articlesResult.data.data;

      const userMap: { [userId: string]: IUserEntity } = {};
      (users as IUserEntity[]).forEach(user => {
        userMap[user.id as string] = user;
      });

      const tagMap: { [userId: string]: ITagEntity } = {};
      (tags as ITagEntity[]).forEach(tag => {
        tagMap[tag.id as string] = tag;
      });

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

      setTimeout(() => {
        const scrollTop = localStorage.getItem('uranus-scrollTop');

        if (scrollTop) {
          window.scrollTo(0, Number(scrollTop));
        }
      }, 160);
    } catch (ex) {
      message.error(ex.message);
      setArticleListState({ loading: false });
    }
  }, [articleListState]);

  const onPageChange = (page: number, pageSize?: number) => {
    localStorage.setItem('uranus-scrollTop', '0');

    const json = url.parse(loca.search, true, false);
    const query = json.query;

    query.current = page + '';
    query.pageSize = pageSize ? pageSize + '' : '15';
    const search = Object.keys(query).map(key => `${key}=${query[key]}`);

    history.push(`${mat.path}?${search.join("&")}`);
  };

  return (
    <div style={{ paddingBottom: 15 }}>
      <List
        itemLayout="vertical"
        size="large"
        loading={articleListState.loading}
        pagination={{
          ...articleListState.pagination,
          onChange: onPageChange,
        }}
        dataSource={articleListState.articles}
        renderItem={item => (
          <List.Item
            key={item.title}
          >
            <div className="uranus-article-title">
              <div className="user-avatar">
                <Avatar size={50} src={articleListState.userMap[item.createdBy as string] && articleListState.userMap[item.createdBy as string].avatar || DEFAULTAVATAR} />
              </div>
              <div className="article-title">
                <div className="article-title-name">
                  <Link to="/article" className="article-title-link">
                    {item.title}
                  </Link>
                </div>
                <div className="article-title-others">
                  {
                    item.tags && item.tags.map(tagId => {
                      return (
                        <Tag
                          color={articleListState.tagMap[tagId] && articleListState.tagMap[tagId].color}
                          key={tagId}
                        >
                          {articleListState.tagMap[tagId] && articleListState.tagMap[tagId].name || "不存在的标签"}
                        </Tag>
                      );
                    })
                  }
                  <span className="article-title-timeago">
                    {
                      item.createdTime === item.modifyTime ?
                        `${articleListState.userMap[item.createdBy as string] && articleListState.userMap[item.createdBy as string].nickname || "神秘人"} 发表于 ${format(item.createdTime as number, 'zh_CN')}` :
                        `${articleListState.userMap[item.modifyBy as string] && articleListState.userMap[item.modifyBy as string].nickname || "神秘人"} 更新于 ${format(item.modifyTime as number, 'zh_CN')}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <CoverLazyLoad articleId={item.id as string} coverURL={item.coverPicture as string} />
            <div className="custom-html-style" dangerouslySetInnerHTML={{ __html: md.render(item.desc || "这家伙很懒，什么都没留下") }} />
            <ArticleActionsLazyLoad article={item} />
          </List.Item>
        )}
      />
    </div>
  );
};
