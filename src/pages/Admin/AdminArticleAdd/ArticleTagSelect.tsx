import { Select, Tag } from 'antd';
import { CustomTagProps } from 'rc-select/lib//interface/generator';
import React, { FC } from 'react';

interface IProps {
  value?: number;
  onChange?: (value: number) => void;
  tagOptions: any[];
}

function tagRender(subProps: CustomTagProps) {
  const { label, value, closable, onClose } = subProps;

  return (
    <Tag color={value as string} closable={closable} onClose={onClose} style={{ marginRight: 5 }}>
      {label}
    </Tag>
  );
}

export const ArticleTagSelect: FC<IProps> = (props) => {
  const options = [{ value: 'gold', v: 1 }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];

  function onChange() {
    // console.log(arguments);
  }

  return (
    <Select
      className="uranus-article-tag-select"
      mode="multiple"
      placeholder="文章标签"
      maxTagCount={3}
      maxTagTextLength={20}
      tagRender={tagRender}
      options={options}
      value={props.value}
      onChange={onChange}
    />
  );
};