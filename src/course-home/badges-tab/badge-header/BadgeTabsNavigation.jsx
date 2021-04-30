import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
// import { getConfig } from '@edx/frontend-platform';

import messages from './messages';
import Tabs from './Tabs';
import LinkedLogo from '../logos';
import logo from '../assets/logo-badgr-black.svg';

function BadgeTabsNavigation({
  activeTabSlug, className, intl,
}) {
  const tabs = [
    {
      title: 'Progress',
      priority: 1,
      slug: 'progress',
      type: 'progress',
      url: './progress',
      disabled: false,
    },
    {
      title: 'Leaderboard',
      priority: 2,
      slug: 'leaderboard',
      type: 'leaderboard',
      url: './leaderboard',
      disabled: true,
    },
  ];
  //   flex-shrink-0
  return (
    <div className={classNames('badge-tabs-navigation', className)}>
      <div className="container-fluid">
        <Tabs
          className="badge-nav-tabs"
          aria-label={intl.formatMessage(messages['learn.navigation.badge.tabs.label'])}
        >
          <LinkedLogo
            className="logo"
            href="https://badgr.com/auth/login"
            src={logo}
            alt="Badgr"
            target="_blank"
          />
          {tabs.map(({
            url, title, slug, disabled,
          }) => (
            <a
              key={slug}
              className={classNames('nav-item nav-link', { active: slug === activeTabSlug }, { disabled: disabled === true })}
              href={url}
            >
              {title}
            </a>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

BadgeTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  intl: intlShape.isRequired,
};

BadgeTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(BadgeTabsNavigation);
