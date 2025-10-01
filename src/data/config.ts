export interface SiteConfig {
    siteName: string;
    siteShortName: string;
    siteDescription: string;
    siteUrl: string;

    //SEO
    defaultImage: string;

    // Socials
    socials?: Record<string, string>;

    // Business Information
    company: {
        name: string;
        founded: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        phone: string;
        phoneFormatted: string;
        email: string;
    };

    // Features
    features: {
        analytics?: Record<string, any>;
        forms?: Record<string, any>;
    };
}

export const config: SiteConfig = {
    siteName: "Your Site Name",
    siteShortName: "SiteShort",
    siteDescription: "An example site configuration",
    siteUrl: "https://your-site-url.com",

    //SEO
    defaultImage: "/default-image.png",
    
    // Socials
    socials: {
        twitter: "your_twitter_handle",
        facebook: "your_facebook_page",
        instagram: "your_instagram_handle",
        linkedin: "your_linkedin_page",
    },
    
    // Business Information
    company: {
        name: "The Little Cheese Collective",
        founded: "2020",
        address: "1234 Main St",
        city: "Your City",
        state: "Your State",
        zip: "12345",
        phone: "5551234567",
        phoneFormatted: "(555) 123-4567",
        email: "hello@littlecheese.com",
    },

    //Features
    features: {
        analytics: {
            googleAnalyticsId: "UA-XXXXXX-X",
        },
        forms: {
            web3FormsId: "your-web3forms-id",
        }
    },
}

export const siteInfo = {
  name: config.siteName,
  shortName: config.siteShortName,
  description: config.siteDescription,
  url: config.siteUrl,
  defaultImage: config.defaultImage,
};

export const companyInfo = config.company;
export const features = config.features;