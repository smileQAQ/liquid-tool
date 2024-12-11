import { Flex, Input } from "antd";
import { useState } from "react";

export default function PanelItem({ label, type, value: defaultValue, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  const [text, setText] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <Flex justify="space-between" align="center" gap={10} flex={1}>
      <p style={{ flex: 1 }}>{label}</p>
      {type === "text" && <Input value={text} onChange={handleChange} style={{ flex: 3 }} />}
    </Flex>
  );
}