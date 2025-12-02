import { Dashboard } from '@/components/dashboard/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>YieldCanary - Income ETF Health Monitor | See Which ETFs Are Quietly Dying</title>
        <meta 
          name="description" 
          content="Instantly see which income ETFs are healthy vs quietly dying from return-of-capital. Get the true income yield, death clock, and take-home cash returns after taxes." 
        />
        <meta name="keywords" content="ETF, income ETF, dividend ETF, ROC, return of capital, JEPI, QYLD, covered call ETF, yield" />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
