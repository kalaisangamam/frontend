import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Achievements from '../../components/home/Achievements.jsx';

const AchievementsPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">
      <Achievements pageView />
    </div>
  </PublicLayout>
);

export default AchievementsPage;
