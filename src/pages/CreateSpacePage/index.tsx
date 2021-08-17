import { Button, Divider, Typography } from 'antd';
import dayjs from 'dayjs';
import firebase from 'firebase';
import React, { Fragment, useState } from 'react';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { Form } from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import { validateSchema } from '../../components/Form/validation';
import { PageTitle } from '../../components/Header';
import SpaceLayout from '../../components/Layout/SpaceLayout';
import { useUserId } from '../../hooks/use-user';
import { Space } from '../../interfaces/spaces';
import { joi } from '../../lib/joi';
import { getSpaceDetailsUrl } from '../../urls';
import styles from './styles.module.less';

interface Props {}

const schema = joi
  .object({
    name: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(schema);

export const CreateSpacePage = ({}: Props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const userId = useUserId();

  const onSubmit = async (values: any) => {
    const id = uuidv4();
    const final: Partial<Space> = {
      ...values,
      time: dayjs().unix(),
      id,
      ownerId: userId,
      adminIds: {
        [userId]: true,
      },
      memberIds: {
        [userId]: true,
      },
    };

    setLoading(true);
    const spacePath = `spaces/${id}`;
    await firebase.database().ref(spacePath).update(final);

    const userPath = `users/${userId}/spaceIds`;
    await firebase
      .database()
      .ref(userPath)
      .update({ [id]: true });
    setLoading(false);

    history.replace(getSpaceDetailsUrl(id));
  };

  return (
    <SpaceLayout hideHeaderSelect>
      <PageTitle title="Create Space" />
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Create Space
          </Typography.Title>
          <Divider />

          <Form
            onSubmit={onSubmit}
            key="edit-space"
            validator={validator}
            initialValues={{}}
            preventPrompt
          >
            {({ valid, pristine }) => (
              <Fragment>
                <Field
                  name="name"
                  component={Input}
                  type="text"
                  label="Space Name"
                  placeholder="Our new space"
                />
                <Button
                  disabled={!valid || pristine}
                  type="primary"
                  block
                  size="large"
                  htmlType="submit"
                  loading={loading}
                >
                  Create Space
                </Button>
              </Fragment>
            )}
          </Form>
        </div>
      </div>
    </SpaceLayout>
  );
};

export default CreateSpacePage;
