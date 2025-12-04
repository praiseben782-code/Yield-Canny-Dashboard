import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Check, Star, AlertTriangle, Skull, Clock, TrendingDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>YieldCanary - See Which High-Yield ETFs Are Quietly Dying</title>
        <meta 
          name="description" 
          content="The only tool that shows True Income Yield, Death Clock, and Canary Status for high-yield ETFs. Stop investing in funds that are quietly giving you your own money back." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐤</span>
              <span className="text-xl font-bold text-foreground">YieldCanary</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              The smartest way to invest in high-yield funds.
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Most high-yield ETFs quietly give you your own money back and call it income.
            </p>
            <p className="text-xl font-semibold text-foreground mb-8">
              We name the dying ones — and show exactly how many years they have left.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  See the Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The Only Tool That Tells You When a High-Yield ETF Is Dying
            </h2>
            <p className="text-lg text-muted-foreground">
              No fluff. No 40-page PDFs. Just the cold, hard truth about your "income" funds.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<TrendingDown className="h-8 w-8" />}
                title="True Income Yield"
                description="The real yield after stripping out return-of-capital. Not the marketing number."
              />
              <FeatureCard 
                icon={<Clock className="h-8 w-8" />}
                title="Death Clock"
                description="Exact number of years until 50% NAV erosion at the current ROC bleed rate."
              />
              <FeatureCard 
                icon={<AlertTriangle className="h-8 w-8" />}
                title="Canary Status"
                description="Alive / Dying / Dead status at a glance. Green means safe. Red means run."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8" />}
                title="Live ROC %"
                description="Monthly updates from actual 19a-1 filings. No guessing, no estimates."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Real Results | Real People
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Hear from others using YieldCanary!
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="Finally someone just says it out loud — half my 'high-yield' funds are dying. Sold three positions the day I saw the Death Clock under 4 years. Thank you."
                name="Morgan James"
                title="Co-Founder & CEO"
              />
              <TestimonialCard 
                quote="I was about to load up on another YieldMax single-stock disaster. One look at the red Dead Canary and the 1.8-year Death Clock saved me six figures. Worth 10× the price."
                name="John Smith"
                title="Private Investor"
              />
              <TestimonialCard 
                quote="Been in the high-yield game for 5 years and this is the first tool that actually shows True Income instead of the marketing yield. Every dividend investor needs this."
                name="Amy Schneider"
                title="Data Analyst"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Pricing for every investor
              </h2>
              <p className="text-lg text-muted-foreground">
                Stop guessing which high-yield ETFs are actually safe.<br />
                Choose the plan that fits your portfolio.
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mb-12">
              <Button variant="outline" className="rounded-full">Monthly</Button>
              <Button className="rounded-full">Yearly (Get 1 month free)</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard 
                name="Free"
                description="For anyone to get started"
                price="$0"
                period="/ month"
                features={[
                  "View all ETF tickers",
                  "Canary Status visible",
                  "4 sample ETFs fully unlocked",
                  "Basic filtering & search",
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />
              <PricingCard 
                name="Basic"
                description="Full access to the core Decay Radar"
                price="$89"
                period="/ year"
                features={[
                  "True Income Yield revealed",
                  "ROC % + ROC Health",
                  "Alive / Watch / Dead Canary status",
                  "Death Clock (years left)",
                  "Monthly updates included",
                  "Cancel anytime",
                ]}
                buttonText="Start Basic"
                featured
              />
              <PricingCard 
                name="Advanced"
                description="Never miss another dying fund"
                price="$189"
                period="/ year"
                features={[
                  "Everything in Basic +",
                  'Weekly "Dead Canary Alert" emails',
                  "Priority email support",
                  "Early access to new ETFs",
                  "Portfolio linking (coming soon)",
                  "Monthly YieldCanary Newsletter",
                ]}
                buttonText="Start Advanced"
                buttonVariant="outline"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐤</span>
              <span className="font-bold text-foreground">YieldCanary</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 YieldCanary. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="text-center p-6">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
  <div className="bg-background border border-border rounded-lg p-6">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-foreground text-foreground" />
      ))}
    </div>
    <p className="text-foreground mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  </div>
);

const PricingCard = ({ 
  name, 
  description, 
  price, 
  period, 
  features, 
  buttonText, 
  buttonVariant = "default",
  featured = false 
}: { 
  name: string; 
  description: string; 
  price: string; 
  period: string; 
  features: string[]; 
  buttonText: string; 
  buttonVariant?: "default" | "outline";
  featured?: boolean;
}) => (
  <div className={`rounded-lg p-8 ${featured ? 'border-2 border-foreground bg-muted/30' : 'border border-border bg-background'}`}>
    <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <div className="mb-6">
      <span className="text-4xl font-bold text-foreground">{price}</span>
      <span className="text-muted-foreground">{period}</span>
    </div>
    <Button className="w-full mb-6" variant={buttonVariant}>{buttonText}</Button>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2">
          <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
          <span className="text-sm text-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Landing;
