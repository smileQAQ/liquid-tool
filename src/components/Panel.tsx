import { useEffect, useState } from "react";
import { Config } from "../util/settings";
import PanelItem from "./PanelItem";
import {
  Button,
  Space,
  Select,
  Modal,
  Input,
  message,
  Popconfirm,
  Flex,
  Divider,
} from "antd";
import { post } from "../util/request";
import { useMainStore } from "./mainProvider";

export default function Panel({ fileData }: { fileData: Config }) {
  const mainStore = useMainStore();
  const [config, setConfig] = useState<Config>(fileData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFieldType, setNewFieldType] = useState<string | null>("text");
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([]);

  useEffect(() => {
    setConfig(fileData);
  }, [fileData]);

  const handleAddField = () => {
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const data = await post<{ message: string }>("/updateJson", {
      path: mainStore.getSelectFolder + "/config.json",
      json: config,
    });
    message.open({
      type: "success",
      content: data.message,
    });
  };
  const handleModalOk = async () => {
    if (newFieldType && newFieldLabel) {
      const newField = {
        type: newFieldType,
        id: `${newFieldType}_${Date.now()}`,
        label: newFieldLabel,
        value: newFieldType === "text" ? "" : undefined,
        default: newFieldType === "text" ? "" : undefined,
      };
      const updatedConfig = {
        ...config,
        settings: [...config.settings, newField],
      } as Config;
      setConfig(updatedConfig);
      const data = await post<{ message: string }>("/updateJson", {
        path: mainStore.getSelectFolder + "/config.json",
        json: updatedConfig,
      });
      message.open({
        type: "success",
        content: data.message,
      });
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    const updatedConfig = {
      ...config,
      settings: config.settings.filter((setting) => setting.id !== fieldId),
    };
    setConfig(updatedConfig);
    const data = await post<{ message: string }>("/updateJson", {
      path: mainStore.getSelectFolder + "/config.json",
      json: updatedConfig,
    });
    message.open({
      type: "success",
      content: data.message,
    });
  };

  const relevanceHandle = async (index: number) => {
    const data = await post<{ message: string }>("/relevance", {
      selectIndex: mainStore.getSelectIndex,
      index: index,
      path: mainStore.getSelectFolder,
    });
    message.open({
      type: "success",
      content: "关联成功",
    });
  };

  const handleAddOption = () => {
    setNewFieldOptions([...newFieldOptions, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newFieldOptions];
    updatedOptions[index] = value;
    setNewFieldOptions(updatedOptions);
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedSettings = [...config.settings];
    updatedSettings[index] = { ...updatedSettings[index], value: value };
    setConfig({ ...config, settings: updatedSettings });
  };

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 10 }}>
      {config.settings.map((setting, index) => (
        <div key={index}>
          <Flex gap={10}>
            {setting.type === "select" ? (
              <Select
                defaultValue={setting.default}
                style={{ width: "100%" }}
                options={setting.options?.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
            ) : (
              <PanelItem
                {...setting}
                onChange={(value) => handleFieldChange(index, value)}
              />
            )}
          </Flex>
          <Flex gap={10} style={{ marginTop: 10 }}>
            <Button type="primary" onClick={() => relevanceHandle(index)}>
              关联
            </Button>
            <Popconfirm
              title="你确定要删除这个字段吗？"
              onConfirm={() => handleDeleteField(setting.id)}
              okText="是"
              cancelText="否"
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </Flex>
        </div>
      ))}

      <Divider />
      <Space>
        <Button type="dashed" onClick={handleAddField}>
          添加字段
        </Button>
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </Space>
      <Modal
        title="添加字段"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          placeholder="选择字段类型"
          defaultValue={{ value: "text" }}
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(value) => setNewFieldType(value.value)}
        >
          <Select.Option value="text">文本(Text)</Select.Option>
          <Select.Option value="select">下拉选择</Select.Option>
        </Select>
        <Input
          placeholder="字段label"
          value={newFieldLabel}
          onChange={(e) => setNewFieldLabel(e.target.value)}
        />
        {newFieldType === "select" && (
          <>
            {newFieldOptions.map((option, index) => (
              <Input
                key={index}
                placeholder={`选项 ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{ marginBottom: 8 }}
              />
            ))}
            <Button type="dashed" onClick={handleAddOption}>
              添加选项
            </Button>
          </>
        )}
      </Modal>
    </Space>
  );
}
