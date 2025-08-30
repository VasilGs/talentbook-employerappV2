import React, { useState } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { 
  Zap, 
  Star, 
  Crown, 
  Diamond, 
  Mail, 
  Users, 
  Trophy, 
  Shield,
  Check,
  Sparkles,
  Target,
  Globe,
  Lock
} from 'lucide-react'

interface AddOnsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AddOn {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  category: 'promotion' | 'outreach' | 'enterprise'
  icon: React.ReactNode
  popular?: boolean
  premium?: boolean
}

export function AddOnsModal({ isOpen, onClose }: AddOnsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'promotion' | 'outreach' | 'enterprise'>('promotion')

  const addOns: AddOn[] = [
    // Promotion Add-ons
    {
      id: 'spotlight-boost',
      name: 'Spotlight Boost',
      price: '€4.99',
      period: '48 hours',
      description: 'Extra visibility boost for job seekers',
      features: [
        '48 hours of enhanced profile visibility',
        'Priority placement in employer searches',
        'Increased profile views and engagement',
        'One-time boost activation',
        'Real-time visibility analytics'
      ],
      category: 'promotion',
      icon: <Sparkles className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'silver-promotion',
      name: 'Silver Promotion',
      price: '€500',
      period: 'month',
      description: 'Boost visibility for all your job posts',
      features: [
        'Enhanced job post visibility',
        'Priority placement in search results',
        'Applies to all job posts in account',
        'Monthly billing'
      ],
      category: 'promotion',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'gold-promotion',
      name: 'Gold Promotion',
      price: '€1,000',
      period: 'month',
      description: 'Premium visibility with advanced features',
      features: [
        'All Silver features',
        'Featured job post badges',
        'Higher search ranking',
        'Enhanced company branding'
      ],
      category: 'promotion',
      icon: <Crown className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'diamond-promotion',
      name: 'Diamond Promotion',
      price: '€1,500',
      period: 'month',
      description: 'Maximum exposure for your opportunities',
      features: [
        'All Gold features',
        'Top-tier placement guarantee',
        'Premium company spotlight',
        'Advanced analytics dashboard'
      ],
      category: 'promotion',
      icon: <Diamond className="w-6 h-6" />
    },
    {
      id: 'platinum-promotion',
      name: 'Platinum Promotion',
      price: '€2,000',
      period: 'month',
      description: 'Ultimate promotion package',
      features: [
        'All Diamond features',
        'Exclusive placement zones',
        'Dedicated account manager',
        'Custom branding options'
      ],
      category: 'promotion',
      icon: <Sparkles className="w-6 h-6" />,
      premium: true
    },
    {
      id: 'annual-promotion',
      name: 'Annual Promotion',
      price: '€10,000',
      period: 'year',
      description: 'Best value for year-round visibility',
      features: [
        'Equivalent to Gold level monthly',
        'Significant cost savings',
        'Consistent year-round promotion',
        'Priority customer support'
      ],
      category: 'promotion',
      icon: <Target className="w-6 h-6" />
    },

    // Outreach Add-ons
    {
      id: 'inmails-200',
      name: 'InMails - 200 pieces',
      price: '€1,000',
      period: 'month',
      description: 'Direct messaging to potential candidates',
      features: [
        '200 InMail messages per month',
        'Direct candidate outreach',
        'Cap: 50 messages per day per seat',
        'Message templates included'
      ],
      category: 'outreach',
      icon: <Mail className="w-6 h-6" />
    },
    {
      id: 'inmails-500',
      name: 'InMails - 500 pieces',
      price: '€1,500',
      period: 'month',
      description: 'Extended messaging for active recruiting',
      features: [
        '500 InMail messages per month',
        'Advanced candidate targeting',
        'Cap: 50 messages per day per seat',
        'Priority message delivery',
        'Advanced analytics'
      ],
      category: 'outreach',
      icon: <Mail className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'unlimited-connections',
      name: 'Unlimited Connection Invites',
      price: '€25,000',
      period: 'year',
      description: 'Connect with unlimited professionals',
      features: [
        'Unlimited connection requests',
        'Cap: 50 invites per day per seat',
        'Fair-use protections included',
        'Network expansion tools',
        'Connection analytics'
      ],
      category: 'outreach',
      icon: <Users className="w-6 h-6" />
    },

    // Enterprise Add-ons
    {
      id: 'brand-leaderboard',
      name: 'Top 100 Brand Leaderboard',
      price: '€100,000',
      period: 'year',
      description: 'Elite brand visibility and recognition',
      features: [
        'Featured in Top 100 Brand Leaderboard',
        'Premium brand positioning',
        'Enhanced company visibility',
        'Exclusive networking opportunities',
        'Quarterly brand reports'
      ],
      category: 'enterprise',
      icon: <Trophy className="w-6 h-6" />,
      premium: true
    },
    {
      id: 'enterprise-connect',
      name: 'Enterprise Connect',
      price: '€50,000',
      period: '6 months',
      description: 'GDPR-safe contact access with premium support',
      features: [
        'Double opt-in Contact Reveal',
        'GDPR-compliant contact access',
        'Dedicated support team',
        'Priority campaign management',
        'Advanced compliance tools'
      ],
      category: 'enterprise',
      icon: <Shield className="w-6 h-6" />
    }
  ]

  const categories = [
    { id: 'promotion', name: 'Promotion', icon: <Zap className="w-5 h-5" /> },
    { id: 'outreach', name: 'Outreach', icon: <Mail className="w-5 h-5" /> },
    { id: 'enterprise', name: 'Enterprise', icon: <Globe className="w-5 h-5" /> }
  ] as const

  const filteredAddOns = addOns.filter(addon => addon.category === selectedCategory)

  const getAddOnCardStyle = (addon: AddOn) => {
    if (addon.premium) {
      return 'bg-gradient-to-br from-purple-600/20 to-purple-700/10 border-purple-500/40 hover:border-purple-400/60'
    }
    if (addon.popular) {
      return 'bg-gradient-to-br from-[#FFC107]/20 to-[#FFB300]/10 border-[#FFC107]/40 hover:border-[#FFC107]/60'
    }
    return 'bg-white/5 border-white/10 hover:border-white/30'
  }

  const getIconStyle = (addon: AddOn) => {
    if (addon.premium) {
      return 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
    }
    if (addon.popular) {
      return 'bg-gradient-to-br from-[#FFC107] to-[#FFB300] text-black'
    }
    return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
  }

  const getBadge = (addon: AddOn) => {
    if (addon.premium) {
      return (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Crown className="w-3 h-3" />
          <span>PREMIUM</span>
        </div>
      )
    }
    if (addon.popular) {
      return (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>POPULAR</span>
        </div>
      )
    }
    return null
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border border-white/20 max-w-6xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FFB300] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-poppins">
            Premium Add-ons
          </h1>
          <p className="text-gray-300">
            Enhance your recruiting capabilities with our premium features
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10 flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#FFC107] text-black shadow-lg shadow-[#FFC107]/25'
                    : 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddOns.map((addon) => (
            <div 
              key={addon.id}
              className={`relative backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getAddOnCardStyle(addon)}`}
            >
              {getBadge(addon)}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${getIconStyle(addon)}`}>
                {addon.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {addon.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {addon.price}
                  </span>
                  <span className="text-gray-400 text-sm">
                    / {addon.period}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {addon.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    addon.premium
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                      : addon.popular
                      ? 'bg-[#FFC107] hover:bg-[#FFB300] text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {addon.premium ? 'Contact Sales' : 'Add to Plan'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Special Notes */}
        <div className="mt-8 space-y-4">
          {selectedCategory === 'outreach' && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Fair-Use Protections</h4>
                  <p className="text-blue-300 text-sm">
                    All outreach features include built-in fair-use protections to ensure compliance with platform guidelines and maintain a positive user experience for all members.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'enterprise' && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Enterprise Features</h4>
                  <p className="text-purple-300 text-sm">
                    Enterprise add-ons include dedicated support, priority processing, and advanced compliance features. Contact our sales team for custom enterprise solutions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Need a custom solution? Our enterprise team can create a tailored package for your specific needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium border border-white/20">
              Contact Sales
            </Button>
            <Button 
              onClick={onClose}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-6 py-2 rounded-lg font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}