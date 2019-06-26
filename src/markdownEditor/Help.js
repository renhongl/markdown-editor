import React from "react";

export default () => (
  <div style={{ width: "550px", fontSize: "13px" }}>
    <p>
      <span className="help-key">标题一：</span>
      <span className="help-value"># 标题一</span>
    </p>
    <p>
      <span className="help-key">标题二：</span>
      <span className="help-value">## 标题二</span>
    </p>
    <p>
      <span className="help-key">标题三：</span>
      <span className="help-value">### 标题三</span>
    </p>
    <p>
      <span className="help-key">标题四：</span>
      <span className="help-value">#### 标题四</span>
    </p>
    <p>
      <span className="help-key">标题五：</span>
      <span className="help-value">##### 标题五</span>
    </p>
    <p>
      <span className="help-key">标题六：</span>
      <span className="help-value">###### 标题六</span>
    </p>
    <p>
      <span className="help-key">加粗：</span>
      <span className="help-value">**加粗**</span>
    </p>
    <p>
      <span className="help-key">斜体：</span>
      <span className="help-value">*斜体*</span>
    </p>
    <p>
      <span className="help-key">斜体加粗：</span>
      <span className="help-value">***斜体加粗***</span>
    </p>
    <p>
      <span className="help-key">删除线：</span>
      <span className="help-value">~~删除线~~</span>
    </p>
    <p>
      <span className="help-key">引用：</span>
      <span className="help-value">&lt;引用</span>
    </p>
    <p>
      <span className="help-key">嵌套引用：</span>
      <span className="help-value">&lt;&lt;嵌套引用</span>
    </p>
    <p>
      <span className="help-key">分割线：</span>
      <span className="help-value">***或者---</span>
    </p>
    <p>
      <span className="help-key">超链接：</span>
      <span className="help-value">[超链接名字](超链接地址)</span>
    </p>
    <p>
      <span className="help-key">图片：</span>
      <span className="help-value">![图片名字](图片地址)</span>
    </p>
    <p>
      <span className="help-key">无序列表：</span>
      <span className="help-value">* 无序列表</span>
    </p>
    <p>
      <span className="help-key">有序列表：</span>
      <span className="help-value">1. 有序列表</span>
    </p>
    <p>
      <span className="help-key">表格表头：</span>
      <span className="help-value">表头|表头|表头</span>
    </p>
    <p>
      <span className="help-key">表格表头分割线：</span>
      <span className="help-value">
        ---|:--:|---:，冒号用来决定文字居中还是左右对齐
      </span>
    </p>
    <p>
      <span className="help-key">表格内容：</span>
      <span className="help-value">内容|内容|内容</span>
    </p>
    <p>
      <span className="help-key">单行代码：</span>
      <span className="help-value">`npm install`</span>
    </p>
    <p>
      <span className="help-key">多行代码：</span>
      <span className="help-value">
        使用\`\`\`包围，在起始\`\`\`后面跟语言即可实现高亮
      </span>
    </p>
    <p>
      <span className="help-key">备注：</span>
      <span className="help-value">
        Markdown支持HTML书写，如果以上语法不能完成，可以使用内嵌HTML的方式。例如：
        &lt;span style="color: red"&gt;test&lt;/span&gt;
      </span>
    </p>
  </div>
);
