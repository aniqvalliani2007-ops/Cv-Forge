import React from 'react';
import { ArrowRight, Check, Sparkles, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Upgrade = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out CVForge',
      features: [
        '3 CV customizations',
        'Basic templates',
        'ATS optimization',
        'PDF export'
      ],
      cta: 'Current Plan',
      popular: false,
      disabled: true
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Best for active job seekers',
      features: [
        'Unlimited customizations',
        'All premium templates',
        'Priority AI processing',
        'Advanced ATS insights',
        'Custom branding',
        'Email support'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      disabled: false
    },
    {
      name: 'Lifetime',
      price: '$199',
      period: 'one-time',
      description: 'Pay once, use forever',
      features: [
        'Everything in Pro',
        'Lifetime access',
        'Free future updates',
        'Priority support',
        'Early access to features'
      ],
      cta: 'Get Lifetime',
      popular: false,
      disabled: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 pt-20 sm:pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full border border-gray-200/50 bg-white/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 backdrop-blur-sm">
              <Sparkles className="mr-1.5 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4 text-gray-600" />
              Unlock unlimited customizations
            </div>
            
            <h1 className="mx-auto max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 px-4">
              Choose Your Plan
            </h1>
            
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 px-4">
              Upgrade to create unlimited tailored CVs and access premium features
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-lg border ${
                  plan.popular
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 shadow-sm'
                } bg-white p-6 sm:p-8 transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500">/ {plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-gray-700 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.disabled}
                  className={`mt-6 sm:mt-8 w-full rounded-md py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md'
                      : plan.disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Can I cancel anytime?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-sm text-gray-600">
                We accept all major credit cards, PayPal, and other popular payment methods through our secure payment processor.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Is there a refund policy?</h3>
              <p className="mt-2 text-sm text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-4">
            Ready to accelerate your job search?
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 px-4">
            Join thousands of job seekers who have upgraded their CV game
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:scale-105 w-full sm:w-auto max-w-xs"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Upgrade;
