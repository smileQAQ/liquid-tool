import React, { useEffect } from 'react';
import './pc.scss';
import './mb.scss';
import './index';
import config from './config.json';
import SM from '../../components/ScanMark';
import '@/styles/index.css';
import './i18n';
import { useTranslation } from 'react-i18next';
export default function Index() {
  const { t } = useTranslation();
  const domContent = (
    <div>
      <h2>{t('welcome')}</h2>
      <div>
        <div className="rColor">
          <p className="ccc" data-sid={'section_faq_title'}>
            {config.settings[0].value}
          </p>
          <img data-sid src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
        </div>
        <div>
          <p data-sid={'text_1734058568987'} className="text-center">
            {config.settings[2].value}
          </p>
        </div>
        <div data-sid={'text_1734072089382'}>{config.settings[3].value}</div>

        <SM element={<p>dfaasdf</p>} />
        <SM element={<p>123123</p>} data-id={'asdfasdf'} />
      </div>
    </div>
  );
  return domContent;
}
