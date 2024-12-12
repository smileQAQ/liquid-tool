import React, { useEffect } from "react";
import "./pc.scss";
import "./mb.scss";
import "./index";
import config from "./config.json";
export default function Index() {
  const domContent = (
    <div>
      <div>
        <div className="rColor">
          <p className="ccc" data-sid={"section_faq_title"}>
            {config.settings[0].value}
          </p>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt=""
          />
        </div>
        <div>
          <p data-sid>1231</p>
        </div>
        <div data-sid>cccc</div>
      </div>
    </div>
  );
  return domContent;
}
