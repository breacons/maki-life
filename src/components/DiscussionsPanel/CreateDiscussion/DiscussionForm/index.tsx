import _ from 'lodash-es';
import React from 'react';
import { Field } from 'react-final-form';

import { useSpace, useSpaceMembers } from '../../../../hooks/use-space';
import { Discussion } from '../../../../interfaces/discussions';
import { joi } from '../../../../lib/joi';
import Input, { TextArea } from '../../../Form/Input';
import Select, { Option } from '../../../Form/Select';
import { Step } from '../../../Form/SteppedForm/Step/Step';
import SteppedForm from '../../../Form/SteppedForm/SteppedForm';
import { validateSchema } from '../../../Form/validation';
import MapField from '../../MapField';

interface Props {
  onSubmit: (values: any) => void;
  loading: boolean;
  discussion?: Discussion | null;
}

const discussionSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(discussionSchema);

export const DiscussionForm = ({ onSubmit, loading, discussion }: Props) => {
  const { members } = useSpaceMembers();
  const { space } = useSpace();
  return (
    <SteppedForm
      validator={validator}
      onSubmit={(values) => {
        onSubmit({
          ...values,
          approverUserIds: _.mapValues(_.keyBy(values.approverUserIds), () => true),
          objectiveIds: _.mapValues(_.keyBy(values.objectiveIds), () => true),
        });
      }}
      keepDirtyOnReinitialize={true}
      initialValues={{
        ...(discussion || {}),
        approverUserIds: Object.keys(discussion?.approverUserIds || {}),
        objectiveIds: Object.keys(discussion?.objectiveIds || {}),
      }}
      isLoading={loading}
    >
      <Step title="General" expand description="General information of the discussion">
        <Field
          name="title"
          component={Input}
          type="text"
          label="Title"
          placeholder="Request for correction"
        />
        <Field
          name="description"
          component={TextArea}
          type="text"
          label="Description"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum ligula non metus viverra, a posuere justo cursus. Fusce pulvinar accumsan aliquam. Phasellus vitae efficitur velit. Cras euismod est eget dolor vestibulum, nec hendrerit est gravida. Praesent in tristique eros. Sed molestie quam at neque cursus pharetra. Curabitur vel justo congue, mollis erat sed, hendrerit dolor. Maecenas ac tincidunt tellus. Duis non justo lacus. Aenean eu dapibus nibh, id vehicula orci. Pellentesque vitae placerat felis. Mauris in ultrices dui, ut consectetur libero. Sed nisi arcu, tincidunt vel leo in, imperdiet finibus nunc. Curabitur orci velit, placerat sit amet magna ac, sagittis elementum orci. Phasellus feugiat laoreet laoreet. Ut at massa vitae massa vehicula iaculis."
          style={{ height: 180 }}
        />
        <Field
          name="objectiveIds"
          component={Select}
          type="text"
          label="Discussion Objectives"
          mode="multiple"
        >
          {Object.values(space?.objectives || {}).map((objective) => (
            <Option value={objective.id} key={objective.id}>
              {objective.title}
            </Option>
          ))}
        </Field>
      </Step>
      <Step title="Map" expand description="Area of interest of the discussion">
        <MapField />
      </Step>
      <Step
        title="Approvers"
        expand
        description="Members who will sign the document once an agreement is reached"
      >
        <Field
          name="approverUserIds"
          component={Select}
          label="Approvers"
          mode="multiple"
          type="text"
        >
          {members
            .filter((member) => Object.keys(space?.memberIds || {}).includes(member.id))
            .map((member) => (
              <Option value={member.id} key={member.id}>
                {member.firstName} {member.lastName}
              </Option>
            ))}
        </Field>
      </Step>
    </SteppedForm>
  );
};

export default DiscussionForm;
