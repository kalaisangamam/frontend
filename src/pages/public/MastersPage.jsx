import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Masters from '../../components/masters/Masters.jsx';

const MastersPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">
      <Masters pageView />
    </div>
  </PublicLayout>
);

export default MastersPage;
