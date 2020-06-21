import React, { FC, useEffect, useState } from "react";
import { websiteMotto } from "../../utils/httpClient";

// 样式
import "../components.css";
import "./uranusMotto.css";

export const UranusMotto: FC = (props) => {
  const [motto, setMotto] = useState(() => {
    return `
      <p class="uranus-motto-item">楼道角落里阳光每天盛开</p>
      <p class="uranus-motto-item">你很久前也在</p>
      <p class="uranus-motto-item">很久前的花肥肥地开在窗外</p>
      <p class="uranus-motto-item">你很久前也毛茸茸地在窗里开</p>
      <p class="uranus-motto-item">它们为什么能长盛不衰</p>
      <p class="uranus-motto-item">我们为什么屡战屡败</p>
      <p class="uranus-motto-item">——冯唐《记梦》</p>
    `;
  });

  useEffect(() => {
    websiteMotto().then(result => {
      setMotto(result.data.data);
    });
  }, []);

  return (
    <div className="uranus-card">
      <div className="uranus-motto" dangerouslySetInnerHTML={{ __html: motto }} />
    </div>
  );
};