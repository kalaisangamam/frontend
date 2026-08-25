import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Programs from '../../components/programs/Programs.jsx';

const ProgramsPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">
      <Programs />
    </div>
  </PublicLayout>
);

export default ProgramsPage;
