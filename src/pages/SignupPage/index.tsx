import { Button, Col, Divider, Row, Typography } from 'antd';
import React, { Fragment, useState } from 'react';
import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import { Link, Redirect } from 'react-router-dom';

import { Form } from '../../components/Form';
import Input, { Password } from '../../components/Form/Input';
import Select, { Option } from '../../components/Form/Select';
import { validateSchema } from '../../components/Form/validation';
import { PageTitle } from '../../components/Header';
import If from '../../components/If';
import Logo from '../../components/Logo';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import { UserType } from '../../interfaces/users';
import { joi } from '../../lib/joi';
import { RootState } from '../../redux/reducers';
import { URL_LANDING, URL_LOGIN, URL_SPACES } from '../../urls';
import styles from './styles.module.less';

const loginSchema = joi
  .object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required(),
    password: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    role: joi.string().required(),
    organisation: joi.string().required(),
    type: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(loginSchema);

export const SignupPage = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const [, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoaded(auth) && !isEmpty(auth)) {
    return <Redirect to={URL_SPACES} />;
  }

  const signUpWithFirebase = async ({ email, password, ...rest }: any) => {
    setError(false);
    setLoading(true);
    try {
      const userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const path = `users/${userCredentials.user?.uid}`;
      await firebase
        .database()
        .ref(path)
        .set({ email, ...rest });

      // history.push(URL_ADMIN);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageTitle title="Sign Up" />
      <If
        condition={!isLoaded(auth)}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
              <Link to={URL_LANDING}>
                <Logo width={120} className={styles.logo} />
              </Link>
            </div>
            <Divider />
            <Form
              onSubmit={signUpWithFirebase}
              key="edit-contact"
              validator={validator}
              initialValues={{}}
            >
              {({ valid, pristine }) => (
                <Fragment>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Field
                        name="firstName"
                        component={Input}
                        type="text"
                        label="First Name"
                        placeholder="John"
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="lastName"
                        component={Input}
                        type="text"
                        label="Last Name"
                        placeholder="Mapper"
                      />
                    </Col>
                  </Row>
                  <Field
                    name="email"
                    component={Input}
                    type="text"
                    label="E-mail Address"
                    placeholder="john@mapper.com"
                  />

                  <Row gutter={12}>
                    <Col span={12}>
                      <Field
                        name="role"
                        component={Input}
                        type="text"
                        label="Role"
                        placeholder="Head of Maps"
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="organisation"
                        component={Input}
                        type="text"
                        label="Organisation"
                        placeholder="Center of Maps"
                      />
                    </Col>
                  </Row>
                  <Field name="type" component={Select} type="text" label="User Mode">
                    <Option value={UserType.Editor}>
                      Editor
                      <br />
                      <Typography.Text type="secondary">
                        You will be able to modify maps and administrate discussions.
                      </Typography.Text>
                    </Option>
                    <Option value={UserType.Expert}>
                      Official / Domain Expert
                      <br />
                      <Typography.Text type="secondary">
                        You will be able to submit and approve change requests.
                      </Typography.Text>
                    </Option>
                  </Field>
                  <Field
                    name="password"
                    component={Password}
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                  />
                  <Button
                    disabled={!valid || pristine}
                    type="primary"
                    block
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    <strong>Register</strong>
                  </Button>
                  <Link to={URL_LOGIN} className={styles.signUp}>
                    <Button type="link">Already have an account? Log in!</Button>
                  </Link>
                </Fragment>
              )}
            </Form>
          </div>
        )}
      />
    </div>
  );
};

export default SignupPage;
