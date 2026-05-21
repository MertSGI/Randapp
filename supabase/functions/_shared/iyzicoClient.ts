// Mock iyzico client wrapper for Edge Functions
// In a real environment, you'd use 'iyzipay' Node.js library wrapper or fetch API directly.

export const iyzicoClient = {
  initialize: (apiKey: string, secretKey: string, baseUrl: string) => {
    // Return a configured client object
    return {
      apiKey,
      secretKey,
      baseUrl
    };
  },
  
  // Placeholder for real iyzico subscription checkout form initialization
  createSubscriptionCheckoutForm: async (params: any) => {
    console.log("Mock calling iyzico to create checkout form...", params);
    // Real implementation would make a signed request to iyzico API
    return {
      status: 'success',
      checkoutFormContent: '<div id="iyzipay-checkout-form" class="popup">...</div>',
      token: 'mock_token_' + Date.now(),
      payWithIyzicoPageUrl: 'https://checkout.mock/randapp?tenantId=iyzico_mock'
    };
  }
};
