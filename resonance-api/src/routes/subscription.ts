import { Router, Request, Response } from 'express';

const router = Router();

// Mock subscription data
const subscriptions: Record<string, any> = {};

// GET /api/v1/subscription/:userId
router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const subscription = subscriptions[userId] || {
      userId,
      status: 'free',
      tier: 'free',
      features: {
        appsUnlocked: 3,
        aiCompanion: false,
        biometricTracking: false,
        voiceCloning: false,
        contentOffline: false,
        communityAccess: false,
      },
      createdAt: new Date(),
      endsAt: null,
    };

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// POST /api/v1/subscription/:userId/create
router.post('/:userId/create', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { tier = 'pro', paymentMethodId } = req.body;

    if (!['pro', 'pro-plus', 'lifetime'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const tierFeatures: Record<string, any> = {
      pro: {
        appsUnlocked: 17,
        aiCompanion: true,
        biometricTracking: true,
        voiceCloning: false,
        contentOffline: true,
        communityAccess: true,
        monthlyPrice: 9.99,
      },
      'pro-plus': {
        appsUnlocked: 17,
        aiCompanion: true,
        biometricTracking: true,
        voiceCloning: true,
        contentOffline: true,
        communityAccess: true,
        monthlyPrice: 19.99,
      },
      lifetime: {
        appsUnlocked: 17,
        aiCompanion: true,
        biometricTracking: true,
        voiceCloning: true,
        contentOffline: true,
        communityAccess: true,
        oneTimePrice: 199.99,
      },
    };

    const subscription = {
      userId,
      status: 'active',
      tier,
      features: tierFeatures[tier],
      createdAt: new Date(),
      renewsAt: tier === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSubscriptionId: `sub_${Date.now()}`,
    };

    subscriptions[userId] = subscription;

    // TODO: Process payment with Stripe
    // TODO: Send confirmation email

    res.status(201).json({
      success: true,
      subscription,
      message: `Subscribed to ${tier} tier`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// POST /api/v1/subscription/:userId/upgrade
router.post('/:userId/upgrade', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newTier } = req.body;

    const currentSubscription = subscriptions[userId];

    if (!currentSubscription) {
      return res.status(404).json({ error: 'No active subscription' });
    }

    // TODO: Process upgrade with Stripe
    currentSubscription.tier = newTier;
    currentSubscription.upgradeDate = new Date();

    res.json({
      success: true,
      subscription: currentSubscription,
      message: `Upgraded to ${newTier}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
});

// POST /api/v1/subscription/:userId/cancel
router.post('/:userId/cancel', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const subscription = subscriptions[userId];

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;

    // TODO: Cancel Stripe subscription

    res.json({
      success: true,
      message: 'Subscription cancelled',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// GET /api/v1/subscription/plans
router.get('/plans/all', (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        period: null,
        features: {
          apps: 3,
          aiCompanion: false,
          biometrics: false,
          voiceCloning: false,
          offline: false,
          community: false,
        },
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        period: 'month',
        features: {
          apps: 17,
          aiCompanion: true,
          biometrics: true,
          voiceCloning: false,
          offline: true,
          community: true,
        },
      },
      {
        id: 'pro-plus',
        name: 'Pro Plus',
        price: 19.99,
        period: 'month',
        features: {
          apps: 17,
          aiCompanion: true,
          biometrics: true,
          voiceCloning: true,
          offline: true,
          community: true,
        },
      },
      {
        id: 'lifetime',
        name: 'Lifetime',
        price: 199.99,
        period: 'one-time',
        features: {
          apps: 17,
          aiCompanion: true,
          biometrics: true,
          voiceCloning: true,
          offline: true,
          community: true,
        },
      },
    ];

    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

export default router;
