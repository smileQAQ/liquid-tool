import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  ConfigProvider,
  Flex,
  Layout,
  Select,
  Space,
  message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { post } from "../util/request";

const pages = import.meta.glob("/src/pages/**/index.tsx");

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

const headerCss = css`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  flex: 0 0 56px;
`;

function RouteComponent() {
  const [fileList, setfileList] = useState<Object[]>();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const contentRef = useRef(null);
  useEffect(() => {
    setfileList(
      Object.keys(pages).map((v) => {
        return {
          value: v,
          label: v.split("/").at(-2),
        };
      })
    );
  }, []);

  useEffect(() => {
    if (selectedPage) {
      const loadComponent = async () => {
        const module = (await pages[selectedPage]()) as {
          default: React.ComponentType<any>;
        };
        setComponent(() => module.default);
      };
      loadComponent();
      console.log(contentRef.current);
    }
  }, [selectedPage]);

  const handleSelectChange = (value: string) => {
    setSelectedPage(value);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              siderBg: "#fff",
              headerBg: "#fff",
              bodyBg: "#fff",
            },
          },
        }}
      >
        <Layout style={{ height: "100vh" }}>
          <Header css={headerCss}>
            <Flex justify="space-between" align="center" flex={1}>
              <Select
                style={{ width: 120 }}
                options={fileList}
                onChange={handleSelectChange}
              ></Select>
              <Space>
                <Button
                  onClick={async () => {
                    if (!selectedPage) return;
                    const data = await post<{ message: string }>(
                      "/build-liquid",
                      {
                        folder: selectedPage.split("/").at(-2),
                      }
                    );
                    message.open({
                      type: "success",
                      content: data.message,
                    });
                  }}
                >
                  生成liquid
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedPage) return;
                    const data = await post<{ message: string }>(
                      "/create-project",
                      { folder: selectedPage.split("/").at(-2) }
                    );
                    message.open({
                      type: "success",
                      content: data.message,
                    });
                  }}
                >
                  新建项目
                </Button>
              </Space>
            </Flex>
          </Header>
          <Layout>
            <Content ref={contentRef}>{Component && <Component />}</Content>
            <Sider></Sider>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
}
