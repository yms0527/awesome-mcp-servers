#!/usr/bin/env node

/**
 * GA4 Configuration Script for ETF Analytics Dashboard
 * Configures custom dimensions, user properties, and conversion events
 */

const { GoogleAuth } = require('google-auth-library');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { AnalyticsAdminServiceClient } = require('@google-analytics/admin');

// Configuration from environment variables
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '388072799';
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || 'G-FH17P76S7Y';
const GA4_API_KEY = process.env.GA4_API_KEY;
const PROPERTY_NAME = `properties/${GA4_PROPERTY_ID}`;

async function configureGA4() {
  console.log('🚀 Starting GA4 Configuration for ETF Analytics Dashboard...');
  
  // Validate environment variables
  if (!GA4_API_KEY) {
    console.error('❌ GA4_API_KEY environment variable is required');
    console.log('💡 Set it with: export GA4_API_KEY=your_api_key');
    return;
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS environment variable is required');
    return;
  }

  try {
    // Initialize the Analytics Admin client with API key
    const adminClient = new AnalyticsAdminServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      apiKey: GA4_API_KEY
    });

    console.log('✅ Analytics Admin Client initialized');
    console.log(`📊 Property ID: ${GA4_PROPERTY_ID}`);
    console.log(`📊 Measurement ID: ${GA4_MEASUREMENT_ID}`);

    // 1. Verify property access
    console.log('\n📋 Step 1: Verifying property access...');
    try {
      const [property] = await adminClient.getProperty({
        name: PROPERTY_NAME
      });
      console.log(`✅ Successfully accessed property: ${property.displayName}`);
      console.log(`   Property ID: ${property.name}`);
      console.log(`   Time Zone: ${property.timeZone}`);
    } catch (error) {
      console.error('❌ Error accessing property:', error.message);
      return;
    }

    // 2. Create Custom Dimensions
    console.log('\n📊 Step 2: Creating Custom Dimensions...');
    
    const customDimensions = [
      {
        parameterName: 'page_path',
        displayName: 'Page Path',
        description: 'Virtual path for SPA tabs (e.g., /overview, /news-sentiment)',
        scope: 'EVENT'
      },
      {
        parameterName: 'chart_id',
        displayName: 'Chart ID',
        description: 'Chart identifiers (e.g., price_trend, top_etfs)',
        scope: 'EVENT'
      },
      {
        parameterName: 'card_id',
        displayName: 'Card ID',
        description: 'News sentiment cards (e.g., microsoft, duolingo)',
        scope: 'EVENT'
      },
      {
        parameterName: 'sentiment',
        displayName: 'Sentiment',
        description: 'News sentiment values (e.g., Somewhat Bullish)',
        scope: 'EVENT'
      },
      {
        parameterName: 'action',
        displayName: 'Action',
        description: 'Interaction types (hover, click)',
        scope: 'EVENT'
      }
    ];

    for (const dimension of customDimensions) {
      try {
        const [customDimension] = await adminClient.createCustomDimension({
          parent: PROPERTY_NAME,
          customDimension: dimension
        });
        console.log(`✅ Created custom dimension: ${dimension.displayName} (${dimension.parameterName})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Custom dimension already exists: ${dimension.displayName}`);
        } else {
          console.error(`❌ Error creating ${dimension.displayName}:`, error.message);
        }
      }
    }

    // 3. Create User Properties
    console.log('\n👤 Step 3: Creating User Properties...');
    
    const userProperties = [
      {
        displayName: 'Device Type',
        description: 'Device category (desktop, mobile)'
      },
      {
        displayName: 'Session ID',
        description: 'Unique session identifier'
      }
    ];

    for (const userProperty of userProperties) {
      try {
        const [createdUserProperty] = await adminClient.createUserProperty({
          parent: PROPERTY_NAME,
          userProperty: userProperty
        });
        console.log(`✅ Created user property: ${userProperty.displayName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  User property already exists: ${userProperty.displayName}`);
        } else {
          console.error(`❌ Error creating ${userProperty.displayName}:`, error.message);
        }
      }
    }

    // 4. Configure Conversion Events
    console.log('\n🎯 Step 4: Configuring Conversion Events...');
    
    const conversionEvents = [
      {
        eventName: 'search',
        description: 'Search engagement tracking'
      },
      {
        eventName: 'chart_interaction',
        description: 'Chart engagement measurement'
      },
      {
        eventName: 'card_click',
        description: 'News sentiment interaction tracking'
      }
    ];

    for (const event of conversionEvents) {
      try {
        const [conversionEvent] = await adminClient.createConversionEvent({
          parent: PROPERTY_NAME,
          conversionEvent: {
            eventName: event.eventName,
            createTime: new Date().toISOString(),
            deletable: true,
            custom: true
          }
        });
        console.log(`✅ Created conversion event: ${event.eventName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Conversion event already exists: ${event.eventName}`);
        } else {
          console.error(`❌ Error creating conversion event ${event.eventName}:`, error.message);
        }
      }
    }

    // 5. Configure Data Retention
    console.log('\n🗄️  Step 5: Configuring Data Retention...');
    try {
      const [updatedProperty] = await adminClient.updateProperty({
        property: {
          name: PROPERTY_NAME,
          dataRetentionSettings: {
            eventDataRetention: 'FOURTEEN_MONTHS',
            resetUserDataOnNewActivity: true
          }
        },
        updateMask: {
          paths: ['data_retention_settings']
        }
      });
      console.log('✅ Data retention set to 14 months with reset on new activity');
    } catch (error) {
      console.error('❌ Error setting data retention:', error.message);
    }

    // 6. List current configuration
    console.log('\n📋 Step 6: Current Configuration Summary...');
    
    try {
      // List custom dimensions
      const [customDimensionsList] = await adminClient.listCustomDimensions({
        parent: PROPERTY_NAME
      });
      console.log(`\n📊 Custom Dimensions (${customDimensionsList.length}):`);
      customDimensionsList.forEach(dim => {
        console.log(`   • ${dim.displayName} (${dim.parameterName}) - ${dim.scope}`);
      });

      // List user properties
      const [userPropertiesList] = await adminClient.listUserProperties({
        parent: PROPERTY_NAME
      });
      console.log(`\n👤 User Properties (${userPropertiesList.length}):`);
      userPropertiesList.forEach(prop => {
        console.log(`   • ${prop.displayName}`);
      });

      // List conversion events
      const [conversionEventsList] = await adminClient.listConversionEvents({
        parent: PROPERTY_NAME
      });
      console.log(`\n🎯 Conversion Events (${conversionEventsList.length}):`);
      conversionEventsList.forEach(event => {
        console.log(`   • ${event.eventName} ${event.custom ? '(Custom)' : '(Standard)'}`);
      });

    } catch (error) {
      console.error('❌ Error listing configuration:', error.message);
    }

    console.log('\n🎉 GA4 Configuration Complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Configure GTM tags and triggers');
    console.log('   2. Test tracking implementation');
    console.log('   3. Verify events in GA4 DebugView');
    console.log('   4. Create custom reports and funnels');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the configuration
if (require.main === module) {
  configureGA4().catch(console.error);
}

module.exports = { configureGA4 }; 