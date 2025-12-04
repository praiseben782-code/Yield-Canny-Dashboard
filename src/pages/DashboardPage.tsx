import { Dashboard } from '@/components/dashboard/Dashboard';
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - YieldCanary | Income ETF Health Monitor</title>
        <meta 
          name="description" 
          content="Monitor your income ETFs. See true yield, death clock, and canary status for all high-yield funds." 
        />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
