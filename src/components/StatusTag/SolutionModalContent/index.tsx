import { Select, Typography } from 'antd';
import React from 'react';

import { useCurrentDiscussion } from '../../../hooks/discussions';
import { DiscussionChange } from '../../../interfaces/discussions';

interface Props {
  setSolution: (id: string) => void;
}

export const SolutionModalContent = ({ setSolution }: Props) => {
  const { discussion } = useCurrentDiscussion();

  if (!discussion?.changes) {
    return <Typography.Text>There are no available versions available to link.</Typography.Text>;
  }

  return (
    <Select
      showSearch
      style={{ width: 400 }}
      placeholder="Select a change"
      optionFilterProp="children"
      onChange={(event: any) => setSolution(event)}
      allowClear
    >
      {Object.values(discussion?.changes).map((change: DiscussionChange) => (
        <Select.Option value={change.id} key={change.id}>
          {change.title}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SolutionModalContent;
