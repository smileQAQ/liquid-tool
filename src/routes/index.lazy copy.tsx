import { createFileRoute } from "@tanstack/react-router";
import { ConfigProvider, Layout, Select } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import ReactFlow, { ReactFlowProvider, Node } from "reactflow";
import { css } from "@emotion/react";
import "reactflow/dist/style.css";

const pages = import.meta.glob("/src/pages/**/index.tsx");

export const Route = createFileRoute("/index/lazy copy")({
  component: RouteComponent,
});

const headerCss = css`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  flex: 0 0 56px;
`;

const EmbeddedComponentNode = ({
  data,
}: {
  data: { component: React.ReactNode };
}) => {
  return (
    <div
      style={{
        height: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      {data.component}
    </div>
  );
};
const nodeTypes = {
  embeddedComponent: EmbeddedComponentNode,
};

function RouteComponent() {
  const [fileList, setfileList] = useState<Object[]>();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

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
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "embeddedComponent",
      position: { x: 0, y: 0 },
      data: { component: Component ? <Component /> : null },
    },
  ];

  useEffect(() => {
    if (selectedPage) {
      const loadComponent = async () => {
        const module = (await pages[selectedPage]()) as {
          default: React.ComponentType<any>;
        };
        setComponent(() => module.default);
      };
      loadComponent();
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
            <Select
              style={{ width: 120 }}
              options={fileList}
              onChange={handleSelectChange}
            ></Select>
          </Header>
          <Layout>
            <Sider></Sider>
            <Content>
              {Component && (
                <ReactFlowProvider>
                  <ReactFlow
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                    nodes={initialNodes}
                    nodeTypes={nodeTypes}
                  ></ReactFlow>
                </ReactFlowProvider>
              )}
            </Content>
            <Sider></Sider>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
}
