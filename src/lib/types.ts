export type App = {
  id: string;
  name: string;
  description: string;
  icon: string;
  downloadLinks: {
    android?: string;
    windows?: string;
  };
  category: string;
  tags: string[];
};

export type AppSettings = {
  adsensePublisherId: string;
  googleSiteVerification: string;
};
