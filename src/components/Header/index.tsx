import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

type PageTitleProps = {
  title: string;
};

const ORG_BENEFITS = 'Maki.life';
export function PageTitle({ title }: PageTitleProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default function Header(): ReactElement {
  return (
    <Helmet titleTemplate={`%s - ${ORG_BENEFITS}`} defaultTitle={ORG_BENEFITS}>
      <meta charSet="utf-8" />
      <title>{ORG_BENEFITS}</title>
    </Helmet>
  );
}
