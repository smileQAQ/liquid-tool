import React, { useEffect } from "react";
import "./pc.scss";
import "./mb.scss";
import "./index";
import config from "./config.json"; 

export default function Index() {
  useEffect(()=>{
    console.log(config)
  }, [])
  return <div>
    <div>
      <div className="rColor">
        <p className="ccc">ender 5</p>
        <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
      </div>
    </div>
  </div>;
}
