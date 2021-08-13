import React, { Fragment, useCallback, useMemo } from 'react';

import styles from './styles.module.less';
import PanelHeader from '../PanelHeader';
import CreateObjective from './CreateObjective';
import { useSpace } from '../../hooks/use-space';
import { firebaseObjectToArray } from '../../utils/firebase-transformers';
import { List, Tag } from 'antd';
import { priorityIcons } from './ObjectiveForm';
import { useCurrentDiscussion } from '../../hooks/discussions';
import If from '../If';

interface Props {}

export const ObjectivesPanel = ({}: Props) => {
  const { space } = useSpace();
  const { discussion } = useCurrentDiscussion();

  const isCurrentObjective = useCallback(
    (objectiveId) => {
      return Object.keys(discussion?.objectiveIds || {}).includes(objectiveId);
    },
    [discussion],
  );

  const objectives = useMemo(() => {
    if (!space || !space.objectives) {
      return [];
    }

    return firebaseObjectToArray(space.objectives);
  }, [space]);

  return (
    <div>
      <PanelHeader title="Objectives" centerComponent={<CreateObjective />} />
      <List
        dataSource={objectives}
        renderItem={(objective) => (
          <List.Item>
            <List.Item.Meta
              avatar={priorityIcons[objective.priority]}
              title={
                <Fragment>
                  <strong>{objective.title}</strong>{' '}
                  <If
                    condition={isCurrentObjective(objective.id)}
                    then={() => <Tag>Discussion Objective</Tag>}
                  />
                </Fragment>
              }
              description={objective.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ObjectivesPanel;
