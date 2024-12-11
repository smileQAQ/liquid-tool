import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  ConfigProvider,
  Flex,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { post } from "../util/request";
import Panel from "../components/Panel";
import { Config } from "../util/settings";
import Selecto from "react-selecto";
import Scan from "../components/Scan";

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
  const [fileList, setFileList] = useState<object[]>();
  const [fileData, setFileData] = useState<Config[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [domString, setDomString] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setFileList(
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

      post<{ data: string }>(
        "/getProjectData",
        {
          folder: selectedPage.split("/").at(-2),
        }
      ).then(res=>{
        setFileData(JSON.parse(res.data));
      });
    }
  }, [selectedPage]);

  useEffect(() => {
    if (Component) {
      const timer = setTimeout(() => {
        if (contentRef.current) {
          setDomString(contentRef.current.innerHTML);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [Component]);

  const handleSelectChange = (value: string) => {
    setSelectedPage(value);
    window.location.hash = value.split("/").at(-2) ?? "";
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
                        dom: domString
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
                    setIsModalOpen(true)
                  }}
                >
                  新建项目
                </Button>
                <Modal title="新建项目" open={isModalOpen} onOk={async ()=>{
                  const data = await post<{ message: string }>(
                    "/create-project",
                    { newName: projectName}
                  );
                    message.open({
                      type: "success",
                      content: data.message,
                    });
                    setIsModalOpen(false)
                }} onCancel={()=>{setIsModalOpen(false)}}>
                  <Flex >
                    <div>项目名称</div>
                    <Input value={projectName} onChange={(e) => setProjectName(e.target.value)}></Input>
                  </Flex>
                </Modal>
              </Space>
            </Flex>
          </Header>
          <Layout>
            <Content ref={contentRef}>
              <Scan>
                {Component && <Component />}
              </Scan>
            </Content>
            <Sider width={400}>
              {fileData && <Panel fileData={fileData}></Panel>}
            </Sider>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
}
