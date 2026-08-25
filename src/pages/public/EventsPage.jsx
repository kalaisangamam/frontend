import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Events from '../../components/events/Events.jsx';

const EventsPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">
      <Events />
    </div>
  </PublicLayout>
);

export default EventsPage;
