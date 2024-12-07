import { createLazyFileRoute } from "@tanstack/react-router";
import { Select } from "antd";
import { useEffect, useState } from "react";

const pages = import.meta.glob("/src/pages/**/index.tsx");

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

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
      <Select
        style={{ width: 120 }}
        options={fileList}
        onChange={handleSelectChange}
      ></Select>
      {Component && <Component />}
    </>
  );
}
